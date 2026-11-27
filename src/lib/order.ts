/** Order ids for this quiz.
 *  A format-valid P+18 id starts immediately. This path makes no request.
 *  The "还可以测 N 次" line is remembered in this browser, per order id, and
 *  changes only when a new attempt starts. Refresh, continue, result restore,
 *  and 查看上次结果 leave it as it is. A format-valid id still starts after
 *  that count passes 3.
 *  Issued access codes stay on the Mantle path in access.ts.
 *  paidVerified is never shown.
 */

import { normalizeCode } from "@/lib/access";

export const ORDER_MAX = 3;
export const ORDER_USES_KEY = "mbti64_order_uses";

export type OrderBody = {
  ok: boolean;
  error?: string;
  remaining?: number;
  max?: number;
  uses?: number;
  paidVerified: false;
};

export type OrderDecision =
  | { type: "reject"; message: string }
  | { type: "unlock"; orderId: string; toast: string; paidVerified: false };

type UseMap = Record<string, number>;

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

export function orderFailText(_res?: { error?: string; reason?: string } | null): string {
  return "订单号格式不对，请到小红书「我的订单」里复制";
}

export function orderSuccessText(res: { uses?: number; remaining?: number } | null | undefined): string {
  if (!res || typeof res.uses !== "number" || res.uses > ORDER_MAX) return "验证成功";
  return typeof res.remaining === "number" && res.remaining > 0
    ? `验证成功，还可以测 ${res.remaining} 次`
    : "验证成功，这是最后一次";
}

function readOrderUseMap(): UseMap {
  try {
    const raw = JSON.parse(localStorage.getItem(ORDER_USES_KEY) || "{}") as unknown;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const out: UseMap = {};
    for (const [key, value] of Object.entries(raw)) {
      const n = Number(value);
      if (/^P\d{18}$/.test(key) && Number.isFinite(n) && n > 0) out[key] = Math.floor(n);
    }
    return out;
  } catch {
    return {};
  }
}

export function shownOrderUses(orderId: string): number {
  const n = readOrderUseMap()[normalizeOrderId(orderId)];
  return typeof n === "number" ? n : 0;
}

function noteDisplayedUse(orderId: string): OrderBody {
  const uses = shownOrderUses(orderId) + 1;
  const all = readOrderUseMap();
  all[orderId] = uses;
  try {
    localStorage.setItem(ORDER_USES_KEY, JSON.stringify(all));
  } catch {
    /* 写不进时这一次仍然可以开始。 */
  }
  return {
    ok: true,
    uses,
    remaining: Math.max(0, ORDER_MAX - uses),
    max: ORDER_MAX,
    paidVerified: false,
  };
}

export function redeemOrder(orderId: string): OrderBody {
  const normalized = normalizeOrderId(orderId);
  const bad = orderFormatError(normalized);
  if (bad) return { ok: false, error: bad, paidVerified: false };
  return noteDisplayedUse(normalized);
}

/** A format-valid id always unlocks. Pattern failures do not. */
export function submitOrderId(raw: string): OrderDecision | null {
  const cls = classifyInput(raw);
  if (cls.type === "order-invalid") return { type: "reject", message: orderFailText({ error: "invalid" }) };
  if (cls.type !== "order") return null;
  if (orderFormatError(cls.orderId)) return { type: "reject", message: orderFailText({ error: "invalid" }) };
  const redeemed = redeemOrder(cls.orderId);
  return {
    type: "unlock",
    orderId: cls.orderId,
    toast: redeemed.ok ? orderSuccessText(redeemed) : "验证成功",
    paidVerified: false,
  };
}
