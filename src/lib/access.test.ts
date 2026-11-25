import { describe, expect, it, vi } from "vitest";
import {
  chargeForEntry,
  gateQuizView,
  isQuizHash,
  markOrderResult,
  normalizeCode,
  parseDemoHash,
  planOrderRefresh,
  readAccessSession,
  redeemCode,
  redeemErrorText,
  rememberCode,
  rememberOrder,
  shouldAutoRedeem,
  successToast,
  type AccessSession,
} from "@/lib/access";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("access codes", () => {
  it("normalizes spacing and case", () => {
    expect(normalizeCode(" mb cmqf ")).toBe("MBCMQF");
    expect(normalizeCode("mb-zzzz")).toBe("MBZZZZ");
  });

  it("rejects a missing code without decrementing", async () => {
    const calls: string[] = [];
    const fetchImpl: typeof fetch = async (input) => {
      calls.push(String(input));
      return jsonResponse({ error: "missing" }, 404);
    };
    expect(await redeemCode("MBZZZZ", fetchImpl)).toEqual({ ok: false, reason: "invalid" });
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain("/mb/MBZZZZ");
    expect(calls[0]).not.toContain("/increment/");
  });

  it("rejects an exhausted code before decrementing", async () => {
    const fetchImpl: typeof fetch = async () => jsonResponse({ remaining: 0, max: 3 });
    expect(await redeemCode("MBCMQF", fetchImpl)).toEqual({ ok: false, reason: "exhausted" });
  });

  it("decrements a usable code and reports what is left", async () => {
    const bodies: string[] = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = String(input);
      if (url.includes("/increment/")) {
        bodies.push(String(init?.body));
        return jsonResponse({ remaining: 2, max: 3 });
      }
      return jsonResponse({ remaining: 3, max: 3 });
    };
    expect(await redeemCode("mbcmqf", fetchImpl)).toEqual({ ok: true, remaining: 2 });
    expect(bodies).toEqual([JSON.stringify({ key: "remaining", by: -1 })]);
  });

  it("adds a use back when the decrement goes below zero", async () => {
    const deltas: number[] = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = String(input);
      if (!url.includes("/increment/")) return jsonResponse({ remaining: 1, max: 3 });
      const body = JSON.parse(String(init?.body)) as { by: number };
      deltas.push(body.by);
      return jsonResponse({ remaining: body.by < 0 ? -1 : 0 });
    };
    expect(await redeemCode("MBCMQF", fetchImpl)).toEqual({ ok: false, reason: "exhausted" });
    expect(deltas).toEqual([-1, 1]);
  });

  it("reports a network failure when the request throws", async () => {
    const fetchImpl: typeof fetch = async () => {
      throw new Error("offline");
    };
    expect(await redeemCode("MBCMQF", fetchImpl)).toEqual({ ok: false, reason: "network" });
    expect(redeemErrorText("network")).toContain("网络");
    expect(redeemErrorText("invalid")).toContain("不对");
    expect(redeemErrorText("empty")).toContain("订单号");
    expect(successToast(2)).toContain("2");
    expect(successToast(0)).toContain("最后一次");
    expect(successToast(0)).not.toContain("本码");
  });

  it("keeps a non-order code on Mantle and off the order API", async () => {
    const urls: string[] = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = String(input);
      urls.push(url);
      if (url.includes("/increment/")) {
        expect(String(init?.body)).toBe(JSON.stringify({ key: "remaining", by: -1 }));
        return jsonResponse({ remaining: 2, max: 3 });
      }
      return jsonResponse({ remaining: 3, max: 3 });
    };
    expect(await redeemCode("mbcmqf", fetchImpl)).toEqual({ ok: true, remaining: 2 });
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.every((url) => url.startsWith("https://mantledb.sh/v2/") && url.includes("/mb/"))).toBe(true);
    expect(urls.some((url) => url.includes("/order/") || url.includes("vercel.app") || url.includes("/redeem"))).toBe(false);
  });

  it("keeps demo previews open and locks the quiz route", () => {
    expect(parseDemoHash("#/demo")).toEqual({ code: null, view: "result" });
    expect(parseDemoHash("#/demo/INTJ-AC/report")?.view).toBe("report");
    expect(isQuizHash("#/quiz")).toBe(true);
    expect(isQuizHash("#/quiz/2")).toBe(true);
    expect(isQuizHash("#/demo")).toBe(false);
    expect(isQuizHash("#/demo/ENFP-TC")).toBe(false);
    expect(gateQuizView("quiz", false)).toBe("home");
    expect(gateQuizView("quiz", true)).toBe("quiz");
    expect(gateQuizView("result", false)).toBe("result");
    expect(shouldAutoRedeem("#/demo/ENFP-TC", "?code=MBCMQF")).toBe(false);
    expect(shouldAutoRedeem("#/quiz", "?code=MBCMQF")).toBe(true);
    expect(shouldAutoRedeem("", "?code=MBCMQF")).toBe(true);
    expect(shouldAutoRedeem("", "")).toBe(false);
    const orderSession: AccessSession = { kind: "order", phase: "result", id: "P246801357924680135" };
    expect(shouldAutoRedeem("", "?code=P246801357924680135", orderSession)).toBe(false);
    expect(shouldAutoRedeem("#/quiz", "?code=P246801357924680135", { ...orderSession, phase: "running" })).toBe(false);
  });

  it("does not charge a demo, a saved result, or an in-progress order refresh", () => {
    const fresh: AccessSession = { kind: "", phase: "", id: "" };
    const running: AccessSession = { kind: "order", phase: "running", id: "P246801357924680135" };
    const done: AccessSession = { kind: "order", phase: "result", id: "P246801357924680135" };
    const code: AccessSession = { kind: "code", phase: "", id: "MBCMQF" };
    expect(chargeForEntry("demo", fresh)).toBe(false);
    expect(chargeForEntry("result", done)).toBe(false);
    expect(chargeForEntry("start", running)).toBe(false);
    expect(chargeForEntry("retake", running)).toBe(true);
    expect(chargeForEntry("retake", done)).toBe(true);
    expect(chargeForEntry("start", fresh)).toBe(true);
    expect(chargeForEntry("start", code)).toBe(true);
    expect(planOrderRefresh(done, "#/quiz", true)).toBe("peek-result");
    expect(planOrderRefresh(running, "#/quiz", false)).toBe("resume-quiz");
    expect(planOrderRefresh(running, "", false)).toBe("leave");
    expect(planOrderRefresh(running, "#/quiz", true)).toBe("leave");
    expect(planOrderRefresh(code, "#/quiz", false)).toBeNull();
  });

  it("remembers an order attempt separately from a Mantle code", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    });
    rememberOrder("P246801357924680135");
    expect(readAccessSession()).toEqual({ kind: "order", phase: "running", id: "P246801357924680135" });
    markOrderResult();
    expect(readAccessSession().phase).toBe("result");
    rememberCode("mbcmqf");
    expect(readAccessSession()).toEqual({ kind: "", phase: "", id: "MBCMQF" });
    vi.unstubAllGlobals();
  });
});
