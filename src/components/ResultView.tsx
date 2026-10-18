import { useState } from "react";
import { PersonaAvatar } from "@/components/Avatar";
import { BipolarBar } from "@/components/BipolarBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DIMENSIONS } from "@/data/dimensions";
import { getProfile } from "@/data/profiles";
import { IDENTITY, STANCE } from "@/data/suffixes";
import { temperamentOf } from "@/data/temperament";
import { downloadReport } from "@/lib/report";
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
  const temp = temperamentOf(result.type);
  const [copied, setCopied] = useState(false);
  const summary = `${result.code} ${profile.cnName} · ${profile.nicknames.join(" / ")} · ${identity.name}${stance.name}`;

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
        {demo ? <span className="text-xs text-muted-foreground">示例结果</span> : null}
      </header>

      <section
        className="overflow-hidden rounded-[32px] px-4 pb-6 pt-2 shadow-sm ring-1 ring-foreground/10"
        style={{ background: `linear-gradient(180deg, ${temp.wash} 0%, #ffffff 78%)` }}
      >
        <PersonaAvatar
          code={result.code}
          className="mx-auto w-[min(100%,250px)]"
          label={`${profile.cnName}，${profile.nicknames.join("、")}`}
        />
        <div className="-mt-2 text-center">
          <p className="text-sm font-semibold" style={{ color: temp.ink }}>
            {temp.name}
          </p>
          <p className="font-display mt-1 text-5xl tracking-wide">{result.code}</p>
          <h1 className="mt-1 text-3xl font-semibold">{profile.cnName}</h1>
          <p className="mt-1 text-base font-medium" style={{ color: temp.ink }}>
            {profile.nicknames.join(" · ")}
          </p>
          <p className="mt-2 text-muted-foreground">{profile.epithet}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="rounded-full px-3 py-1 text-sm" style={{ background: temp.chip, color: temp.ink }}>
              主类型 {result.type}
            </span>
            <span className="rounded-full px-3 py-1 text-sm" style={{ background: temp.chip, color: temp.ink }}>
              {identity.letter} {identity.name}
            </span>
            <span className="rounded-full px-3 py-1 text-sm" style={{ background: temp.chip, color: temp.ink }}>
              {stance.letter} {stance.name}
            </span>
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
          查看完整报告
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
