import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { AdminUser, AuthContext as AuthContextType } from "../types";
import {
  getAuthSession,
  setAuthSession,
  clearAuthSession,
} from "../lib/authSession";
import { mockAdminSignIn, mockAdminSignUp } from "../services/mockAuthApi";
import type { AdminRole } from "../types";

export interface AuthContextValue extends AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (
    email: string,
    fullName: string,
    password: string,
    phoneNumber?: string,
  ) => Promise<void>;
  setRoleForSession: (role: AdminRole) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toAdminRole(role: string): AdminRole {
  if (
    role === "SUPER_ADMIN" ||
    role === "ELECTION_ADMIN" ||
    role === "REGISTRATION_OFFICER" ||
    role === "MONITORING_OFFICER" ||
    role === "RESULTS_OFFICER"
  ) {
    return role;
  }

  return "SUPER_ADMIN";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  // Initialize from stored session
  useEffect(() => {
    const session = getAuthSession();
    if (session) {
      // In a real app, verify token with backend here
      setUser({
        id: "session-user",
        email: session.email,
        fullName: session.fullName || "Admin User",
        role: session.role || "SUPER_ADMIN",
        isActive: true,
        createdAt: new Date(session.createdAt).toISOString(),
        lastLogin: new Date(session.createdAt).toISOString(),
      });
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await mockAdminSignIn({ email, password });

      const authenticatedUser: AdminUser = {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        role: toAdminRole(result.user.role),
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      setAuthSession({
        email: result.user.email,
        fullName: result.user.fullName,
        accessToken: result.accessToken,
        createdAt: Date.now(),
        role: authenticatedUser.role,
      });

      setUser(authenticatedUser);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Login failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (
      email: string,
      fullName: string,
      password: string,
      phoneNumber?: string,
    ) => {
      setIsLoading(true);
      setError(undefined);
      try {
        const result = await mockAdminSignUp({
          email,
          fullName,
          password,
          phoneNumber,
        });

        const registeredUser: AdminUser = {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.fullName,
          role: toAdminRole(result.user.role),
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        setAuthSession({
          email: result.user.email,
          fullName: result.user.fullName,
          accessToken: result.accessToken,
          createdAt: Date.now(),
          role: registeredUser.role,
        });

        setUser(registeredUser);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Signup failed";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuthSession();
    setUser(null);
  }, []);

  const setRoleForSession = useCallback((role: AdminRole) => {
    setUser((current) => {
      if (!current) {
        return current;
      }

      const activeSession = getAuthSession();
      if (activeSession) {
        setAuthSession({
          ...activeSession,
          role,
        });
      }

      return {
        ...current,
        role,
      };
    });
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    signup,
    setRoleForSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
