import { PersonaAvatar } from "@/components/Avatar";
import { BipolarBar } from "@/components/BipolarBar";
import { Button } from "@/components/ui/button";
import { DIMENSIONS } from "@/data/dimensions";
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
        <header className="rounded-[28px] bg-white/90 p-6 shadow-sm ring-1 ring-foreground/10">
          <p className="text-sm text-muted-foreground">64 型人格测试 · 结果直出 · 无二次收费</p>
          <p className="font-display mt-2 text-5xl tracking-wide">{result.code}</p>
          <h1 className="mt-2 text-2xl font-semibold">{report.subtitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {report.title} · 约 {report.han} 字
            {demo ? " · 示例数据" : ""}
          </p>
          <label className="no-print mt-4 grid gap-1 text-sm">
            <span className="text-muted-foreground">可选：报告里怎么称呼你</span>
            <input
              value={nickname}
              maxLength={16}
              onChange={(event) => onNickname(event.target.value)}
              placeholder="留空则写作「你」"
              className="h-11 rounded-full border bg-white px-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </label>
        </header>

        <div className="flex items-center gap-4 rounded-[28px] bg-white/90 p-4 ring-1 ring-foreground/10">
          <PersonaAvatar code={result.code} className="w-28 shrink-0" label={report.subtitle} />
          <div className="grid flex-1 gap-3">
            {DIMENSIONS.map((meta) => (
              <BipolarBar key={meta.id} score={result.scores[meta.id]} />
            ))}
          </div>
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
