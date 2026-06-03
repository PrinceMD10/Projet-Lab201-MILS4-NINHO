import { requireMethod, setSecurityHeaders, verifyAdminToken } from "./_security.js";

export default function handler(req, res) {
  setSecurityHeaders(res);
  if (!requireMethod(req, res, "GET")) return;

  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) throw new Error("Token manquant");

    verifyAdminToken(token);
    return res.status(200).json({ valid: true });
  } catch {
    return res.status(401).json({ valid: false });
  }
}
