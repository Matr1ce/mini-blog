"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "@/lib/api";
import { AuthResponse, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  setSession: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const setTokenCookie = (token: string) => {
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
};

const clearTokenCookie = () => {
  document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    clearTokenCookie();
    setUser(null);
  }, []);

  const setSession = useCallback((data: AuthResponse) => {
    localStorage.setItem("token", data.token);
    setTokenCookie(data.token);
    setUser(data.user);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("token");

    const request = token
      ? api.get<User>("/auth/me").then((res) => res.data)
      : Promise.resolve<User | null>(null);

    request
      .then((data) => {
        if (!cancelled) {
          if (data && token) {
            setTokenCookie(token);
          }
          setUser(data);
        }
      })
      .catch(() => {
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [logout]);

  useEffect(() => {
    const handleForceLogout = () => {
      clearTokenCookie();
      setUser(null);
    };
    window.addEventListener("auth-logout", handleForceLogout);
    return () => window.removeEventListener("auth-logout", handleForceLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
