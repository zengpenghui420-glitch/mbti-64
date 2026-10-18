import { DIMENSIONS } from "@/data/dimensions";
import { getProfile } from "@/data/profiles";
import { IDENTITY, STANCE } from "@/data/suffixes";
import { countHan, type QuizResult } from "@/lib/score";

export interface ReportBlock {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BuiltReport {
  title: string;
  subtitle: string;
  blocks: ReportBlock[];
  text: string;
  han: number;
}

export function subtypeLabel(result: QuizResult): string {
  const profile = getProfile(result.type);
  const identity = IDENTITY[result.identity].name;
  const stance = STANCE[result.stance].name;
  return `${profile.cnName} · ${identity}${stance}`;
}

export function buildReport(result: QuizResult, nickname?: string): BuiltReport {
  const profile = getProfile(result.type);
  const identity = IDENTITY[result.identity];
  const stance = STANCE[result.stance];
  const who = nickname?.trim() ? nickname.trim() : "你";
  const title = `${who}的 64 型观察笔记`;
  const subtitle = `${result.code}　${profile.cnName} · ${profile.nicknames.join(" / ")}`;

  const scoreLine = DIMENSIONS.map((meta) => {
    const score = result.scores[meta.id];
    return `${meta.title}偏向${score.name}（${score.letter}，鲜明度 ${score.lean}%）`;
  }).join("；");

  const blocks: ReportBlock[] = [
    {
      heading: "结果总览",
      paragraphs: [
        `${who}是 ${result.code}「${profile.cnName}」，也常被叫做${profile.nicknames.map((item) => `「${item}」`).join("")}。主类型是 ${result.type}，再加上「${identity.name}」和「${stance.name}」，合在一起是「${subtypeLabel(result)}」。${profile.epithet}`,
        `六个维度现在是：${scoreLine}。`,
        profile.blurb,
      ],
    },
    {
      heading: "主类型画像",
      paragraphs: profile.portrait,
    },
    {
      heading: "生活里会看见的画面",
      paragraphs: [profile.scenes],
    },
    {
      heading: "六个维度",
      paragraphs: DIMENSIONS.map((meta) => {
        const score = result.scores[meta.id];
        return `「${meta.title}」${score.text}`;
      }),
    },
    {
      heading: `后缀一 · ${identity.name}（${identity.letter}）`,
      paragraphs: [
        `${identity.short}。`,
        ...identity.body,
      ],
    },
    {
      heading: `后缀二 · ${stance.name}（${stance.letter}）`,
      paragraphs: [
        `${stance.short}。`,
        ...stance.body,
      ],
    },
    {
      heading: "两层后缀叠在一起",
      paragraphs: [
        profile.combo[result.suffix],
        `所以 ${result.code} 是「${profile.cnName}」同时带着「${identity.name}」和「${stance.name}」的生活版本。`,
      ],
    },
    {
      heading: "用得上的地方",
      paragraphs: [profile.relate],
      bullets: profile.strengths.map((item) => `优势：${item}`),
    },
    {
      heading: "值得留意",
      paragraphs: ["这些不是缺陷清单，而是这个类型组合容易在忙、累、被催的时候滑进去的位置。"],
      bullets: profile.watchouts,
    },
    {
      heading: "可以很小的练习",
      paragraphs: ["选一条放到下一周就够了。"],
      bullets: profile.practices,
    },
  ];

  const text = blocks
    .map((block) => {
      const parts = [block.heading ?? "", ...block.paragraphs, ...(block.bullets ?? [])];
      return parts.join("\n");
    })
    .join("\n");

  return { title, subtitle, blocks, text, han: countHan(text) };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function reportToHtml(result: QuizResult, nickname?: string): string {
  const report = buildReport(result, nickname);
  const body = report.blocks
    .map((block) => {
      const heading = block.heading ? `<h2>${escapeHtml(block.heading)}</h2>` : "";
      const paragraphs = block.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
      const bullets = block.bullets
        ? `<ul>${block.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : "";
      return `<section>${heading}${paragraphs}${bullets}</section>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(report.subtitle)} · 64型人格报告</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; background: #f6f1ea; color: #243044; font-family: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif; line-height: 1.85; }
    main { max-width: 760px; margin: 0 auto; padding: 32px 20px 64px; }
    header { background: white; border-radius: 28px; padding: 28px 24px; box-shadow: 0 10px 40px rgba(70, 80, 140, .08); }
    h1 { font-size: 28px; margin: 0 0 8px; letter-spacing: .04em; }
    .code { font-size: 40px; margin: 12px 0 0; letter-spacing: .08em; }
    .sub { color: #5c6578; margin: 4px 0 0; }
    section { background: white; border-radius: 24px; padding: 8px 24px 20px; margin-top: 16px; }
    h2 { font-size: 18px; margin: 18px 0 8px; }
    p, li { font-size: 16px; }
    ul { padding-left: 1.2em; }
    footer { color: #5c6578; font-size: 13px; margin-top: 18px; }
    @page { margin: 16mm; }
    @media print { body { background: white; } header, section { box-shadow: none; } }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="code">${escapeHtml(result.code)}</p>
      <h1>${escapeHtml(getProfile(result.type).cnName)}</h1>
      <p class="sub">${escapeHtml(getProfile(result.type).nicknames.join(" · "))}</p>
      <p class="sub">${escapeHtml(report.subtitle)}</p>
      <p class="sub">${escapeHtml(report.title)} · 约 ${report.han} 字</p>
    </header>
    ${body}
    <footer>可在浏览器中选择打印，并存储为 PDF。</footer>
  </main>
</body>
</html>`;
}

export function downloadReport(result: QuizResult, nickname?: string): void {
  const html = reportToHtml(result, nickname);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${result.code}-人格报告.html`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
