/** Limited-use codes in MantleDB collection `mb` (not cat `c` or bazi `bz`). */

export const MANTLE_NS = "catquiz-zph420-codes";
export const MANTLE_COLLECTION = "mb";
export const MANTLE_KEY = "f60c0dae2088e5ccd5061a110aef0c0ff2a5b85f2658e78809c9123c9d82a22c";

const UNLOCK_KEY = "mbti64_unlocked";
const CODE_KEY = "mbti64_code";

export type RedeemReason = "invalid" | "exhausted" | "network";

export type RedeemResult = { ok: true; remaining: number } | { ok: false; reason: RedeemReason };

export function normalizeCode(value: string): string {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isSessionUnlocked(): boolean {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSessionUnlocked(code: string): void {
  try {
    sessionStorage.setItem(UNLOCK_KEY, "1");
    sessionStorage.setItem(CODE_KEY, code);
  } catch {
    /* 隐私模式写不进时，这一页仍可继续答。 */
  }
}

function recordUrl(code: string): string {
  return `https://mantledb.sh/v2/${MANTLE_NS}/${MANTLE_COLLECTION}/${encodeURIComponent(code)}`;
}

function incrementUrl(code: string): string {
  return `https://mantledb.sh/v2/increment/${MANTLE_NS}/${MANTLE_COLLECTION}/${encodeURIComponent(code)}`;
}

async function increment(code: string, by: number, fetchImpl: typeof fetch): Promise<{ remaining?: number }> {
  const response = await fetchImpl(incrementUrl(code), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Mantle-Key": MANTLE_KEY,
    },
    body: JSON.stringify({ key: "remaining", by }),
  });
  if (!response.ok) throw new Error(`net ${response.status}`);
  return (await response.json()) as { remaining?: number };
}

export async function redeemCode(code: string, fetchImpl: typeof fetch = fetch): Promise<RedeemResult> {
  const normalized = normalizeCode(code);
  if (!normalized) return { ok: false, reason: "invalid" };
  if (fetchImpl !== fetch) return redeemOnce(normalized, fetchImpl);
  const pending = inflight.get(normalized);
  if (pending) return pending;
  const job = redeemOnce(normalized, fetchImpl).finally(() => {
    if (inflight.get(normalized) === job) inflight.delete(normalized);
  });
  inflight.set(normalized, job);
  return job;
}

export function redeemErrorText(reason: RedeemReason | "empty"): string {
  if (reason === "exhausted") return "此验证码已用完（每个码限 3 次）";
  if (reason === "network") return "网络异常，请稍后重试";
  if (reason === "empty") return "请输入验证码";
  return "验证码不正确";
}

export function successToast(remaining: number): string {
  return remaining > 0 ? `验证成功，还可以测 ${remaining} 次` : "验证成功，这是本码最后一次";
}

const DEMO_HASH = /^#\/demo(?:\/([IE][NS][TF][JP]-(?:AC|AH|TC|TH))(\/report)?)?$/;

export function parseDemoHash(hash: string): { code: string | null; view: "result" | "report" } | null {
  const match = hash.match(DEMO_HASH);
  if (!match) return null;
  return { code: match[1] ?? null, view: match[2] ? "report" : "result" };
}

/** `#/quiz` is the answer route. It is never a demo preview. */
export function isQuizHash(hash: string): boolean {
  const path = (hash.startsWith("#") ? hash.slice(1) : hash).split("?")[0] ?? "";
  return path === "/quiz" || path.startsWith("/quiz/");
}

/** A saved or requested quiz view stays closed until this tab has redeemed a code. */
export function gateQuizView<T extends string>(view: T, unlocked: boolean): T | "home" {
  if (view === "quiz" && !unlocked) return "home";
  return view;
}

/** `?code=` auto-redeems only for a real start, never on a demo preview, and never twice in one tab. */
export function shouldAutoRedeem(hash: string, search: string, unlocked: boolean): boolean {
  if (unlocked || parseDemoHash(hash)) return false;
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return normalizeCode(params.get("code") ?? "").length > 0;
}

const inflight = new Map<string, Promise<RedeemResult>>();

async function redeemOnce(normalized: string, fetchImpl: typeof fetch): Promise<RedeemResult> {
  try {
    const got = await fetchImpl(recordUrl(normalized), {
      headers: { "X-Mantle-Key": MANTLE_KEY },
    });
    if (got.status === 404) return { ok: false, reason: "invalid" };
    if (!got.ok) return { ok: false, reason: "network" };
    const data = (await got.json()) as { remaining?: unknown };
    if (typeof data.remaining !== "number") return { ok: false, reason: "invalid" };
    if (data.remaining <= 0) return { ok: false, reason: "exhausted" };
    const after = await increment(normalized, -1, fetchImpl);
    const left = typeof after.remaining === "number" ? after.remaining : -1;
    if (left < 0) {
      try {
        await increment(normalized, 1, fetchImpl);
      } catch {
        /* 加回失败时仍拒绝本次进入。 */
      }
      return { ok: false, reason: "exhausted" };
    }
    return { ok: true, remaining: left };
  } catch {
    return { ok: false, reason: "network" };
  }
}
