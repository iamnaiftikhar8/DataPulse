// src/lib/api.ts
export function saveAuthToStorage(userId: string, sessionId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("dp_user_id", userId);
  localStorage.setItem("dp_session_id", sessionId);
}

export function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const uid = localStorage.getItem("dp_user_id") || "";
  const sid = localStorage.getItem("dp_session_id") || "";
  const headers: Record<string, string> = {};
  if (uid) headers["X-User-Id"] = uid;
  if (sid) headers["X-Session-Id"] = sid;
  return headers;
}

export async function apiFetch<T = any>(path: string, init: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "https://data-pulse-api.vercel.app"; // FastAPI
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(init.headers || {}),
    },
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}
