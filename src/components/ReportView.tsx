import { PersonaAvatar } from "@/components/Avatar";
import { BipolarBar } from "@/components/BipolarBar";
import { Button } from "@/components/ui/button";
import { DIMENSIONS } from "@/data/dimensions";
import { getProfile } from "@/data/profiles";
import { temperamentOf } from "@/data/temperament";
import { downloadReport, buildReport } from "@/lib/report";
import type { QuizResult } from "@/lib/score";

export function ReportView({
  result,
  nickname,
  onNickname,
  onBack,
  demo,
}: {
  result: QuizResult;
  nickname: string;
  onNickname: (value: string) => void;
  onBack: () => void;
  demo: boolean;
}) {
  const report = buildReport(result, nickname);
  const profile = getProfile(result.type);
  const temp = temperamentOf(result.type);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 pb-16">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <Button type="button" variant="ghost" onClick={onBack}>
          返回结果
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="bg-white" onClick={() => downloadReport(result, nickname)}>
            下载 HTML
          </Button>
          <Button type="button" variant="gold" onClick={() => window.print()}>
            打印 / 存成 PDF
          </Button>
        </div>
      </div>

      <article id="report-sheet" className="grid gap-4">
        <header
          className="rounded-[28px] p-6 shadow-sm ring-1 ring-foreground/10"
          style={{ background: `linear-gradient(180deg, ${temp.wash} 0%, #ffffff 70%)` }}
        >
          <p className="text-sm font-medium" style={{ color: temp.ink }}>
            {temp.name}
            {demo ? " · 示例结果" : ""}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <PersonaAvatar code={result.code} className="w-24 shrink-0" label={report.subtitle} />
            <div>
              <p className="font-display text-4xl tracking-wide">{result.code}</p>
              <h1 className="mt-1 text-2xl font-semibold">{profile.cnName}</h1>
              <p className="text-sm font-medium" style={{ color: temp.ink }}>
                {profile.nicknames.join(" · ")}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{report.title}</p>
          <label className="no-print mt-4 grid gap-1 text-sm">
            <span className="text-muted-foreground">称呼</span>
            <input
              value={nickname}
              maxLength={16}
              onChange={(event) => onNickname(event.target.value)}
              placeholder="你的名字"
              className="h-11 rounded-full border bg-white px-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </label>
        </header>

        <div className="grid gap-3 rounded-[28px] bg-white/90 p-4 ring-1 ring-foreground/10">
          {DIMENSIONS.map((meta) => (
            <BipolarBar key={meta.id} score={result.scores[meta.id]} />
          ))}
        </div>

        {report.blocks.map((block) => (
          <section key={block.heading} className="report-block rounded-[28px] bg-white/90 px-6 py-5 ring-1 ring-foreground/10">
            {block.heading ? <h2 className="text-lg font-semibold">{block.heading}</h2> : null}
            {block.paragraphs.map((paragraph, index) => (
              <p key={`${block.heading ?? "p"}-${index}`} className="mt-3 text-[15px] leading-8 text-foreground/90">
                {paragraph}
              </p>
            ))}
            {block.bullets ? (
              <ul className="mt-3 grid gap-2 pl-5 text-[15px] leading-7">
                {block.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </article>
    </div>
  );
}
