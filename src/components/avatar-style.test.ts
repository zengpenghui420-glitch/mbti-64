import src from "./Avatar.tsx?raw";
import { describe, expect, it } from "vitest";
import { faceOutline } from "./Avatar";

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

  it("keeps the head outline mirrored", () => {
    const points = faceOutline(140, 100);
    for (const [x, y] of points) {
      const mirrored = points.some(([otherX, otherY]) => Math.abs(otherX - (280 - x)) < 0.01 && Math.abs(otherY - y) < 0.01);
      expect(mirrored).toBe(true);
    }
    expect(points[0]?.[0]).toBe(140);
    expect(points[5]?.[0]).toBe(140);
  });
});
