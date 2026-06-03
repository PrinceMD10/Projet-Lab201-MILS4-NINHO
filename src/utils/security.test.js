import {
  cleanText,
  cleanNumber,
  safeDate,
  safeEmail,
  safeExternalUrl,
  safeImagePath,
} from "./security";

describe("security utils", () => {
  test("cleanText supprime les espaces", () => {
    expect(cleanText("  hello  ")).toBe("hello");
  });

  test("cleanNumber respecte min/max", () => {
    expect(cleanNumber(150, { min: 0, max: 100 })).toBe(100);
    expect(cleanNumber(-10, { min: 0, max: 100 })).toBe(0);
  });

  test("safeDate accepte une date valide", () => {
    expect(safeDate("2026-06-03")).toBe("2026-06-03");
  });

  test("safeDate refuse une date invalide", () => {
    expect(safeDate("03/06/2026")).toBe("");
  });

  test("safeEmail valide un email", () => {
    expect(safeEmail("test@gmail.com"))
      .toBe("test@gmail.com");
  });

  test("safeEmail refuse un email invalide", () => {
    expect(safeEmail("test"))
      .toBe("");
  });

  test("safeExternalUrl accepte https", () => {
    expect(
      safeExternalUrl("https://google.com")
    ).toBe("https://google.com");
  });

  test("safeExternalUrl refuse http", () => {
    expect(
      safeExternalUrl("http://google.com")
    ).toBe("#");
  });

  test("safeImagePath accepte un chemin valide", () => {
    expect(
      safeImagePath("/images/test.png")
    ).toBe("/images/test.png");
  });
});