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
      <main className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
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
    <main className="min-h-screen bg-[#faf9f7] flex flex-col">
      <header className="h-14 flex items-center px-4">
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="ml-2 text-lg font-semibold text-slate-800">账户管理</h1>
      </header>

      <div className="flex-1 flex flex-col items-center px-6 pb-20">
        <div className="w-full max-w-sm mt-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#8b5cf6] flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto mb-6">
            {(user.email?.[0] ?? user.name?.[0] ?? "U").toUpperCase()}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-400 mb-1">名称</div>
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nameValue}
                        onChange={(e) => { setNameValue(e.target.value); setNameError(null); }}
                        maxLength={50}
                        className="flex-1 px-2.5 h-8 rounded-md border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:border-slate-400"
                        autoFocus
                        onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={nameSaving}
                        className="cursor-pointer px-2.5 h-8 rounded-md bg-[var(--color-primary)] text-white text-xs font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
                      >
                        {nameSaving ? "..." : "保存"}
                      </button>
                      <button
                        onClick={() => { setEditingName(false); setNameValue(user.name ?? ""); setNameError(null); }}
                        className="cursor-pointer px-2.5 h-8 rounded-md border border-slate-200 text-slate-500 text-xs hover:bg-slate-50 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-800 truncate">{user.name || "未设置"}</span>
                      <button
                        onClick={() => { setEditingName(true); setNameValue(user.name ?? ""); }}
                        className="cursor-pointer text-xs text-[var(--color-primary)] hover:underline shrink-0"
                      >
                        修改
                      </button>
                    </div>
                  )}
                  {nameError && <div className="text-xs text-red-500 mt-1">{nameError}</div>}
                </div>
              </div>
            </div>

            <div className="px-5 py-4">
              <div className="text-xs text-slate-400 mb-1">邮箱</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-800">{user.email}</span>
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    已验证
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-medium">
                    未验证
                  </span>
                )}
              </div>
              {!user.emailVerified && (
                <div className="mt-3">
                  {linkSent ? (
                    <p className="text-xs text-slate-500">验证链接已发送，请检查您的收件箱并点击链接完成验证。</p>
                  ) : (
                    <button
                      onClick={handleSendVerifyLink}
                      disabled={sendingLink}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white text-xs font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
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
            <div className={`mt-4 p-3 rounded-lg text-sm ${messageType === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {message}
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleSignOut}
              className="cursor-pointer w-full h-10 rounded-lg border border-red-200 bg-white text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
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
      <main className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <AccountContent />
    </Suspense>
  );
}
