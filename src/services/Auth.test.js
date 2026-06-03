import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  saveToken,
  getToken,
  logout,
  login,
  verifyToken,
} from "./Auth";

describe("Auth service", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("saveToken stocke un token", () => {
    saveToken("abc123");
    expect(getToken()).toBe("abc123");
  });

  it("logout supprime le token", () => {
    saveToken("abc123");
    logout();
    expect(getToken()).toBeNull();
  });

  it("login retourne les données reçues", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            token: "jwt-token",
          }),
      }),
    );

    const result = await login("admin", "password");

    expect(result.token).toBe("jwt-token");
  });

  it("verifyToken retourne true si valide", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            valid: true,
          }),
      }),
    );

    const result = await verifyToken("abc");

    expect(result).toBe(true);
  });

  it("verifyToken retourne false si erreur réseau", async () => {
    global.fetch = vi.fn(() => Promise.reject());

    const result = await verifyToken("abc");

    expect(result).toBe(false);
  });
});