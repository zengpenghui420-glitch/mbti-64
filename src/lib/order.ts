/** Xiaohongshu order ids for this quiz.
 *  A normalized P + 18 digits goes to the order API. Anything else stays on the
 *  Mantle path in access.ts. paidVerified is never shown.
 */

import { normalizeCode } from "@/lib/access";

export const API_BASE = "https://snappy-tundra-7uesdvk-zengpenghui420-glitch.vercel.app";
export const QUIZ_KEY = "mbti";
const ORDER_TIMEOUT_MS = 12000;
const DEVICE_KEY = "mbti64_device";

export type OrderBody = {
  ok: boolean;
  error?: string;
  reason?: string;
  remaining?: number;
  max?: number;
  uses?: number;
  quiz?: string;
  orderId?: string;
  bound?: boolean;
  paidVerified?: boolean;
  status?: number;
};

type OrderFetchError = Error & { timeout?: boolean; unavailable?: boolean; status?: number };
type TimeoutAction = "accept" | "return" | "retry" | "giveup";

type OrderHooks = {
  __ORDER_TIMEOUT_MS?: number;
  __ORDER_RECONCILE_MS?: number;
};

function hooks(): OrderHooks {
  return globalThis as OrderHooks;
}

export function normalizeOrderId(raw: string): string {
  let s = String(raw ?? "");
  if (s.length > 400) s = s.slice(0, 400);
  s = s.normalize("NFKC").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'")) ||
    (s.startsWith("`") && s.endsWith("`")) ||
    (s.startsWith("「") && s.endsWith("」"))
  ) {
    s = s.slice(1, -1).trim();
  }
  s = s.toUpperCase();
  s = s.replace(/[\s\u00A0]+/g, "");
  s = s.replace(/[-_./\\·•:：]+/g, "");
  return s;
}

function isRepeatingBlock(digits: string): boolean {
  for (const size of [1, 2, 3, 6, 9]) {
    const block = digits.slice(0, size);
    if (block.repeat(digits.length / size) === digits) return true;
  }
  return false;
}

function isPlusMinusOneMod10(digits: string): boolean {
  const step = (digits.charCodeAt(1) - digits.charCodeAt(0) + 10) % 10;
  if (step !== 1 && step !== 9) return false;
  for (let i = 1; i < digits.length; i++) {
    if ((digits.charCodeAt(i) - digits.charCodeAt(i - 1) + 10) % 10 !== step) return false;
  }
  return true;
}

export function orderFormatError(orderId: string): "" | "invalid" {
  if (!/^P\d{18}$/.test(orderId)) return "invalid";
  const digits = orderId.slice(1);
  if (isRepeatingBlock(digits) || isPlusMinusOneMod10(digits)) return "invalid";
  return "";
}

export type ClassifiedInput =
  | { type: "empty" }
  | { type: "order"; orderId: string }
  | { type: "order-invalid" }
  | { type: "code"; code: string };

export function classifyInput(raw: string): ClassifiedInput {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return { type: "empty" };
  const orderId = normalizeOrderId(raw);
  if (/^P\d{18}$/.test(orderId)) return { type: "order", orderId };
  if (/^P\d+$/.test(orderId) && orderId.length >= 10) return { type: "order-invalid" };
  const code = normalizeCode(raw);
  if (!code) return { type: "empty" };
  if (/^P\d{10,}$/.test(code)) return { type: "order-invalid" };
  return { type: "code", code };
}

export function usesOf(res: OrderBody | null | undefined): number | null {
  if (!res) return null;
  if (res.ok && typeof res.uses === "number") return res.uses;
  if (res.error === "not_found") return 0;
  return null;
}

export function decideTimeout(beforeUses: number | null, after: OrderBody | null): TimeoutAction {
  if (!after) return "giveup";
  if (!after.ok && after.error && after.error !== "not_found") return "return";
  const afterUses = usesOf(after);
  if (after.ok && beforeUses != null && afterUses != null && afterUses > beforeUses) return "accept";
  if (after.ok && beforeUses == null) return "accept";
  if (afterUses === 0 || (beforeUses != null && afterUses != null && afterUses === beforeUses)) return "retry";
  return "giveup";
}

export function orderFailText(res: { error?: string; reason?: string } | null | undefined): string {
  const e = res && (res.error || res.reason);
  if (e === "invalid") return "订单号格式不对，请到小红书「我的订单」里复制";
  if (e === "bound_other_quiz") return "这个订单号已经用来测过别的测试了";
  if (e === "exhausted") return "这个订单号的 3 次已经用完了";
  if (e === "rate_limited") return "试的次数有点多，请稍后再试";
  if (e === "empty") return "请贴上订单号";
  return "暂时验证不了，请稍后再试";
}

export function orderSuccessText(res: { remaining?: number }): string {
  return typeof res.remaining === "number" && res.remaining > 0
    ? `验证成功，还可以测 ${res.remaining} 次`
    : "验证成功，这是最后一次";
}

function orderTimeoutMs(): number {
  const override = hooks().__ORDER_TIMEOUT_MS;
  if (override) return override;
  return ORDER_TIMEOUT_MS;
}

function reconcileWaitMs(): number {
  const override = hooks().__ORDER_RECONCILE_MS;
  if (override != null) return override;
  return 1200;
}

function deviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (id && /^[A-Za-z0-9._:-]{8,128}$/.test(id)) return id;
    const buf = new Uint8Array(16);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(buf);
    else for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256);
    id = Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
    localStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return "";
  }
}

function orderHeaders(json: boolean): Record<string, string> {
  const h: Record<string, string> = {};
  if (json) h["Content-Type"] = "application/json";
  const id = deviceId();
  if (id) h["X-Device-Id"] = id;
  return h;
}

function failOrder(kind: "timeout" | "unavailable", status?: number): never {
  const err = new Error(kind) as OrderFetchError;
  if (kind === "timeout") err.timeout = true;
  else err.unavailable = true;
  if (status) err.status = status;
  throw err;
}

async function orderFetch(url: string, opts: RequestInit, fetchImpl: typeof fetch): Promise<OrderBody> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), orderTimeoutMs());
  try {
    let response: Response;
    try {
      response = await fetchImpl(url, { ...opts, signal: ctrl.signal, cache: "no-store" });
    } catch {
      failOrder("timeout");
    }
    const text = await response.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      if (response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504) {
        failOrder("timeout", response.status);
      }
      failOrder("unavailable", response.status);
    }
    const body = data as OrderBody;
    body.status = response.status;
    if (response.status === 404 && body.error === "not_found") return { ok: false, error: "not_found", status: 404 };
    if (response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504) {
      failOrder("timeout", response.status);
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}

export function orderGetUrl(orderId: string): string {
  return `${API_BASE}/order/get?quiz=${encodeURIComponent(QUIZ_KEY)}&orderId=${encodeURIComponent(orderId)}`;
}

export async function peekOrder(orderId: string, fetchImpl: typeof fetch = fetch): Promise<OrderBody> {
  const bad = orderFormatError(orderId);
  if (bad) return { ok: false, error: bad };
  return orderFetch(orderGetUrl(orderId), { method: "GET", headers: orderHeaders(false) }, fetchImpl);
}

async function postRedeem(orderId: string, fetchImpl: typeof fetch): Promise<OrderBody> {
  return orderFetch(
    `${API_BASE}/order/redeem`,
    {
      method: "POST",
      headers: orderHeaders(true),
      body: JSON.stringify({ quiz: QUIZ_KEY, orderId }),
    },
    fetchImpl,
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function reconcileTimeout(
  orderId: string,
  beforeUses: number | null,
  fetchImpl: typeof fetch,
): Promise<{ action: TimeoutAction; after: OrderBody | null }> {
  let after: OrderBody | null = null;
  try {
    after = await peekOrder(orderId, fetchImpl);
  } catch {
    after = null;
  }
  let action = decideTimeout(beforeUses, after);
  if (action === "retry" || action === "giveup") {
    await sleep(reconcileWaitMs());
    try {
      after = await peekOrder(orderId, fetchImpl);
    } catch {
      /* keep the previous peek */
    }
    const again = decideTimeout(beforeUses, after);
    if (again === "accept" || again === "return" || again === "retry") action = again;
  }
  return { action, after };
}

const inflight = new Map<string, Promise<OrderBody>>();

async function redeemOrderOnce(orderId: string, fetchImpl: typeof fetch): Promise<OrderBody> {
  const bad = orderFormatError(orderId);
  if (bad) return { ok: false, error: bad };
  let beforeUses: number | null = null;
  try {
    const before = await peekOrder(orderId, fetchImpl);
    if (
      before.ok &&
      ((before.remaining != null && before.remaining <= 0) ||
        (typeof before.max === "number" && typeof before.uses === "number" && before.uses >= before.max))
    ) {
      return { ok: false, error: "exhausted", remaining: 0, max: before.max || 3 };
    }
    if (!before.ok && before.error && before.error !== "not_found") return before;
    beforeUses = usesOf(before);
  } catch (error) {
    const err = error as OrderFetchError;
    if (!(err && (err.unavailable || err.timeout))) throw error;
  }

  async function once(): Promise<{ kind: "res"; res: OrderBody } | { kind: "timeout" }> {
    try {
      return { kind: "res", res: await postRedeem(orderId, fetchImpl) };
    } catch (error) {
      const err = error as OrderFetchError;
      if (err && err.timeout) return { kind: "timeout" };
      throw error;
    }
  }

  let outcome = await once();
  if (outcome.kind === "res") return outcome.res;
  let rec = await reconcileTimeout(orderId, beforeUses, fetchImpl);
  if (rec.action === "accept" || rec.action === "return") return rec.after ?? { ok: false, error: "unavailable" };
  if (rec.action !== "retry") failOrder("timeout");
  outcome = await once();
  if (outcome.kind === "res") return outcome.res;
  rec = await reconcileTimeout(orderId, beforeUses, fetchImpl);
  if (rec.action === "accept" || rec.action === "return") return rec.after ?? { ok: false, error: "unavailable" };
  failOrder("timeout");
}

export async function redeemOrder(orderId: string, fetchImpl: typeof fetch = fetch): Promise<OrderBody> {
  const normalized = normalizeOrderId(orderId);
  if (fetchImpl !== fetch) return redeemOrderOnce(normalized, fetchImpl);
  const pending = inflight.get(normalized);
  if (pending) return pending;
  const job = redeemOrderOnce(normalized, fetchImpl).finally(() => {
    if (inflight.get(normalized) === job) inflight.delete(normalized);
  });
  inflight.set(normalized, job);
  return job;
}
