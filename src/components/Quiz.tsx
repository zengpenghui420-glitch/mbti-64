import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QUESTIONS } from "@/data/questions";
import { cn } from "cn";

const CHOICES = [
  { value: 1, label: "很不符合" },
  { value: 2, label: "不太符合" },
  { value: 3, label: "说不好" },
  { value: 4, label: "比较符合" },
  { value: 5, label: "非常符合" },
];

export function Quiz({
  answers,
  index,
  onAnswer,
  onAdvance,
  onBack,
  onExit,
}: {
  answers: Array<number | null>;
  index: number;
  onAnswer: (value: number) => void;
  onAdvance: () => void;
  onBack: () => void;
  onExit: () => void;
}) {
  const question = QUESTIONS[index];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [pauseAt, setPauseAt] = useState<number | null>(null);
  const seenPause = useRef(new Set<number>());
  const timer = useRef<number | null>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, [index, pauseAt]);

  useEffect(() => {
    return () => {
      if (timer.current != null) window.clearTimeout(timer.current);
    };
  }, []);

  if (!question) return null;

  const answeredCount = answers.filter((item) => item != null).length;
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);

  function choose(value: number) {
    if (locked) return;
    onAnswer(value);
    const isLast = index >= QUESTIONS.length - 1;
    const milestone = index === 35 || index === 71 ? index + 1 : null;
    if (!isLast && milestone && !seenPause.current.has(milestone)) {
      seenPause.current.add(milestone);
      setPauseAt(milestone);
      return;
    }
    if (isLast) {
      onAdvance();
      return;
    }
    setLocked(true);
    timer.current = window.setTimeout(() => {
      setLocked(false);
      onAdvance();
    }, 160);
  }

  if (pauseAt) {
    return (
      <QuizFrame
        progress={progress}
        indexLabel={`${pauseAt} / ${QUESTIONS.length}`}
        onExit={onExit}
        onBack={() => setPauseAt(null)}
      >
        <Card className="bg-white/90 shadow-sm">
          <CardContent className="grid gap-4">
            <p className="text-sm font-medium text-primary">歇一口气</p>
            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
              {pauseAt === 36 ? "已经走完三分之一" : "已经过半了"}
            </h2>
            <p className="leading-7 text-muted-foreground">
              {pauseAt === 36
                ? "后面仍是同一套题。不会突然弹出付费，也不会先给半份结果。答完 108 题，64 型会一次给你。"
                : "还剩 36 题。全部答完后立刻给出主类型、后缀和可以带走的千字报告，中间不另收费。"}
            </p>
            <Button
              type="button"
              variant="gold"
              size="xl"
              onClick={() => {
                setPauseAt(null);
                onAdvance();
              }}
            >
              继续
            </Button>
          </CardContent>
        </Card>
      </QuizFrame>
    );
  }

  return (
    <QuizFrame
      progress={progress}
      indexLabel={`${index + 1} / ${QUESTIONS.length}`}
      onExit={onExit}
      onBack={index > 0 ? onBack : undefined}
    >
      <p className="sr-only" aria-live="polite">
        第 {index + 1} 题，共 {QUESTIONS.length} 题
      </p>
      <Card className="bg-white/90 shadow-sm">
        <CardContent className="grid gap-5">
          <p className="text-sm text-muted-foreground">按平时的你来选，不必选更好看的答案。</p>
          <h2 ref={headingRef} tabIndex={-1} className="text-xl leading-8 font-semibold outline-none md:text-2xl">
            {question.text}
          </h2>
          <div className="grid gap-2" role="radiogroup" aria-label="符合程度">
            {CHOICES.map((choice) => {
              const selected = answers[index] === choice.value;
              return (
                <Button
                  key={choice.value}
                  type="button"
                  variant="outline"
                  role="radio"
                  aria-checked={selected}
                  className={cn(
                    "h-auto w-full justify-start gap-3 rounded-2xl bg-white px-3 py-3 text-base",
                    selected && "border-primary bg-primary/10 text-foreground",
                  )}
                  onClick={() => choose(choice.value)}
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full bg-muted text-sm",
                      selected && "bg-primary text-primary-foreground",
                    )}
                  >
                    {choice.value}
                  </span>
                  {choice.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </QuizFrame>
  );
}

function QuizFrame({
  children,
  progress,
  indexLabel,
  onExit,
  onBack,
}: {
  children: ReactNode;
  progress: number;
  indexLabel: string;
  onExit: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-4 px-4 py-4">
      <header className="grid gap-3">
        <div className="flex items-center justify-between gap-2">
          <Button type="button" variant="ghost" className="px-2" onClick={onBack ?? onExit}>
            {onBack ? "上一题" : "返回"}
          </Button>
          <span className="text-sm font-medium tabular-nums">{indexLabel}</span>
          <span className="text-xs text-muted-foreground">无二次收费</span>
        </div>
        <Progress value={progress} aria-label="作答进度" className="h-2 bg-white" />
      </header>
      {children}
    </div>
  );
}
