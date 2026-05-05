"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdapter } from "@/lib/adapter";
import { useAuth } from "@/lib/auth";
import type { LearningStats, LearningRecord } from "@/lib/types";
import { CET4_BOOK_ID, CET4_WORD_MAP } from "@/data/cet4";

function wordText(wordId: string): string {
  return CET4_WORD_MAP.get(wordId)?.word ?? wordId;
}

interface DaySummary {
  date: string;
  displayDate: string;
  total: number;
  correct: number;
  accuracy: number;
  words: Set<string>;
}

function buildDailyHistory(records: LearningRecord[]): DaySummary[] {
  const dayMap = new Map<string, { total: number; correct: number; words: Set<string> }>();
  for (const r of records) {
    const d = new Date(r.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const entry = dayMap.get(key) ?? { total: 0, correct: 0, words: new Set<string>() };
    entry.total++;
    if (r.isCorrect) entry.correct++;
    entry.words.add(r.wordId);
    dayMap.set(key, entry);
  }
  return Array.from(dayMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, val]) => ({
      date: key,
      displayDate: new Date(key + "T00:00:00").toLocaleDateString("zh-CN", { month: "short", day: "numeric", weekday: "short" }),
      total: val.total,
      correct: val.correct,
      accuracy: val.total > 0 ? val.correct / val.total : 0,
      words: val.words,
    }));
}

export default function StatsPage() {
  const { user, authEnabled, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [recentRecords, setRecentRecords] = useState<LearningRecord[]>([]);
  const [allRecords, setAllRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"recent" | "daily">("daily");
  const [bookId, setBookId] = useState<string>(CET4_BOOK_ID);

  useEffect(() => {
    async function load() {
      const adapter = await getAdapter();
      // Use selected book if available
      const selected = (adapter as any).getSelectedBookId?.();
      if (selected) setBookId(selected);
    }
    load();
  }, []);

  useEffect(() => {
    if (authEnabled && (authLoading || !user)) return;
    async function load() {
      const adapter = await getAdapter();
      const [s, recent, all] = await Promise.all([
        adapter.getStats(bookId),
        adapter.getRecords(bookId, 30),
        adapter.getRecords(bookId, 10000),
      ]);
      setStats(s);
      setRecentRecords(recent);
      setAllRecords(all);
      setLoading(false);
    }
    load();
  }, [authEnabled, authLoading, user, bookId]);

  const dailyHistory = buildDailyHistory(allRecords);

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors mb-5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            返回
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]" style={{ fontFamily: "var(--font-heading)" }}>学习统计</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">追踪你的学习进度和成果</p>
        </div>

        {authEnabled && authLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-[3px] border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : authEnabled && !user ? (
          <div className="card p-10 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">需要登录</h2>
            <p className="text-sm text-[var(--color-muted)] mb-6">登录后即可查看和同步你的学习统计</p>
            <Link href="/login" className="btn-primary text-sm">
              去登录
            </Link>
          </div>
        ) : authEnabled && user && !user.emailVerified ? (
          <div className="card p-10 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">需要验证邮箱</h2>
            <p className="text-sm text-[var(--color-muted)] mb-6">验证邮箱后才能使用统计功能，防止数据混乱</p>
            <Link href="/account" className="btn-primary text-sm">
              去验证
            </Link>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-[3px] border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stats ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="card p-5 animate-fade-in-up stagger-1">
                <div className="text-xs text-[var(--color-muted)] mb-1">总词汇</div>
                <div className="text-3xl font-bold text-[var(--color-foreground)]" style={{ fontFamily: "var(--font-heading)" }}>
                  {stats.totalWords}
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-1">词书收录</div>
              </div>
              <div className="card p-5 animate-fade-in-up stagger-2">
                <div className="text-xs text-[var(--color-muted)] mb-1">已掌握</div>
                <div className="text-3xl font-bold text-emerald-600" style={{ fontFamily: "var(--font-heading)" }}>
                  {stats.masteredWords}
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-1">熟练度 ≥ 4</div>
              </div>
              <div className="card p-5 animate-fade-in-up stagger-3">
                <div className="text-xs text-[var(--color-muted)] mb-1">今日答题</div>
                <div className="text-3xl font-bold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-heading)" }}>
                  {stats.todayReviewed}
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-1">道题</div>
              </div>
              <div className="card p-5 animate-fade-in-up stagger-4">
                <div className="text-xs text-[var(--color-muted)] mb-1">正确率</div>
                <div className="text-3xl font-bold text-amber-600" style={{ fontFamily: "var(--font-heading)" }}>
                  {Math.round(stats.todayCorrectRate * 100)}%
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-1">今日</div>
              </div>
            </div>

            {/* Streak */}
            <div className="card p-5 mb-8 animate-fade-in-up stagger-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-[var(--color-foreground)]">{stats.streak} 天连续学习</div>
                <div className="text-sm text-[var(--color-muted)]">继续保持！</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-5 p-1 rounded-xl bg-stone-100 w-fit">
              {(["daily", "recent"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    tab === t
                      ? "bg-white text-[var(--color-foreground)] shadow-sm"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  {t === "daily" ? "每日历史" : "最近活动"}
                </button>
              ))}
            </div>

            {/* Daily History */}
            {tab === "daily" && (
              <div className="animate-fade-in">
                {dailyHistory.length === 0 ? (
                  <div className="card p-8 text-center">
                    <p className="text-[var(--color-muted)] text-sm">暂无学习记录，开始测验吧！</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dailyHistory.map((day, i) => {
                      const accColor = day.accuracy >= 0.8 ? "bg-emerald-500" : day.accuracy >= 0.5 ? "bg-amber-500" : "bg-red-500";
                      return (
                        <div
                          key={day.date}
                          className={`card p-4 animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-sm text-[var(--color-foreground)]">{day.displayDate}</span>
                            <span className="text-xs text-[var(--color-muted)]">{day.date}</span>
                          </div>
                          <div className="flex items-center gap-6 mb-3">
                            <div>
                              <div className="text-lg font-bold text-[var(--color-foreground)]">{day.total}</div>
                              <div className="text-[11px] text-[var(--color-muted)]">答题</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-[var(--color-foreground)]">{day.words.size}</div>
                              <div className="text-[11px] text-[var(--color-muted)]">词汇</div>
                            </div>
                            <div className="ml-auto text-right">
                              <div className="text-lg font-bold text-[var(--color-foreground)]">{Math.round(day.accuracy * 100)}%</div>
                              <div className="text-[11px] text-[var(--color-muted)]">正确率</div>
                            </div>
                          </div>
                          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${accColor}`}
                              style={{ width: `${Math.round(day.accuracy * 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Recent records */}
            {tab === "recent" && (
              <div className="animate-fade-in">
                {recentRecords.length === 0 ? (
                  <div className="card p-8 text-center">
                    <p className="text-[var(--color-muted)] text-sm">暂无记录，开始测验吧！</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentRecords.map((record, i) => (
                      <div
                        key={record.id}
                        className={`card p-3.5 flex items-center justify-between animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${record.isCorrect ? "bg-emerald-500" : "bg-red-500"}`} />
                          <span className="text-sm font-medium text-[var(--color-foreground)]">{wordText(record.wordId)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                          <span className="font-mono uppercase">{record.gesture}</span>
                          <span>{record.responseMs}ms</span>
                          <span>{new Date(record.createdAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-[var(--color-muted)]">无法加载统计数据。</p>
          </div>
        )}

        <div className="mt-8">
          <Link href="/quiz" className="btn-primary text-sm">
            继续学习
          </Link>
        </div>
      </div>
    </main>
  );
}
