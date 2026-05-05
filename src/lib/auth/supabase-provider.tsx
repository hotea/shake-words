"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase/client";
import { AuthContext } from "./context";
import type { AuthUser, AuthContextValue } from "./types";

/** Translate common Supabase auth error messages to Chinese */
function translateError(msg: string | null | undefined): string | null {
  if (!msg) return null;
  const map: Record<string, string> = {
    "Invalid login credentials": "邮箱或密码不正确",
    "Email not confirmed": "邮箱未验证，请查收验证邮件",
    "User already registered": "该邮箱已注册，请直接登录",
    "Password should be at least 6 characters": "密码至少需要 6 位字符",
    "Email address is invalid": "邮箱地址格式不正确，请检查输入",
    "Unable to validate email address: invalid format": "邮箱地址格式不正确，请检查输入",
    "Signup requires a valid email": "请输入有效的邮箱地址",
    "Email rate limit exceeded": "发送邮件过于频繁，请稍后再试",
    "For security purposes, you can only request this after": "操作过于频繁，请稍后再试",
    "New password should be different from the old password": "新密码不能与旧密码相同",
  };
  if (map[msg]) return map[msg];
  for (const [en, zh] of Object.entries(map)) {
    if (msg.includes(en)) return zh;
  }
  return msg;
}

function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? undefined,
    name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? undefined,
    avatarUrl: user.user_metadata?.avatar_url ?? undefined,
  };
}

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setUser(toAuthUser(s?.user ?? null));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setUser(toAuthUser(s?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGitHub = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }, [supabase]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { error: "Supabase 未配置" };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: translateError(error?.message) };
    },
    [supabase],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { error: "Supabase 未配置" };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) return { error: translateError(error.message) };
      if (data.user && !data.session) {
        return { error: null, needsConfirmation: true as const };
      }
      return { error: null };
    },
    [supabase],
  );

  const resendConfirmation = useCallback(
    async (email: string) => {
      if (!supabase) return { error: "Supabase 未配置" };
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      return { error: translateError(error?.message) };
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, [supabase]);

  const value: AuthContextValue = {
    user,
    loading,
    authEnabled: supabase !== null,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    resendConfirmation,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
