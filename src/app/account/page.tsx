"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, signOut, updateName, sendVerifyLink } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name ?? "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaving, setNameSaving] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    const verified = searchParams.get("verified");
    const msg = searchParams.get("msg");
    if (verified === "1" && msg) {
      setMessage(decodeURIComponent(msg));
      setMessageType("success");
    } else if (verified === "0" && msg) {
      setMessage(decodeURIComponent(msg));
      setMessageType("error");
    }
  }, [searchParams]);

  useEffect(() => {
    if (user?.emailVerified && message && messageType === "success") {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [user?.emailVerified, message, messageType]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  async function handleSaveName() {
    if (!updateName) return;
    if (!nameValue.trim()) {
      setNameError("名称不能为空");
      return;
    }
    setNameSaving(true);
    setNameError(null);
    const result = await updateName(nameValue.trim());
    setNameSaving(false);
    if (result.error) {
      setNameError(result.error);
    } else {
      setEditingName(false);
      setMessage("名称已更新");
      setMessageType("success");
      setTimeout(() => setMessage(null), 3000);
    }
  }

  async function handleSendVerifyLink() {
    if (!sendVerifyLink) return;
    setSendingLink(true);
    setMessage(null);
    const result = await sendVerifyLink();
    setSendingLink(false);
    if (result.error) {
      setMessage(result.error);
      setMessageType("error");
    } else {
      setLinkSent(true);
      setMessage("验证链接已发送到您的邮箱，请在邮箱中点击链接完成验证");
      setMessageType("success");
    }
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <header className="h-14 flex items-center px-4">
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--color-gold-dim)] text-[var(--color-muted)] hover:text-[var(--color-gold)] transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="ml-2 text-lg font-semibold text-[var(--color-rice)]" style={{ fontFamily: "var(--font-display)" }}>账户管理</h1>
      </header>

      <div className="flex-1 flex flex-col items-center px-6 pb-20">
        <div className="w-full max-w-sm mt-8">
          <div className="w-16 h-16 rounded-full bg-[var(--gradient-primary)] flex items-center justify-center text-[var(--color-rice)] text-2xl font-bold shadow-[var(--shadow-glow)] mx-auto mb-6" style={{ fontFamily: "var(--font-display)" }}>
            {(user.email?.[0] ?? user.name?.[0] ?? "U").toUpperCase()}
          </div>

          <div className="card p-5">
            <div className="py-3 border-b border-[var(--color-border)]/50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[var(--color-muted)] mb-1">名称</div>
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nameValue}
                        onChange={(e) => { setNameValue(e.target.value); setNameError(null); }}
                        maxLength={50}
                        autoFocus
                        onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={nameSaving}
                        className="cursor-pointer px-2.5 h-10 rounded-lg bg-[var(--color-primary)] text-[var(--color-rice)] text-xs font-medium hover:bg-[var(--color-cinnabar-deep)] transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {nameSaving ? "..." : "保存"}
                      </button>
                      <button
                        onClick={() => { setEditingName(false); setNameValue(user.name ?? ""); setNameError(null); }}
                        className="cursor-pointer px-2.5 h-10 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] text-xs hover:bg-[var(--color-ink-700)] hover:text-[var(--color-rice)] transition-colors whitespace-nowrap"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--color-rice)] truncate">{user.name || "未设置"}</span>
                      <button
                        onClick={() => { setEditingName(true); setNameValue(user.name ?? ""); }}
                        className="cursor-pointer text-xs text-[var(--color-cinnabar)] hover:underline shrink-0"
                      >
                        修改
                      </button>
                    </div>
                  )}
                  {nameError && <div className="text-xs text-[var(--color-cinnabar)] mt-1">{nameError}</div>}
                </div>
              </div>
            </div>

            <div className="py-3">
              <div className="text-xs text-[var(--color-muted)] mb-1">邮箱</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-rice)]">{user.email}</span>
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-jade-dim)] text-[var(--color-jade)] text-[11px] font-medium">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    已验证
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-gold-dim)] text-[var(--color-gold)] text-[11px] font-medium">
                    未验证
                  </span>
                )}
              </div>
              {!user.emailVerified && (
                <div className="mt-3">
                  {linkSent ? (
                    <p className="text-xs text-[var(--color-muted)]">验证链接已发送，请检查您的收件箱并点击链接完成验证。</p>
                  ) : (
                    <button
                      onClick={handleSendVerifyLink}
                      disabled={sendingLink}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-rice)] text-xs font-medium hover:bg-[var(--color-cinnabar-deep)] transition-colors disabled:opacity-50 shadow-[var(--shadow-glow)]"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      {sendingLink ? "发送中..." : "发送验证链接"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${messageType === "success" ? "bg-[var(--color-jade-dim)] text-[var(--color-jade)]" : "bg-[var(--color-cinnabar-dim)] text-[var(--color-cinnabar)]"}`}>
              {message}
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleSignOut}
              className="cursor-pointer w-full h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-cinnabar)] text-sm font-medium hover:bg-[var(--color-ink-700)] transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <AccountContent />
    </Suspense>
  );
}
