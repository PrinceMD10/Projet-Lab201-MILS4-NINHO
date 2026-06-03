const TOKEN_KEY = "admin_token";

async function parseJsonResponse(res) {
  let payload = {};
  try {
    payload = await res.json();
  } catch {
    payload = {};
  }

  if (!res.ok) {
    throw new Error(payload?.error || "Authentification impossible.");
  }

  return payload;
}

export async function login(username, password) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  return parseJsonResponse(res);
}

export async function verifyToken(token = getToken()) {
  if (!token) return false;

  try {
    const res = await fetch("/api/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const payload = await res.json();
    return Boolean(res.ok && payload.valid);
  } catch {
    return false;
  }
}

export function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
}
