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

/** A new attempt. Drops saved answers so the next run cannot fall back into the previous result. */
export function retakeState(current: Pick<SaveState, "gateOk" | "nickname">): SaveState {
  return {
    ...freshState(),
    view: "quiz",
    gateOk: current.gateOk,
    nickname: current.nickname,
  };
}

export type HomeResume = "new" | "partial" | "done";

export function homeResume(demo: boolean, answers: Array<number | null>): HomeResume {
  if (demo) return "new";
  const answered = answers.filter((item) => item != null).length;
  if (answered === 0) return "new";
  if (answered === answers.length) return "done";
  return "partial";
}

export function isCompleteAttempt(state: Pick<SaveState, "demo" | "answers">): boolean {
  return !state.demo && state.answers.length > 0 && state.answers.every((item) => item != null);
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
