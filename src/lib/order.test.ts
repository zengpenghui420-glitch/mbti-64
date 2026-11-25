import { afterEach, describe, expect, it } from "vitest";
import {
  API_BASE,
  QUIZ_KEY,
  classifyInput,
  decideTimeout,
  normalizeOrderId,
  orderFailText,
  orderFormatError,
  orderSuccessText,
  peekOrder,
  redeemOrder,
} from "@/lib/order";

const ORDER = "P246801357924680135";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

afterEach(() => {
  delete (globalThis as { __ORDER_RECONCILE_MS?: number }).__ORDER_RECONCILE_MS;
  delete (globalThis as { __ORDER_TIMEOUT_MS?: number }).__ORDER_TIMEOUT_MS;
});

describe("order ids", () => {
  it("uses the mbti quiz key and the production API", () => {
    expect(QUIZ_KEY).toBe("mbti");
    expect(QUIZ_KEY).not.toBe("mbti-codes");
    expect(API_BASE).toBe("https://snappy-tundra-7uesdvk-zengpenghui420-glitch.vercel.app");
    expect(API_BASE.endsWith("/")).toBe(false);
  });

  it("normalizes a pasted order id and rejects lookalikes", () => {
    expect(normalizeOrderId(" 「p24 680135-7924.680135」 ")).toBe(ORDER);
    expect(normalizeOrderId("ｐ２４６８０１３５７９２４６８０１３５")).toBe(ORDER);
    expect(orderFormatError(ORDER)).toBe("");
    expect(orderFormatError("P111111111111111111")).toBe("invalid");
    expect(orderFormatError("P121212121212121212")).toBe("invalid");
    expect(orderFormatError("P123456789012345678")).toBe("invalid");
    expect(orderFormatError("P123")).toBe("invalid");
    expect(classifyInput(`  ${ORDER}  `)).toEqual({ type: "order", orderId: ORDER });
    expect(classifyInput("P123456789012345678")).toEqual({ type: "order", orderId: "P123456789012345678" });
    expect(classifyInput("P1234567890")).toEqual({ type: "order-invalid" });
    expect(classifyInput("mb cmqf")).toEqual({ type: "code", code: "MBCMQF" });
    expect(classifyInput("")).toEqual({ type: "empty" });
  });

  it("does not mention a paid flag in the buyer copy", () => {
    expect(orderSuccessText({ remaining: 2, paidVerified: false } as { remaining: number })).toBe(
      "验证成功，还可以测 2 次",
    );
    expect(orderSuccessText({ remaining: 0 })).toBe("验证成功，这是最后一次");
    expect(orderFailText({ error: "exhausted" })).toContain("3");
    expect(orderFailText({ error: "bound_other_quiz" })).toContain("别的测试");
    expect(orderFailText({ error: "invalid" })).toContain("我的订单");
    expect(orderFailText({ error: "rate_limited" })).toContain("稍后再试");
    expect(JSON.stringify(orderSuccessText({ remaining: 2 }))).not.toContain("paidVerified");
  });
});

