import { createContext, useContext } from "react";

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  isAuthenticated: false,
});

export function useAuthState() {
  return useContext(AuthContext);
}

const TOKEN_KEY = "nitai_token";

export function decodeToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]!));
    return { sub: payload.sub, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
