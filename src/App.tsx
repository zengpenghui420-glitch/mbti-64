import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AccessDialog, AccessToast } from "@/components/AccessDialog";
import { Landing } from "@/components/Landing";
import { Quiz } from "@/components/Quiz";
import { ReportView } from "@/components/ReportView";
import { ResultView } from "@/components/ResultView";
import { Button } from "@/components/ui/button";
import { QUESTIONS } from "@/data/questions";
import {
  gateQuizView,
  isQuizHash,
  normalizeCode,
  parseDemoHash,
  redeemCode,
  redeemErrorText,
  rememberCode,
  rememberedCode,
  shouldAutoRedeem,
  successToast,
} from "@/lib/access";
import { DEMO_CODE, synthesizeAnswers } from "@/lib/demo";
import { answerQuestion, stepQuestion } from "@/lib/quiz-nav";
import { scoreAnswers } from "@/lib/score";
import { freshState, homeResume, isCompleteAttempt, loadState, retakeState, saveState, type SaveState } from "@/lib/storage";

let bootedUrlGate = false;

function codeFromLocation(): string {
  return normalizeCode(new URLSearchParams(window.location.search).get("code") ?? "");
}

function replaceHash(next: string) {
  const url = new URL(window.location.href);
  const target = next ? (next.startsWith("#") ? next : `#${next}`) : "";
  if (url.hash === target) return;
  url.hash = target;
  window.history.replaceState(null, "", url);
}

function initialState(): SaveState {
  const saved = loadState();
  const demo = parseDemoHash(window.location.hash);
  if (demo) {
    return { ...saved, view: demo.view, demo: true, answers: synthesizeAnswers(demo.code ?? DEMO_CODE) };
  }
  if (isCompleteAttempt(saved)) {
    return { ...saved, view: "home", demo: false };
  }
  return { ...saved, view: gateQuizView(saved.view, false) };
}