describe("order redeem", () => {
  it("peeks, then posts one use for quiz mbti", async () => {
    const calls: Array<{ url: string; method: string; body: string }> = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = String(input);
      calls.push({ url, method: String(init?.method), body: String(init?.body ?? "") });
      if (url.includes("/order/get")) return jsonResponse({ ok: false, error: "not_found" }, 404);
      return jsonResponse({
        ok: true,
        remaining: 2,
        max: 3,
        uses: 1,
        quiz: "mbti",
        orderId: ORDER,
        bound: true,
        paidVerified: false,
      });
    };
    expect(await redeemOrder(ORDER, fetchImpl)).toMatchObject({ ok: true, remaining: 2, uses: 1 });
    expect(calls.map((call) => call.method)).toEqual(["GET", "POST"]);
    expect(calls[0]?.url).toBe(
      `${API_BASE}/order/get?quiz=mbti&orderId=${ORDER}`,
    );
    expect(calls[1]?.url).toBe(`${API_BASE}/order/redeem`);
    expect(calls[1]?.body).toBe(JSON.stringify({ quiz: "mbti", orderId: ORDER }));
    expect(calls.some((call) => call.url.includes("mbti-codes") || call.body.includes("mbti-codes"))).toBe(false);
    expect(calls.some((call) => call.url.includes("mantledb.sh"))).toBe(false);
  });

  it("reads a saved order without posting", async () => {
    const methods: string[] = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      methods.push(String(init?.method));
      expect(String(input)).toContain("/order/get?quiz=mbti&orderId=");
      return jsonResponse({ ok: true, remaining: 2, max: 3, uses: 1, quiz: "mbti", paidVerified: false });
    };
    expect(await peekOrder(ORDER, fetchImpl)).toMatchObject({ ok: true, uses: 1, remaining: 2 });
    expect(methods).toEqual(["GET"]);
  });

  it("spends two more uses on retake and rejects the fourth without posting", async () => {
    let uses = 1;
    const posts: string[] = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = String(input);
      if (url.includes("/order/get")) {
        return jsonResponse({ ok: true, remaining: 3 - uses, max: 3, uses, quiz: "mbti", paidVerified: false });
      }
      posts.push(String(init?.body));
      uses += 1;
      return jsonResponse({
        ok: true,
        remaining: 3 - uses,
        max: 3,
        uses,
        quiz: "mbti",
        orderId: ORDER,
        bound: true,
        paidVerified: false,
      });
    };
    expect(await redeemOrder(ORDER, fetchImpl)).toMatchObject({ ok: true, remaining: 1, uses: 2 });
    expect(await redeemOrder(ORDER, fetchImpl)).toMatchObject({ ok: true, remaining: 0, uses: 3 });
    expect(await redeemOrder(ORDER, fetchImpl)).toMatchObject({ ok: false, error: "exhausted", remaining: 0 });
    expect(posts).toHaveLength(2);
    expect(posts.every((body) => body === JSON.stringify({ quiz: "mbti", orderId: ORDER }))).toBe(true);
  });

  it("does not post when the order belongs to another quiz", async () => {
    const methods: string[] = [];
    const fetchImpl: typeof fetch = async (_input, init) => {
      methods.push(String(init?.method));
      return jsonResponse({ ok: false, error: "bound_other_quiz" }, 403);
    };
    expect(await redeemOrder(ORDER, fetchImpl)).toMatchObject({ ok: false, error: "bound_other_quiz" });
    expect(methods).toEqual(["GET"]);
  });

  it("rejects a fake order id before any request", async () => {
    const calls: string[] = [];
    const fetchImpl: typeof fetch = async (input) => {
      calls.push(String(input));
      return jsonResponse({ ok: true });
    };
    expect(await redeemOrder("P111111111111111111", fetchImpl)).toEqual({ ok: false, error: "invalid" });
    expect(calls).toEqual([]);
  });

  it("keeps a timed-out redeem when the peek shows the use landed", async () => {
    (globalThis as { __ORDER_RECONCILE_MS?: number }).__ORDER_RECONCILE_MS = 0;
    let uses = 0;
    let posts = 0;
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);
      if (url.includes("/order/redeem")) {
        posts += 1;
        uses = 1;
        throw new Error("abort");
      }
      if (uses === 0) return jsonResponse({ ok: false, error: "not_found" }, 404);
      return jsonResponse({ ok: true, remaining: 2, max: 3, uses: 1, quiz: "mbti", bound: true, paidVerified: false });
    };
    expect(await redeemOrder(ORDER, fetchImpl)).toMatchObject({ ok: true, remaining: 2, uses: 1 });
    expect(posts).toBe(1);
    expect(decideTimeout(0, { ok: true, uses: 1 })).toBe("accept");
    expect(decideTimeout(0, { ok: false, error: "not_found" })).toBe("retry");
  });

  it("posts again only when a timed-out redeem did not increase the use count", async () => {
    (globalThis as { __ORDER_RECONCILE_MS?: number }).__ORDER_RECONCILE_MS = 0;
    let posts = 0;
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);
      if (url.includes("/order/redeem")) {
        posts += 1;
        if (posts === 1) throw new Error("abort");
        return jsonResponse({ ok: true, remaining: 2, max: 3, uses: 1, quiz: "mbti", paidVerified: false });
      }
      return jsonResponse({ ok: false, error: "not_found" }, 404);
    };
    expect(await redeemOrder(ORDER, fetchImpl)).toMatchObject({ ok: true, remaining: 2, uses: 1 });
    expect(posts).toBe(2);
  });
});
