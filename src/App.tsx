import { useEffect, useMemo, useState } from "react";
import { Landing } from "@/components/Landing";
import { Quiz } from "@/components/Quiz";
import { ReportView } from "@/components/ReportView";
import { ResultView } from "@/components/ResultView";
import { Button } from "@/components/ui/button";
import { accessConfig } from "@/config";
import { QUESTIONS } from "@/data/questions";
import { DEMO_CODE, synthesizeAnswers } from "@/lib/demo";
import { scoreAnswers } from "@/lib/score";
import { freshState, loadState, saveState, type SaveState } from "@/lib/storage";

const DEMO_HASH = /^#\/demo(?:\/([IE][NS][TF][JP]-(?:AC|AH|TC|TH))(\/report)?)?$/;

function demoFromHash(hash: string): { code: string; view: "result" | "report" } | null {
  const match = hash.match(DEMO_HASH);
  if (!match) return null;
  return { code: match[1] ?? DEMO_CODE, view: match[2] ? "report" : "result" };
}

export default function App() {
  const [state, setState] = useState<SaveState>(() => {
    const saved = loadState();
    const demo = demoFromHash(window.location.hash);
    if (demo) {
      return { ...saved, view: demo.view, demo: true, answers: synthesizeAnswers(demo.code) };
    }
    return saved;
  });

  useEffect(() => {
    function onHash() {
      const demo = demoFromHash(window.location.hash);
      if (!demo) return;
      setState((current) => ({
        ...current,
        view: demo.view,
        demo: true,
        answers: synthesizeAnswers(demo.code),
        index: QUESTIONS.length - 1,
      }));
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const result = useMemo(() => scoreAnswers(state.answers), [state.answers]);

  function update(patch: Partial<SaveState> | ((current: SaveState) => SaveState)) {
    setState((current) => (typeof patch === "function" ? patch(current) : { ...current, ...patch }));
  }

  function unlock(code: string) {
    const ok = accessConfig.inviteCodes.some((item) => item.toLowerCase() === code.trim().toLowerCase());
    if (ok) update({ gateOk: true });
    return ok;
  }

  function start() {
    update((current) => {
      if (current.demo) {
        return { ...freshState(), view: "quiz", gateOk: current.gateOk, nickname: current.nickname };
      }
      if (current.answers.every((item) => item != null)) {
        return { ...current, view: "result", demo: false };
      }
      const firstEmpty = current.answers.findIndex((item) => item == null);
      return {
        ...current,
        view: "quiz",
        demo: false,
        index: firstEmpty === -1 ? 0 : firstEmpty,
      };
    });
  }

  function showDemo() {
    update({
      view: "result",
      demo: true,
      answers: synthesizeAnswers(DEMO_CODE),
      index: QUESTIONS.length - 1,
    });
  }

  function retake() {
    update((current) => ({
      ...freshState(),
      view: "quiz",
      gateOk: current.gateOk,
      nickname: current.nickname,
    }));
  }

  if (state.view === "quiz") {
    return (
      <Quiz
        answers={state.answers}
        index={state.index}
        onExit={() => update({ view: "home" })}
        onBack={() => update((current) => ({ ...current, index: Math.max(0, current.index - 1) }))}
        onAnswer={(value) =>
          update((current) => {
            const answers = [...current.answers];
            answers[current.index] = value;
            return { ...current, answers, demo: false };
          })
        }
        onAdvance={() =>
          update((current) => {
            if (current.index >= QUESTIONS.length - 1) {
              return { ...current, view: "result", demo: false };
            }
            return { ...current, index: current.index + 1 };
          })
        }
      />
    );
  }

  if (state.view === "result" || state.view === "report") {
    if (!result) {
      return (
        <div className="mx-auto grid min-h-svh max-w-md place-items-center px-4">
          <div className="grid gap-3 rounded-[28px] bg-white p-6 text-center shadow-sm">
            <h1 className="text-xl font-semibold">还没有完整结果</h1>
            <p className="text-sm leading-6 text-muted-foreground">108 题需要全部作答后才会结算。之前的进度如果还在，可以继续。</p>
            <Button type="button" variant="gold" size="xl" onClick={() => update({ view: state.answers.some((item) => item != null) ? "quiz" : "home" })}>
              {state.answers.some((item) => item != null) ? "继续作答" : "回到首页"}
            </Button>
          </div>
        </div>
      );
    }

    if (state.view === "report") {
      return (
        <ReportView
          result={result}
          demo={state.demo}
          nickname={state.nickname}
          onNickname={(nickname) => update({ nickname })}
          onBack={() => update({ view: "result" })}
        />
      );
    }

    return (
      <ResultView
        result={result}
        demo={state.demo}
        nickname={state.nickname}
        onOpenReport={() => update({ view: "report" })}
        onRetake={retake}
        onHome={() => update({ view: "home" })}
      />
    );
  }

  const answered = state.demo ? 0 : state.answers.filter((item) => item != null).length;
  const resume = answered === 0 ? "new" : answered === state.answers.length ? "done" : "partial";
  return <Landing onStart={start} onDemo={showDemo} gateOk={state.gateOk} onUnlock={unlock} resume={resume} />;
}
