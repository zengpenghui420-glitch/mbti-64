import { DIMENSION_BY_ID, bandCopy } from "@/data/dimensions";
import { QUESTIONS, type Dimension } from "@/data/questions";

export type TypeCode =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

export type Identity = "A" | "T";
export type Stance = "C" | "H";
export type Suffix = "AC" | "AH" | "TC" | "TH";

export interface DimensionScore {
  dim: Dimension;
  /** 0–100，朝向 E / N / T / J / A / C。恰好 50 记入另一极。 */
  positive: number;
  letter: string;
  name: string;
  lean: number;
  text: string;
}

export interface QuizResult {
  type: TypeCode;
  identity: Identity;
  stance: Stance;
  suffix: Suffix;
  code: string;
  scores: Record<Dimension, DimensionScore>;
}

export function emptyAnswers(): Array<number | null> {
  return Array.from({ length: QUESTIONS.length }, () => null);
}

export function scoreAnswers(answers: ReadonlyArray<number | null>): QuizResult | null {
  if (answers.length !== QUESTIONS.length) return null;
  if (answers.some((value) => value == null || value < 1 || value > 5)) return null;

  const totals: Record<Dimension, { raw: number; n: number }> = {
    EI: { raw: 0, n: 0 },
    NS: { raw: 0, n: 0 },
    TF: { raw: 0, n: 0 },
    JP: { raw: 0, n: 0 },
    AT: { raw: 0, n: 0 },
    CH: { raw: 0, n: 0 },
  };

  QUESTIONS.forEach((question, index) => {
    const answer = answers[index] ?? 3;
    const bucket = totals[question.dim];
    bucket.raw += question.pole * (answer - 3);
    bucket.n += 1;
  });

  const scores = {} as Record<Dimension, DimensionScore>;
  (Object.keys(totals) as Dimension[]).forEach((dim) => {
    const { raw, n } = totals[dim];
    const span = 4 * n;
    const positive = span === 0 ? 50 : ((raw + 2 * n) / span) * 100;
    const meta = DIMENSION_BY_ID[dim];
    const band = bandCopy(meta, positive);
    scores[dim] = {
      dim,
      positive: Math.round(positive * 10) / 10,
      letter: band.letter,
      name: band.name,
      lean: band.lean,
      text: band.text,
    };
  });

  const type = `${scores.EI.letter}${scores.NS.letter}${scores.TF.letter}${scores.JP.letter}` as TypeCode;
  const identity = scores.AT.letter as Identity;
  const stance = scores.CH.letter as Stance;
  const suffix = `${identity}${stance}` as Suffix;

  return {
    type,
    identity,
    stance,
    suffix,
    code: `${type}-${suffix}`,
    scores,
  };
}

export function countHan(text: string): number {
  return (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
}
