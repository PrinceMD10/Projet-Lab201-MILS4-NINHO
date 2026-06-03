import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map();

export function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cache-Control", "no-store");
}

export function requireMethod(req, res, method) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", method);
    res.status(204).end();
    return false;
  }

  if (req.method !== method) {
    res.setHeader("Allow", method);
    res.status(405).json({
      success: false,
      error: "Méthode non autorisée.",
    });
    return false;
  }

  return true;
}

export function getRequiredEnv(name) {
  const fallback = {
    ADMIN_USERNAME: "adminninho12",
    ADMIN_PASSWORD: "Fonderiespmd10!",
    JWT_SECRET:
      "une_cle_secrete_tres_longue_et_aleatoire_123456789",
  };

  const value = process.env[name] || fallback[name];

  if (!value) {
    throw new Error(
      `Variable d'environnement manquante : ${name}`
    );
  }

  return value;
}

export function safeEqual(a = "", b = "") {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  return String(
    Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded || req.socket?.remoteAddress || "unknown"
  )
    .split(",")[0]
    .trim();
}

export function rateLimit(req, res) {
  const ip = getClientIp(req);
  const now = Date.now();

  const record = attempts.get(ip) || {
    count: 0,
    resetAt: now + WINDOW_MS,
  };

  if (record.resetAt <= now) {
    record.count = 0;
    record.resetAt = now + WINDOW_MS;
  }

  record.count += 1;
  attempts.set(ip, record);

  if (record.count > MAX_ATTEMPTS) {
    res.status(429).json({
      success: false,
      error: "Trop de tentatives. Réessaie plus tard.",
    });
    return false;
  }

  return true;
}

export function signAdminToken() {
  const secret = getRequiredEnv("JWT_SECRET");

  return jwt.sign(
    { role: "admin" },
    secret,
    {
      algorithm: "HS256",
      expiresIn: "2h",
      issuer: "ninho-mils4-admin",
      audience: "ninho-mils4-dashboard",
    }
  );
}

export function verifyAdminToken(token) {
  const secret = getRequiredEnv("JWT_SECRET");

  return jwt.verify(token, secret, {
    algorithms: ["HS256"],
    issuer: "ninho-mils4-admin",
    audience: "ninho-mils4-dashboard",
  });
}