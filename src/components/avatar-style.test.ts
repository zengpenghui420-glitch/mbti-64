import src from "./Avatar.tsx?raw";
import { describe, expect, it } from "vitest";

describe("polygonal portraits", () => {
  it("builds every portrait from straight edges", () => {
    expect(src).not.toMatch(/<circle[\s/>]/);
    expect(src).not.toMatch(/<ellipse[\s/>]/);
    expect(src).not.toMatch(/\brx\s*=/);
    expect(src).not.toMatch(/\bry\s*=/);
    expect(src).not.toMatch(/strokeLinecap="round"/);
    expect(src).not.toMatch(/strokeLinejoin="round"/);

    const paths = [...src.matchAll(/\bd="([^"]*)"/g)].map((match) => match[1]);
    expect(paths.length).toBeGreaterThan(0);
    for (const d of paths) {
      const commands = d.match(/[A-Za-z]/g) ?? [];
      expect(commands.every((command: string) => "MLHVZmlhvz".includes(command))).toBe(true);
    }
  });
});
