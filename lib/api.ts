"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";
const SESSION_FLAG = "huyen:hasSession";

// Access token stored in memory only — never written to localStorage.
// The refresh token lives in an httpOnly cookie (invisible to JavaScript).
// A non-sensitive flag in localStorage tells us whether a refresh attempt
// is worth making, to avoid 401 spam when the user has never logged in.
let _accessToken: string | null = null;

function markSession(active: boolean): void {
  if (typeof window === "undefined") return;
  if (active) {
    window.localStorage.setItem(SESSION_FLAG, "1");
  } else {
    window.localStorage.removeItem(SESSION_FLAG);
  }
}

function hasSessionHint(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SESSION_FLAG) === "1";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  meta?: { total: number; page: number; limit: number; totalPages: number };
  error?: string;
}

export function setAccessToken(token: string | null): void {
  _accessToken = token;
  markSession(token !== null);
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export async function refreshAccessToken(
  options: { force?: boolean } = {},
): Promise<string | null> {
  // Skip when we have no hint that a refresh cookie exists — avoids
  // a guaranteed 401 on every visit by anonymous users.
  if (!options.force && !hasSessionHint()) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include", // sends the httpOnly refreshToken cookie
    });

    if (!res.ok) {
      markSession(false);
      return null;
    }

    const json: ApiResponse<{ accessToken: string }> = await res.json();
    if (json.success && json.data?.accessToken) {
      setAccessToken(json.data.accessToken);
      return json.data.accessToken;
    }
    markSession(false);
    return null;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = _accessToken;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      const retry = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: "include",
      });
      if (retry.ok) {
        return retry.json() as Promise<ApiResponse<T>>;
      }
    }

    setAccessToken(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:session-expired"));
    }
    return { success: false, data: null, error: "Session expired" };
  }

  const json: ApiResponse<T> = await res.json();
  if (!res.ok) {
    return {
      success: false,
      data: null,
      error: json.error || `Request failed with status ${res.status}`,
    };
  }
  return json;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string>,
): Promise<ApiResponse<T>> {
  const url = params
    ? `${path}?${new URLSearchParams(params).toString()}`
    : path;
  return apiFetch<T>(url, { method: "GET" });
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method: "POST",
    body: body != null ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method: "PATCH",
    body: body != null ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, { method: "DELETE" });
}
