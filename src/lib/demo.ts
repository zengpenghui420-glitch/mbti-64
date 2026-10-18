import { QUESTIONS, type Dimension } from "@/data/questions";

const POSITIVE: Record<Dimension, string> = {
  EI: "E",
  NS: "N",
  TF: "T",
  JP: "J",
  AT: "A",
  CH: "C",
};

/** 生成一份稳定、但不是全满分的作答，用来预览某个 64 型。 */
export function synthesizeAnswers(code: string): number[] {
  const type = code.slice(0, 4);
  const suffix = code.slice(5, 7);
  const want: Record<Dimension, string> = {
    EI: type[0] ?? "I",
    NS: type[1] ?? "N",
    TF: type[2] ?? "F",
    JP: type[3] ?? "P",
    AT: suffix[0] ?? "T",
    CH: suffix[1] ?? "C",
  };

  const deltas = [2, 1, 2, 1, 0, 2, 1, 1];
  const shift: Record<Dimension, number> = { EI: 0, NS: 3, TF: 5, JP: 1, AT: 6, CH: 2 };
  return QUESTIONS.map((question, index) => {
    const towardPositive = want[question.dim] === POSITIVE[question.dim];
    const delta = deltas[(index + shift[question.dim]) % deltas.length] ?? 1;
    const signed = towardPositive ? question.pole * delta : -question.pole * delta;
    return Math.min(5, Math.max(1, 3 + signed));
  });
}

export const DEMO_CODE = "ENFP-TC";