export default function App() {
  const [state, setState] = useState<SaveState>(initialState);
  const [unlocked, setUnlocked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogBusy, setDialogBusy] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [initialCode, setInitialCode] = useState(() => codeFromLocation() || rememberedCode());
  const [toast, setToast] = useState("");
  const pendingRef = useRef<"start" | "retake">("start");
  const viewRef = useRef(state.view);
  const paidRef = useRef(false);
  const busyRef = useRef(false);
  const requestRef = useRef<(action: "start" | "retake") => void>(() => {});
  const confirmRef = useRef<(raw: string, locked?: boolean) => void>(() => {});

  useEffect(() => {
    function onHash() {
      const hash = window.location.hash;
      const demo = parseDemoHash(hash);
      if (demo) {
        setState((current) => ({
          ...current,
          view: demo.view,
          demo: true,
          answers: synthesizeAnswers(demo.code ?? DEMO_CODE),
          index: QUESTIONS.length - 1,
        }));
        return;
      }
      if (!isQuizHash(hash)) return;
      if (viewRef.current === "quiz" && paidRef.current) return;
      const saved = loadState();
      requestRef.current(isCompleteAttempt(saved) ? "retake" : "start");
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (state.view === "home" && isCompleteAttempt(state) && isQuizHash(hash)) {
      replaceHash("");
      return;
    }
    if (!unlocked && isQuizHash(hash)) return;
    if (state.view === "quiz" && unlocked) {
      if (!isQuizHash(hash)) replaceHash("#/quiz");
      return;
    }
    if (isQuizHash(hash)) replaceHash(state.demo ? "#/demo" : "");
  }, [state, unlocked]);

  useEffect(() => {
    saveState({ ...state, view: gateQuizView(state.view, unlocked) });
  }, [state, unlocked]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const result = useMemo(() => scoreAnswers(state.answers), [state.answers]);

  function update(patch: Partial<SaveState> | ((current: SaveState) => SaveState)) {
    setState((current) => (typeof patch === "function" ? patch(current) : { ...current, ...patch }));
  }

  function beginStart() {
    update((current) => {
      if (!current.demo && current.answers.every((item) => item != null)) {
        return { ...current, view: "result", demo: false };
      }
      if (current.demo || current.answers.every((item) => item == null)) {
        return { ...freshState(), view: "quiz", gateOk: current.gateOk, nickname: current.nickname };
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

  function beginRetake() {
    update((current) => retakeState(current));
  }

  function requestQuiz(action: "start" | "retake") {
    if (busyRef.current) return;
    pendingRef.current = action;
    const code = codeFromLocation() || rememberedCode();
    setDialogError("");
    setInitialCode(code);
    setDialogOpen(true);
    if (code) {
      busyRef.current = true;
      void confirmCode(code, true);
    }
  }

  async function confirmCode(raw: string, locked = false) {
    const code = normalizeCode(raw);
    if (!code) {
      busyRef.current = false;
      setDialogBusy(false);
      setDialogError(redeemErrorText("empty"));
      setDialogOpen(true);
      return;
    }
    if (!locked) {
      if (busyRef.current) return;
      busyRef.current = true;
    }
    setDialogBusy(true);
    setDialogError("");
    const redeemed = await redeemCode(code);
    busyRef.current = false;
    setDialogBusy(false);
    if (!redeemed.ok) {
      setDialogError(redeemErrorText(redeemed.reason));
      setDialogOpen(true);
      return;
    }
    rememberCode(code);
    paidRef.current = true;
    setUnlocked(true);
    setDialogOpen(false);
    setToast(successToast(redeemed.remaining));
    if (pendingRef.current === "retake") beginRetake();
    else beginStart();
  }

  useEffect(() => {
    viewRef.current = state.view;
    confirmRef.current = confirmCode;
    requestRef.current = requestQuiz;
  });

  useEffect(() => {
    let cancel = false;
    const timer = window.setTimeout(() => {
      if (cancel || bootedUrlGate) return;
      bootedUrlGate = true;
      const hash = window.location.hash;
      const search = window.location.search;
      if (parseDemoHash(hash)) return;
      if (shouldAutoRedeem(hash, search)) {
        const saved = loadState();
        pendingRef.current = isCompleteAttempt(saved) ? "retake" : "start";
        const code = codeFromLocation();
        setInitialCode(code);
        setDialogOpen(true);
        busyRef.current = true;
        void confirmRef.current(code, true);
        return;
      }
      if (isQuizHash(hash)) {
        const saved = loadState();
        pendingRef.current = isCompleteAttempt(saved) ? "retake" : "start";
        setInitialCode(codeFromLocation() || rememberedCode());
        setDialogError("");
        setDialogOpen(true);
      }
    }, 0);
    return () => {
      cancel = true;
      window.clearTimeout(timer);
    };
  }, []);

  function start() {
    if (!state.demo && state.answers.every((item) => item != null)) {
      update({ view: "result", demo: false });
      return;
    }
    requestQuiz("start");
  }

  function showDemo() {
    replaceHash("#/demo");
    update({
      view: "result",
      demo: true,
      answers: synthesizeAnswers(DEMO_CODE),
      index: QUESTIONS.length - 1,
    });
  }

  function shell(node: ReactNode) {
    return (
      <>
        {node}
        {dialogOpen ? (
          <AccessDialog
            key={initialCode}
            open
            busy={dialogBusy}
            error={dialogError}
            initialCode={initialCode}
            onClose={() => setDialogOpen(false)}
            onSubmit={(code) => void confirmCode(code)}
          />
        ) : null}
        <AccessToast message={toast} />
      </>
    );
  }

  const view = gateQuizView(state.view, unlocked);

  if (view === "quiz") {
    return shell(
      <Quiz
        answers={state.answers}
        index={state.index}
        onExit={() => update({ view: "home" })}
        onBack={() =>
          update((current) => ({ ...current, index: stepQuestion(current.index, QUESTIONS.length, -1).index }))
        }
        onAnswer={(value) =>
          update((current) => ({
            ...current,
            answers: answerQuestion(current.answers, current.index, value),
            demo: false,
          }))
        }
        onAdvance={() =>
          update((current) => {
            const step = stepQuestion(current.index, QUESTIONS.length, 1);
            if (step.done) return { ...current, view: "result", demo: false };
            return { ...current, index: step.index };
          })
        }
      />,
    );
  }

  if (state.view === "result" || state.view === "report") {
    if (!result) {
      return shell(
        <div className="mx-auto grid min-h-svh max-w-md place-items-center px-4">
          <div className="grid gap-3 rounded-[28px] bg-white p-6 text-center shadow-sm">
            <h1 className="text-xl font-semibold">还没有完整结果</h1>
            <p className="text-sm leading-6 text-muted-foreground">108 题需要全部作答后才会结算。之前的进度如果还在，可以继续。</p>
            <Button
              type="button"
              variant="gold"
              size="xl"
              onClick={() => {
                if (state.answers.some((item) => item != null)) requestQuiz("start");
                else update({ view: "home" });
              }}
            >
              {state.answers.some((item) => item != null) ? "继续作答" : "回到首页"}
            </Button>
          </div>
        </div>,
      );
    }

    if (state.view === "report") {
      return shell(
        <ReportView
          result={result}
          demo={state.demo}
          nickname={state.nickname}
          onNickname={(nickname) => update({ nickname })}
          onBack={() => update({ view: "result" })}
        />,
      );
    }

    return shell(
      <ResultView
        result={result}
        demo={state.demo}
        nickname={state.nickname}
        onOpenReport={() => update({ view: "report" })}
        onRetake={() => requestQuiz("retake")}
        onHome={() => update({ view: "home" })}
      />,
    );
  }

  return shell(
    <Landing
      onStart={start}
      onRetake={() => requestQuiz("retake")}
      onDemo={showDemo}
      resume={homeResume(state.demo, state.answers)}
    />,
  );
}
