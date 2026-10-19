import { STORAGE_KEY } from "@/config";
import { QUESTIONS } from "@/data/questions";
import { emptyAnswers } from "@/lib/score";

export type View = "home" | "quiz" | "result" | "report";

export interface SaveState {
  view: View;
  answers: Array<number | null>;
  index: number;
  demo: boolean;
  nickname: string;
  /** 旧存档字段。真正的解锁只看本标签页的 sessionStorage，不看这里。 */
  gateOk: boolean;
}

export function freshState(): SaveState {
  return {
    view: "home",
    answers: emptyAnswers(),
    index: 0,
    demo: false,
    nickname: "",
    gateOk: false,
  };
}

function isAnswer(value: unknown): value is number | null {
  return value == null || (typeof value === "number" && value >= 1 && value <= 5);
}

export function loadState(): SaveState {
  const fallback = freshState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const data = JSON.parse(raw) as Partial<SaveState>;
    if (!Array.isArray(data.answers) || data.answers.length !== QUESTIONS.length) return fallback;
    if (!data.answers.every(isAnswer)) return fallback;
    const view = data.view;
    const safeView: View =
      view === "quiz" || view === "result" || view === "report" || view === "home" ? view : "home";
    return {
      view: safeView,
      answers: data.answers,
      index: Math.min(Math.max(data.index ?? 0, 0), QUESTIONS.length - 1),
      demo: Boolean(data.demo),
      nickname: typeof data.nickname === "string" ? data.nickname.slice(0, 16) : "",
      gateOk: Boolean(data.gateOk),
    };
  } catch {
    return fallback;
  }
}

export function saveState(state: SaveState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* 隐私模式等无法写入时，仍可在本次访问里完成测试。 */
  }
}
