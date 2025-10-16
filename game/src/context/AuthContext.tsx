"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchUserProfile } from "@/lib/auth";

type UserProfile = { username?: string } | null;

type AuthContextValue = {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(null);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const profile = await fetchUserProfile();
        if (mounted) setUser(profile);
      } catch {
        if (mounted) setUser(null);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
