import { describe, it, expect, beforeEach } from "vitest";
import {
  safeEqual,
  getClientIp,
  getRequiredEnv,
  requireMethod,
  rateLimit,
  signAdminToken,
  verifyAdminToken,
  setSecurityHeaders,
} from "./_security.js";

describe("_security", () => {
  beforeEach(() => {
    process.env.JWT_SECRET =
      "une_cle_secrete_tres_longue_et_aleatoire_123456789";
  });

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

  it("getRequiredEnv retourne une valeur", () => {
    expect(getRequiredEnv("ADMIN_USERNAME")).toBe(
      "adminninho12"
    );
  });

  it("setSecurityHeaders ajoute les headers", () => {
    const headers = {};

    const res = {
      setHeader: (key, value) => {
        headers[key] = value;
      },
    };

    setSecurityHeaders(res);

    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Cache-Control"]).toBe("no-store");
  });

  it("requireMethod accepte la bonne méthode", () => {
    const req = { method: "POST" };

    const res = {
      setHeader() {},
      status() {
        return this;
      },
      json() {},
      end() {},
    };

    expect(requireMethod(req, res, "POST")).toBe(true);
  });

  it("requireMethod refuse une mauvaise méthode", () => {
    let statusCode;

    const req = { method: "GET" };

    const res = {
      setHeader() {},
      status(code) {
        statusCode = code;
        return this;
      },
      json() {},
    };

    expect(requireMethod(req, res, "POST")).toBe(false);
    expect(statusCode).toBe(405);
  });

  it("requireMethod gère OPTIONS", () => {
    let statusCode;

    const req = { method: "OPTIONS" };

    const res = {
      setHeader() {},
      status(code) {
        statusCode = code;
        return this;
      },
      end() {},
    };

    expect(requireMethod(req, res, "POST")).toBe(false);
    expect(statusCode).toBe(204);
  });

  it("rateLimit autorise les premières requêtes", () => {
    const req = {
      headers: {
        "x-forwarded-for": "10.0.0.1",
      },
    };

    const res = {
      status() {
        return this;
      },
      json() {},
    };

    expect(rateLimit(req, res)).toBe(true);
  });

  it("signAdminToken génère un JWT", () => {
    const token = signAdminToken();

    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);
  });

  it("verifyAdminToken valide un JWT", () => {
    const token = signAdminToken();

    const payload = verifyAdminToken(token);

    expect(payload.role).toBe("admin");
  });
});