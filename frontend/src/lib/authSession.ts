import type { AdminRole } from '../types';

const AUTH_SESSION_KEY = 'ondo-vote-admin-session';

export type AuthSession = {
  email: string;
  fullName?: string;
  accessToken?: string;
  createdAt: number;
  role?: AdminRole;
};

export function getAuthSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}

export function hasAuthSession() {
  return getAuthSession() !== null;
}