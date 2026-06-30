import { getStoredToken, storeToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

let authToken: string | null = getStoredToken();

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    storeToken(token);
  }
}

export function getAuthToken() {
  return authToken;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    let message: string;
    try {
      message = JSON.parse(text).error ?? text;
    } catch {
      message = text;
    }
    throw new Error(message);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
