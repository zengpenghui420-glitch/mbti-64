import { afterEach, describe, expect, it, vi } from "vitest";
import { chargeForEntry, planOrderRefresh, type AccessSession } from "@/lib/access";
import {
  ORDER_USES_KEY,
  classifyInput,
  normalizeOrderId,
  orderFailText,
  orderFormatError,
  orderSuccessText,
  shownOrderUses,
  submitOrderId,
} from "@/lib/order";

const ORDER = "P246801357924680135";
const OTHER = "P847291038475610293";
const REPEAT = "P111111111111111111";
const BLOCK = "P121212121212121212";
const SEQUENCE = "P123456789012345678";
const SEQUENCE_DOWN = "P987654321098765432";
const P19 = "P9900000000000001378";

function installStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
  });
  return store;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("order ids", () => {
  it("keeps this quiz's display key off the soft-persimmon key", () => {
    expect(ORDER_USES_KEY).toBe("mbti64_order_uses");
    expect(ORDER_USES_KEY).not.toBe("soft_persimmon_order_uses");
  });

  it("normalizes a pasted order id and rejects lookalikes", () => {
    expect(normalizeOrderId(" 「p24 680135-7924.680135」 ")).toBe(ORDER);
    expect(normalizeOrderId("ｐ２４６８０１３５７９２４６８０１３５")).toBe(ORDER);
    expect(orderFormatError(ORDER)).toBe("");
    expect(orderFormatError(OTHER)).toBe("");
    expect(orderFormatError(REPEAT)).toBe("invalid");
    expect(orderFormatError(BLOCK)).toBe("invalid");
    expect(orderFormatError(SEQUENCE)).toBe("invalid");
    expect(orderFormatError(SEQUENCE_DOWN)).toBe("invalid");
    expect(orderFormatError(P19)).toBe("invalid");
    expect(orderFormatError("P123")).toBe("invalid");
    expect(classifyInput(`  ${ORDER}  `)).toEqual({ type: "order", orderId: ORDER });
    expect(classifyInput(SEQUENCE)).toEqual({ type: "order", orderId: SEQUENCE });
    expect(classifyInput(P19)).toEqual({ type: "order-invalid" });
    expect(classifyInput("P1234567890")).toEqual({ type: "order-invalid" });
    expect(classifyInput("mb cmqf")).toEqual({ type: "code", code: "MBCMQF" });
    expect(classifyInput("")).toEqual({ type: "empty" });
  });

  it("uses the display copy and never the blocked order errors", () => {
    expect(orderSuccessText({ uses: 1, remaining: 2 })).toBe("验证成功，还可以测 2 次");
    expect(orderSuccessText({ uses: 2, remaining: 1 })).toBe("验证成功，还可以测 1 次");
    expect(orderSuccessText({ uses: 3, remaining: 0 })).toBe("验证成功，这是最后一次");
    expect(orderSuccessText({ uses: 4, remaining: 0 })).toBe("验证成功");
    expect(orderFailText({ error: "invalid" })).toContain("订单号格式不对");
    expect(orderFailText({ error: "invalid" })).toContain("我的订单");
    const blocked = ["次数已经用完", "暂时验证不了", "paidVerified"];
    for (const text of [
      orderSuccessText({ uses: 1, remaining: 2 }),
      orderSuccessText({ uses: 4, remaining: 0 }),
      orderFailText({ error: "exhausted" }),
      orderFailText({ error: "rate_limited" }),
      orderFailText(null),
    ]) {
      for (const word of blocked) expect(text).not.toContain(word);
    }
  });
});

describe("on-device order unlock", () => {
  it("unlocks a valid id with no order request and remembers the count per id", () => {
    const store = installStorage();
    const fetchImpl = vi.fn(() => {
      throw new Error("order path must not fetch");
    });
    vi.stubGlobal("fetch", fetchImpl);
    const first = submitOrderId(` 「p24 680135-7924.680135」 `);
    expect(first).toEqual({
      type: "unlock",
      orderId: ORDER,
      toast: "验证成功，还可以测 2 次",
      paidVerified: false,
    });
    expect(shownOrderUses(ORDER)).toBe(1);
    expect(JSON.parse(store.get(ORDER_USES_KEY) ?? "{}")).toEqual({ [ORDER]: 1 });
    expect(store.has("soft_persimmon_order_uses")).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(submitOrderId(OTHER)?.type).toBe("unlock");
    expect(shownOrderUses(ORDER)).toBe(1);
    expect(shownOrderUses(OTHER)).toBe(1);
  });

  it("rejects 19-digit, repeating, and sequence ids locally", () => {
    const store = installStorage();
    const fetchImpl = vi.fn();
    vi.stubGlobal("fetch", fetchImpl);
    for (const raw of [P19, REPEAT, BLOCK, SEQUENCE, SEQUENCE_DOWN]) {
      expect(submitOrderId(raw)).toEqual({
        type: "reject",
        message: "订单号格式不对，请到小红书「我的订单」里复制",
      });
    }
    expect(store.size).toBe(0);
    expect(shownOrderUses(ORDER)).toBe(0);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not advance on refresh, continue, result restore, or 查看上次结果", () => {
    installStorage();
    expect(submitOrderId(ORDER)?.type).toBe("unlock");
    const running: AccessSession = { kind: "order", phase: "running", id: ORDER };
    const done: AccessSession = { kind: "order", phase: "result", id: ORDER };
    expect(chargeForEntry("start", running)).toBe(false);
    expect(planOrderRefresh(running, "#/quiz", false)).toBe("resume-quiz");
    expect(planOrderRefresh(done, "#/quiz", true)).toBe("peek-result");
    expect(planOrderRefresh(running, "", false)).toBe("leave");
    expect(chargeForEntry("result", done)).toBe(false);
    expect(chargeForEntry("demo", { kind: "", phase: "", id: "" })).toBe(false);
    expect(shownOrderUses(ORDER)).toBe(1);
  });

  it("advances on 再测一次 and still unlocks after three displayed starts", () => {
    installStorage();
    const running: AccessSession = { kind: "order", phase: "running", id: ORDER };
    expect(chargeForEntry("retake", running)).toBe(true);
    expect(submitOrderId(ORDER)).toMatchObject({ toast: "验证成功，还可以测 2 次", paidVerified: false });
    expect(submitOrderId(ORDER)).toMatchObject({ toast: "验证成功，还可以测 1 次", paidVerified: false });
    expect(submitOrderId(ORDER)).toMatchObject({ toast: "验证成功，这是最后一次", paidVerified: false });
    const later = submitOrderId(ORDER);
    expect(later).toEqual({
      type: "unlock",
      orderId: ORDER,
      toast: "验证成功",
      paidVerified: false,
    });
    expect(shownOrderUses(ORDER)).toBe(4);
    expect(later && later.type === "unlock" ? later.toast : "").not.toMatch(/用完|暂时验证不了/);
  });
});
