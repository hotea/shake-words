"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth-context";

const COOLDOWN_SECONDS = 60;

export default function LoginPage() {
  const router = useRouter();
  const { user, supabaseEnabled, signInWithGitHub, signInWithGoogle, signInWithEmail, signUpWithEmail, resendConfirmation } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      if (cooldownTimer.current) {
        clearInterval(cooldownTimer.current);
        cooldownTimer.current = null;
      }
      return;
    }
    if (!cooldownTimer.current) {
      cooldownTimer.current = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            if (cooldownTimer.current) clearInterval(cooldownTimer.current);
            cooldownTimer.current = null;
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (cooldownTimer.current) {
        clearInterval(cooldownTimer.current);
        cooldownTimer.current = null;
      }
    };
  }, [cooldown]);

  const startCooldown = useCallback(() => {
    setCooldown(COOLDOWN_SECONDS);
  }, []);

  if (user) {
    router.replace("/");
    return null;
  }

  if (!supabaseEnabled) {
    return (
      <main className="min-h-screen bg-[#faf9f7] flex flex-col">
        {/* Top bar */}
        <header className="h-14 flex items-center px-4">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div className="w-full max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">ShakeWords</h1>
            <p className="text-sm text-slate-400 text-center mb-8">摇头晃脑，轻松背词</p>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="space-y-3 mb-6">
                {[
                  "使用全部功能学习词汇",
                  "本地追踪每日学习进度",
                  "使用 Face Mesh 手势控制",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-slate-500">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {text}
                  </div>
                ))}
              </div>
              <Link
                href="/"
                className="cursor-pointer w-full inline-flex justify-center items-center h-10 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                开始学习
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setShowResend(false);

    if (cooldown > 0) {
      setError(`操作过于频繁，请等待 ${cooldown} 秒后再试`);
      return;
    }

    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoading(false);
      setError("请输入有效的邮箱地址");
      return;
    }
    if (password.length < 6) {
      setLoading(false);
      setError("密码至少需要 6 位字符");
      return;
    }

    if (mode === "login") {
      const result = await signInWithEmail(email, password);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        if (result.error.includes("频繁") || result.error.includes("rate")) {
          startCooldown();
        }
      } else {
        router.replace("/");
      }
    } else {
      const result = await signUpWithEmail(email, password);
      setLoading(false);
      startCooldown();
      if (result.error) {
        setError(result.error);
        if (result.error.includes("已注册")) {
          setShowResend(true);
        }
        if (result.error.includes("频繁") || result.error.includes("rate")) {
          startCooldown();
        }
      } else if (result.needsConfirmation) {
        setError("注册成功！请查收验证邮件，点击链接后即可登录。");
        setShowResend(true);
        setMode("login");
      } else {
        setError("账号已创建！请查收验证邮件，然后登录。");
        setMode("login");
      }
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setLoading(true);
    const result = await resendConfirmation(email);
    setLoading(false);
    startCooldown();
    if (result.error) {
      setError(result.error);
    } else {
      setError("验证邮件已重新发送，请查收。");
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Top bar */}
      <header className="h-14 flex items-center px-4">
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
      </header>

      {/* Form area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              {mode === "login" ? "欢迎回来" : "创建账号"}
            </h1>
            <p className="text-sm text-slate-400 mt-1.5">
              {mode === "login" ? "登录以同步学习进度" : "注册保存你的学习数据"}
            </p>
          </div>

          {/* OAuth — side by side */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={signInWithGitHub}
              className="cursor-pointer flex items-center justify-center gap-2 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
            <button
              onClick={signInWithGoogle}
              className="cursor-pointer flex items-center justify-center gap-2 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-300 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-600">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 h-10 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-600">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3.5 h-10 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-all"
                placeholder="至少 6 位字符"
              />
            </div>

            {error && (
              <div className={`flex items-start gap-2 p-3 rounded-lg text-sm leading-relaxed ${
                error.includes("成功") || error.includes("已重新") || error.includes("验证邮件")
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}>
                {error.includes("成功") || error.includes("已重新") || error.includes("验证邮件") ? (
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                )}
                <div className="flex-1">
                  <p>{error}</p>
                  {showResend && (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={loading || cooldown > 0}
                      className="mt-1 text-xs font-medium underline underline-offset-2 decoration-current/30 hover:decoration-current disabled:opacity-50 cursor-pointer"
                    >
                      {cooldown > 0
                        ? `重新发送（${cooldown}s）`
                        : "重新发送验证邮件"}
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="cursor-pointer w-full h-10 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : cooldown > 0 ? (
                `请等待 ${cooldown}s`
              ) : (
                mode === "login" ? "登录" : "创建账号"
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-5 text-center text-sm text-slate-400">
            {mode === "login" ? (
              <>
                还没有账号？{" "}
                <button
                  onClick={() => { setMode("signup"); setError(null); }}
                  className="text-[var(--color-primary)] font-medium cursor-pointer hover:underline"
                >
                  注册
                </button>
              </>
            ) : (
              <>
                已有账号？{" "}
                <button
                  onClick={() => { setMode("login"); setError(null); }}
                  className="text-[var(--color-primary)] font-medium cursor-pointer hover:underline"
                >
                  登录
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
