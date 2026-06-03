import { describe, it, expect } from "vitest";
import {
  safeEqual,
  getClientIp,
} from "./_security.js";

describe("_security", () => {
  it("safeEqual retourne true", () => {
    expect(safeEqual("admin", "admin")).toBe(true);
  });

  it("safeEqual retourne false", () => {
    expect(safeEqual("admin", "user")).toBe(false);
  });

  it("getClientIp lit x-forwarded-for", () => {
    const req = {
      headers: {
        "x-forwarded-for": "127.0.0.1",
      },
    };

    expect(getClientIp(req)).toBe("127.0.0.1");
  });

  it("getClientIp utilise remoteAddress", () => {
    const req = {
      headers: {},
      socket: {
        remoteAddress: "192.168.1.10",
      },
    };

    expect(getClientIp(req)).toBe("192.168.1.10");
  });
});