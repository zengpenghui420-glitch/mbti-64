import { useState } from "react";
import { PersonaAvatar } from "@/components/Avatar";
import { BipolarBar } from "@/components/BipolarBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DIMENSIONS } from "@/data/dimensions";
import { getProfile } from "@/data/profiles";
import { IDENTITY, STANCE } from "@/data/suffixes";
import { downloadReport, subtypeLabel } from "@/lib/report";
import type { QuizResult } from "@/lib/score";

export function ResultView({
  result,
  demo,
  nickname,
  onOpenReport,
  onRetake,
  onHome,
}: {
  result: QuizResult;
  demo: boolean;
  nickname: string;
  onOpenReport: () => void;
  onRetake: () => void;
  onHome: () => void;
}) {
  const profile = getProfile(result.type);
  const identity = IDENTITY[result.identity];
  const stance = STANCE[result.stance];
  const [copied, setCopied] = useState(false);
  const summary = `我的结果是 ${result.code}「${subtypeLabel(result)}」。108 题答完即出，无二次收费。`;

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 pb-28">
      <header className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onHome}>
          回到首页
        </Button>
        <span className="text-xs text-muted-foreground">结果直出 · 无二次收费</span>
      </header>

      {demo ? (
        <p className="rounded-2xl bg-secondary px-4 py-3 text-sm leading-6 text-secondary-foreground">
          这是一份示例结果，用来预览 64 型和报告长什么样，不是你的作答。
        </p>
      ) : null}

      <section className="overflow-hidden rounded-[32px] bg-white/90 shadow-sm ring-1 ring-foreground/10">
        <div className="grid gap-2 px-5 pt-6 md:grid-cols-[180px_1fr] md:items-center md:px-8">
          <PersonaAvatar code={result.code} className="mx-auto w-40" label={subtypeLabel(result)} />
          <div className="pb-6 text-center md:text-left">
            <p className="text-sm font-medium text-primary">你的 64 型结果</p>
            <p className="font-display mt-1 text-5xl tracking-wide md:text-6xl">{result.code}</p>
            <h1 className="mt-2 text-2xl font-semibold">{subtypeLabel(result)}</h1>
            <p className="mt-2 text-muted-foreground">{profile.epithet}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              <span className="rounded-full bg-muted px-3 py-1 text-sm">主类型 {result.type}</span>
              <span className="rounded-full bg-muted px-3 py-1 text-sm">
                {identity.letter} {identity.name}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-sm">
                {stance.letter} {stance.name}
              </span>
            </div>
          </div>
        </div>
      </section>

      <Card className="bg-white/90 shadow-sm">
        <CardContent className="grid gap-4">
          <h2 className="text-base font-semibold">六维倾向</h2>
          {DIMENSIONS.map((meta) => (
            <BipolarBar key={meta.id} score={result.scores[meta.id]} />
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white/90 shadow-sm">
        <CardContent className="grid gap-3">
          <h2 className="text-base font-semibold">短画像</h2>
          <p className="leading-8">{profile.blurb}</p>
          <p className="leading-8 text-muted-foreground">
            {identity.name}：{identity.short}。{stance.name}：{stance.short}。
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="bg-white/90 shadow-sm">
          <CardContent className="grid gap-2">
            <h2 className="text-base font-semibold">优势</h2>
            <ul className="grid gap-2 pl-5 leading-7">
              {profile.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-white/90 shadow-sm">
          <CardContent className="grid gap-2">
            <h2 className="text-base font-semibold">留意</h2>
            <ul className="grid gap-2 pl-5 leading-7">
              {profile.watchouts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="no-print sticky bottom-3 z-10 grid gap-2 rounded-[28px] bg-white/95 p-3 shadow-lg ring-1 ring-foreground/10 backdrop-blur">
        <Button type="button" variant="gold" size="xl" onClick={onOpenReport}>
          查看千字报告
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" className="bg-white" onClick={() => downloadReport(result, nickname)}>
            下载 HTML
          </Button>
          <Button type="button" variant="outline" className="bg-white" onClick={copySummary}>
            {copied ? "已复制" : "复制结果"}
          </Button>
        </div>
        <button type="button" className="py-1 text-sm text-muted-foreground underline-offset-4 hover:underline" onClick={onRetake}>
          重新测试
        </button>
      </div>
    </div>
  );
}
