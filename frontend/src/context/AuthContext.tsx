"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthUser = any;
export type AuthContextType = {
  user: AuthUser | null | undefined;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  const refreshUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/profile`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("unauthorized");
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("login failed");
    await refreshUser();
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/logout/`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
