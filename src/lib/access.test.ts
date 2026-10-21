import { describe, expect, it } from "vitest";
import {
  gateQuizView,
  isQuizHash,
  normalizeCode,
  parseDemoHash,
  redeemCode,
  redeemErrorText,
  shouldAutoRedeem,
  successToast,
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
    expect(redeemErrorText("invalid")).toContain("不正确");
    expect(successToast(2)).toContain("2");
    expect(successToast(0)).toContain("最后一次");
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
  });
});
