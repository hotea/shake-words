"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import { AuthContext } from "./context";
import type { AuthUser, AuthContextValue } from "./types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
function api(path: string): string {
  return `${basePath}${path}`;
}

export function MySqlAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(api("/api/auth/me"))
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signInWithGitHub = useCallback(async () => {
    console.warn("GitHub OAuth is not available in self-hosted mode");
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(api("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) return { error: data.error };
      setUser(data.user);
      return { error: null };
    } catch {
      return { error: "网络错误，请稍后重试" };
    }
  }, []);

  const signInWithEmailCode = useCallback(async (email: string, emailCode: string) => {
    try {
      const res = await fetch(api("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, emailCode }),
      });
      const data = await res.json();
      if (data.error) return { error: data.error };
      setUser(data.user);
      return { error: null };
    } catch {
      return { error: "网络错误，请稍后重试" };
    }
  }, []);

  const sendEmailCode = useCallback(async (email: string) => {
    try {
      const res = await fetch(api("/api/auth/email"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.error) return { error: data.error };
      return { error: null };
    } catch {
      return { error: "网络错误，请稍后重试" };
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(api("/api/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) return { error: data.error };
      return { error: null, needsConfirmation: true };
    } catch {
      return { error: "网络错误，请稍后重试" };
    }
  }, []);

  const resendConfirmation = useCallback(async (_email: string) => {
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch(api("/api/auth/logout"), { method: "POST" });
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  const updateName = useCallback(async (name: string) => {
    try {
      const res = await fetch(api("/api/auth/me"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.error) return { error: data.error };
      setUser(data.user);
      return { error: null };
    } catch {
      return { error: "网络错误，请稍后重试" };
    }
  }, []);

  const sendVerifyLink = useCallback(async () => {
    try {
      const res = await fetch(api("/api/auth/verify-link"), {
        method: "POST",
      });
      const data = await res.json();
      if (data.error) return { error: data.error };
      return { error: null };
    } catch {
      return { error: "网络错误，请稍后重试" };
    }
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    authEnabled: true,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    resendConfirmation,
    signOut,
    signInWithEmailCode,
    sendEmailCode,
    updateName,
    sendVerifyLink,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
