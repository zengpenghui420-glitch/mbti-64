import { QUESTIONS } from "@/data/questions";
import { getProfile, TYPE_CODES } from "@/data/profiles";
import { synthesizeAnswers } from "@/lib/demo";
import { buildReport } from "@/lib/report";
import { countHan, scoreAnswers, type TypeCode } from "@/lib/score";
import { describe, expect, it } from "vitest";

const SUFFIXES = ["AC", "AH", "TC", "TH"] as const;

describe("quiz bank", () => {
  it("has 108 unique items and a balanced key for each dimension", () => {
    expect(QUESTIONS).toHaveLength(108);
    expect(new Set(QUESTIONS.map((item) => item.text)).size).toBe(108);
    const dims = ["EI", "NS", "TF", "JP", "AT", "CH"] as const;
    for (const dim of dims) {
      const rows = QUESTIONS.filter((item) => item.dim === dim);
      expect(rows).toHaveLength(18);
      expect(rows.filter((item) => item.pole === 1)).toHaveLength(9);
      expect(rows.filter((item) => item.pole === -1)).toHaveLength(9);
    }
  });
});

describe("scoring", () => {
  it("ties an all-agree pattern into the lower poles", () => {
    const result = scoreAnswers(Array.from({ length: 108 }, () => 5));
    expect(result?.code).toBe("ISFP-TH");
  });

  it("can reach every 64 subtype from synthesized answers", () => {
    const codes = TYPE_CODES.flatMap((type) => SUFFIXES.map((suffix) => `${type}-${suffix}`));
    expect(codes).toHaveLength(64);
    for (const code of codes) {
      const result = scoreAnswers(synthesizeAnswers(code));
      expect(result?.code).toBe(code);
      const leans = Object.values(result!.scores).map((score) => score.lean);
      expect(Math.max(...leans)).toBeLessThan(100);
      expect(Math.min(...leans)).toBeGreaterThan(55);
    }
  });
});

describe("reports", () => {
  it("writes at least 1000 Chinese characters for every subtype", () => {
    const short: string[] = [];
    for (const type of TYPE_CODES) {
      for (const suffix of SUFFIXES) {
        const code = `${type}-${suffix}`;
        const result = scoreAnswers(synthesizeAnswers(code));
        expect(result?.type).toBe(type as TypeCode);
        const report = buildReport(result!, "林夏");
        if (report.han < 1000) short.push(`${code}:${report.han}`);
      }
    }
    expect(short).toEqual([]);
  });

  it("counts han characters without latin noise", () => {
    expect(countHan("INTJ 坚定协同")).toBe(4);
  });

  it("prints the Chinese type name and nicknames on every report", () => {
    for (const type of TYPE_CODES) {
      const profile = getProfile(type);
      expect(profile.cnName.length).toBeGreaterThan(1);
      expect(profile.nicknames.length).toBeGreaterThan(0);
      const result = scoreAnswers(synthesizeAnswers(`${type}-AC`));
      const report = buildReport(result!, "林夏");
      expect(report.subtitle).toContain(profile.cnName);
      expect(report.text).toContain(profile.cnName);
      for (const nick of profile.nicknames) {
        expect(report.text).toContain(nick);
      }
    }
  });
});
