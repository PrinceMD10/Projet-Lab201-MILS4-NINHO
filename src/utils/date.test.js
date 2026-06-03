import { describe, expect, it } from "vitest";
import {
  formatDate,
  durationToSeconds,
  formatTime,
} from "./date";

describe("date utils", () => {
  it("durationToSeconds convertit correctement", () => {
    expect(durationToSeconds("3:45")).toBe(225);
    expect(durationToSeconds("0:30")).toBe(30);
  });

  it("formatTime convertit correctement", () => {
    expect(formatTime(225)).toBe("3:45");
    expect(formatTime(30)).toBe("0:30");
    expect(formatTime(0)).toBe("0:00");
  });

  it("formatDate retourne une date française", () => {
    const result = formatDate("2026-06-03");

    expect(result).toContain("2026");
    expect(result.length).toBeGreaterThan(5);
  });
});