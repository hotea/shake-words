"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdapter } from "@/lib/adapter";
import type { LearningStats, LearningRecord } from "@/lib/types";
import { CET4_BOOK_ID, CET4_WORD_MAP } from "@/data/cet4";

/** Resolve a wordId to the actual English word, falling back to the ID itself */
function wordText(wordId: string): string {
  return CET4_WORD_MAP.get(wordId)?.word ?? wordId;
}

/** Group records by date string (YYYY-MM-DD) */
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
      displayDate: new Date(key + "T00:00:00").toLocaleDateString("zh-CN", {
        month: "short",
        day: "numeric",
        weekday: "short",
      }),
      total: val.total,
      correct: val.correct,
      accuracy: val.total > 0 ? val.correct / val.total : 0,
      words: val.words,
    }));
}

export default function StatsPage() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [recentRecords, setRecentRecords] = useState<LearningRecord[]>([]);
  const [allRecords, setAllRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"recent" | "daily">("daily");

  useEffect(() => {
    async function load() {
      const adapter = getAdapter();
      const [s, recent, all] = await Promise.all([
        adapter.getStats(CET4_BOOK_ID),
        adapter.getRecords(CET4_BOOK_ID, 30),
        adapter.getRecords(CET4_BOOK_ID, 10000),
      ]);
      setStats(s);
      setRecentRecords(recent);
      setAllRecords(all);
      setLoading(false);
    }
    load();
  }, []);

  const dailyHistory = buildDailyHistory(allRecords);

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-12">
      <div className="mb-10 animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-bold mt-5">Learning Stats</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stats ? (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Words",
                value: stats.totalWords,
                color: "text-[var(--color-foreground)]",
                bg: "bg-white/[0.03]",
                icon: (
                  <svg className="w-4 h-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                ),
              },
              {
                label: "Mastered",
                value: stats.masteredWords,
                color: "text-[var(--color-success)]",
                bg: "bg-[var(--color-success-dim)]",
                icon: (
                  <svg className="w-4 h-4 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ),
              },
              {
                label: "Today",
                value: stats.todayReviewed,
                color: "text-[var(--color-primary-light)]",
                bg: "bg-[var(--color-primary-dim)]",
                icon: (
                  <svg className="w-4 h-4 text-[var(--color-primary-light)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                ),
              },
              {
                label: "Accuracy",
                value: `${Math.round(stats.todayCorrectRate * 100)}%`,
                color: "text-[var(--color-warning)]",
                bg: "bg-[var(--color-warning-dim)]",
                icon: (
                  <svg className="w-4 h-4 text-[var(--color-warning)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`card p-4 text-center animate-fade-in-up stagger-${i + 1}`}
              >
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mx-auto mb-3`}>
                  {item.icon}
                </div>
                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-[var(--color-muted)] mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Streak */}
          <div className="card p-5 mb-8 animate-fade-in-up stagger-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <span className="text-2xl">&#x1F525;</span>
              </div>
              <div>
                <div className="text-xl font-bold">{stats.streak} day streak</div>
                <div className="text-xs text-[var(--color-muted)]">Keep the momentum going!</div>
              </div>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 mb-5 p-1 rounded-xl glass w-fit">
            {(["daily", "recent"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === t
                    ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {t === "daily" ? "Daily History" : "Recent Activity"}
              </button>
            ))}
          </div>

          {/* Daily History */}
          {tab === "daily" && (
            <div className="animate-fade-in">
              {dailyHistory.length === 0 ? (
                <p className="text-[var(--color-muted)] py-8 text-center">No learning history yet. Start a quiz!</p>
              ) : (
                <div className="space-y-3">
                  {dailyHistory.map((day, i) => (
                    <div
                      key={day.date}
                      className={`card p-5 animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-sm">{day.displayDate}</span>
                        <span className="text-xs text-[var(--color-muted)]/60">{day.date}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-[var(--color-primary-light)]">{day.total}</div>
                          <div className="text-[10px] text-[var(--color-muted)]">Answers</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-[var(--color-foreground)]">{day.words.size}</div>
                          <div className="text-[10px] text-[var(--color-muted)]">Words</div>
                        </div>
                        <div>
                          <div className={`text-lg font-bold ${day.accuracy >= 0.8 ? "text-[var(--color-success)]" : day.accuracy >= 0.5 ? "text-[var(--color-warning)]" : "text-[var(--color-error)]"}`}>
                            {Math.round(day.accuracy * 100)}%
                          </div>
                          <div className="text-[10px] text-[var(--color-muted)]">Accuracy</div>
                        </div>
                      </div>
                      {/* Accuracy bar */}
                      <div className="mt-4 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            day.accuracy >= 0.8 ? "bg-[var(--color-success)]" : day.accuracy >= 0.5 ? "bg-[var(--color-warning)]" : "bg-[var(--color-error)]"
                          }`}
                          style={{ width: `${Math.round(day.accuracy * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent records */}
          {tab === "recent" && (
            <div className="animate-fade-in">
              {recentRecords.length === 0 ? (
                <p className="text-[var(--color-muted)] py-8 text-center">No records yet. Start a quiz!</p>
              ) : (
                <div className="space-y-2">
                  {recentRecords.map((record, i) => (
                    <div
                      key={record.id}
                      className={`card flex items-center justify-between p-4 animate-fade-in-up stagger-${Math.min(i + 1, 5)}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            record.isCorrect ? "bg-[var(--color-success)] shadow-sm shadow-[var(--color-success)]/30" : "bg-[var(--color-error)] shadow-sm shadow-[var(--color-error)]/30"
                          }`}
                        />
                        <span className="text-sm font-semibold">{wordText(record.wordId)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                        <span className="font-mono">{record.gesture}</span>
                        <span className="text-[var(--color-muted)]/50">{record.responseMs}ms</span>
                        <span>{new Date(record.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-[var(--color-muted)]">Unable to load stats.</p>
      )}

      <div className="mt-10">
        <Link href="/quiz" className="btn-primary">
          Continue Learning
        </Link>
      </div>
    </main>
  );
}
