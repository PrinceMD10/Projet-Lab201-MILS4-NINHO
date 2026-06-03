import {
  getRequiredEnv,
  rateLimit,
  requireMethod,
  safeEqual,
  setSecurityHeaders,
  signAdminToken,
} from "./_security.js";

export default async function handler(req, res) {
  setSecurityHeaders(res);

  if (!requireMethod(req, res, "POST")) return;
  if (!rateLimit(req, res)) return;

  try {
    console.log("=== ENV DEBUG ===");
    console.log("ADMIN_USERNAME =", process.env.ADMIN_USERNAME);
    console.log("ADMIN_PASSWORD =", process.env.ADMIN_PASSWORD);
    console.log("JWT_SECRET =", process.env.JWT_SECRET);
    console.log("=================");

    const { username = "", password = "" } = req.body || {};

    if (String(username).length > 128 || String(password).length > 512) {
      return res.status(400).json({
        success: false,
        error: "Requête invalide.",
      });
    }

    const validUsername = safeEqual(
      username,
      getRequiredEnv("ADMIN_USERNAME")
    );

    const validPassword = safeEqual(
      password,
      getRequiredEnv("ADMIN_PASSWORD")
    );

    if (!validUsername || !validPassword) {
      return res.status(401).json({
        success: false,
        error: "Identifiants invalides.",
      });
    }

    return res.status(200).json({
      success: true,
      token: signAdminToken(),
    });
  } catch (error) {
    console.error("=== ADMIN LOGIN ERROR ===");
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}