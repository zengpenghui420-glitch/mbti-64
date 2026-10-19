/** Move through saved answers without clearing the ones ahead or behind. */

export function answerQuestion(answers: Array<number | null>, index: number, value: number): Array<number | null> {
  if (index < 0 || index >= answers.length) return answers;
  const next = [...answers];
  next[index] = value;
  return next;
}

export function stepQuestion(index: number, total: number, direction: 1 | -1): { index: number; done: boolean } {
  if (direction < 0) return { index: Math.max(0, index - 1), done: false };
  if (index >= total - 1) return { index, done: true };
  return { index: index + 1, done: false };
}

export function nextButtonState(
  index: number,
  total: number,
  answer: number | null,
): { label: "下一题" | "查看结果"; enabled: boolean } {
  return {
    label: index >= total - 1 ? "查看结果" : "下一题",
    enabled: answer != null,
  };
}
