import { describe, expect, it } from "vitest";
import { answerQuestion, nextButtonState, stepQuestion } from "@/lib/quiz-nav";

describe("quiz navigation", () => {
  it("keeps later answers when an earlier one changes", () => {
    const answers = answerQuestion([1, 2, 3, null], 0, 5);
    expect(answers).toEqual([5, 2, 3, null]);
  });

  it("steps forward through answered questions and finishes only on the last", () => {
    expect(stepQuestion(0, 108, 1)).toEqual({ index: 1, done: false });
    expect(stepQuestion(2, 108, 1)).toEqual({ index: 3, done: false });
    expect(stepQuestion(107, 108, 1)).toEqual({ index: 107, done: true });
    expect(stepQuestion(0, 108, -1)).toEqual({ index: 0, done: false });
    expect(stepQuestion(2, 108, -1)).toEqual({ index: 1, done: false });
  });

  it("disables next until the current question has an answer", () => {
    expect(nextButtonState(0, 108, null)).toEqual({ label: "下一题", enabled: false });
    expect(nextButtonState(1, 108, 4)).toEqual({ label: "下一题", enabled: true });
    expect(nextButtonState(107, 108, null)).toEqual({ label: "查看结果", enabled: false });
    expect(nextButtonState(107, 108, 2)).toEqual({ label: "查看结果", enabled: true });
  });
});
