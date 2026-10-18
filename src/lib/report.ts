import { DIMENSIONS } from "@/data/dimensions";
import { getProfile } from "@/data/profiles";
import { DISCLAIMER, IDENTITY, READING_GUIDE, STANCE } from "@/data/suffixes";
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
        `${who}的主类型是 ${result.type}「${profile.cnName}」，大家也常叫这个类型${profile.nicknames.map((item) => `「${item}」`).join("")}。头像用的是十六型里的「${profile.cnName}」，坚定/敏感和协同/主见不再另画一张脸。在十六种主类型之上，这次还有两层后缀：${identity.name}（${result.identity}）与${stance.name}（${result.stance}），合在一起写成 ${result.code}，也就是「${subtypeLabel(result)}」。这份画像标题是「${profile.name}」。${profile.epithet}`,
        `六个维度的结算是：${scoreLine}。这些百分比来自刚刚答完的 108 题。每题都按更接近平时的反应计分，没有隐藏题，也没有答完再付费才能看见的部分。结果在最后一题结束后立即生成。`,
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
      heading: "六个维度分别说了什么",
      paragraphs: DIMENSIONS.map((meta) => {
        const score = result.scores[meta.id];
        return `「${meta.title}」${score.text}`;
      }),
    },
    {
      heading: `后缀一 · ${identity.name}（${identity.letter}）`,
      paragraphs: [
        `${identity.short}。这一层不改写你的四个字母，它描述压力和评价到来时，你的自我感更稳，还是更容易被牵动。`,
        ...identity.body,
      ],
    },
    {
      heading: `后缀二 · ${stance.name}（${stance.letter}）`,
      paragraphs: [
        `${stance.short}。这一层看的是你在人群里的默认站位：先找配合，还是先把方向立住。它和外向、内向不是同一件事。`,
        ...stance.body,
      ],
    },
    {
      heading: "两层后缀叠在一起",
      paragraphs: [
        profile.combo[result.suffix],
        `所以 ${result.code} 不是一个更高级的 ${result.type}，而是「${profile.cnName}」在「${identity.name}」和「${stance.name}」同时出现时的一种生活版本。若你觉得某一层很像、另一层只是勉强，以鲜明度更高的那一层为准，靠近 50% 的字母可以轻轻拿着。`,
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
      paragraphs: ["不必一次做完。选一条放到下一周，比把报告收藏起来更接近“结果直出”的用法。"],
      bullets: profile.practices,
    },
    {
      heading: "怎么阅读这份结果",
      paragraphs: READING_GUIDE,
    },
    {
      heading: "关于收费与用途",
      paragraphs: DISCLAIMER,
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
      <p class="sub">64 型人格测试 · 结果直出 · 无二次收费</p>
      <p class="code">${escapeHtml(result.code)}</p>
      <h1>${escapeHtml(getProfile(result.type).cnName)}</h1>
      <p class="sub">${escapeHtml(getProfile(result.type).nicknames.join(" · "))}</p>
      <p class="sub">${escapeHtml(report.subtitle)}</p>
      <p class="sub">${escapeHtml(report.title)} · 约 ${report.han} 字</p>
    </header>
    ${body}
    <footer>娱乐向自我观察笔记。可在浏览器中选择打印，并存储为 PDF。本文件即完整报告，无需再解锁。</footer>
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
