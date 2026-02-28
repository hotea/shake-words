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
  date: string;        // YYYY-MM-DD
  displayDate: string; // localized
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
    .sort(([a], [b]) => b.localeCompare(a)) // newest first
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
        adapter.getRecords(CET4_BOOK_ID, 10000), // fetch all for daily history
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
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold mt-4">Learning Stats</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stats ? (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Words", value: stats.totalWords, color: "text-[var(--color-foreground)]" },
              { label: "Mastered", value: stats.masteredWords, color: "text-[var(--color-success)]" },
              { label: "Today", value: stats.todayReviewed, color: "text-[var(--color-primary)]" },
              {
                label: "Accuracy",
                value: `${Math.round(stats.todayCorrectRate * 100)}%`,
                color: "text-[var(--color-warning)]",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-center"
              >
                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-[var(--color-muted)] mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Streak */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">&#x1F525;</span>
              <div>
                <div className="text-lg font-bold">{stats.streak} day streak</div>
                <div className="text-xs text-[var(--color-muted)]">Keep it up!</div>
              </div>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 mb-4 p-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] w-fit">
            <button
              onClick={() => setTab("daily")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "daily"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              }`}
            >
              Daily History
            </button>
            <button
              onClick={() => setTab("recent")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "recent"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              }`}
            >
              Recent Activity
            </button>
          </div>

          {/* Daily History */}
          {tab === "daily" && (
            <>
              {dailyHistory.length === 0 ? (
                <p className="text-[var(--color-muted)]">No learning history yet. Start a quiz!</p>
              ) : (
                <div className="space-y-3">
                  {dailyHistory.map((day) => (
                    <div
                      key={day.date}
                      className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{day.displayDate}</span>
                        <span className="text-xs text-[var(--color-muted)]">{day.date}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-[var(--color-primary)]">{day.total}</div>
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
                      {/* Mini accuracy bar */}
                      <div className="mt-3 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            day.accuracy >= 0.8 ? "bg-[var(--color-success)]" : day.accuracy >= 0.5 ? "bg-[var(--color-warning)]" : "bg-[var(--color-error)]"
                          }`}
                          style={{ width: `${Math.round(day.accuracy * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Recent records */}
          {tab === "recent" && (
            <>
              {recentRecords.length === 0 ? (
                <p className="text-[var(--color-muted)]">No records yet. Start a quiz!</p>
              ) : (
                <div className="space-y-2">
                  {recentRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            record.isCorrect ? "bg-[var(--color-success)]" : "bg-[var(--color-error)]"
                          }`}
                        />
                        <span className="text-sm font-semibold">{wordText(record.wordId)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                        <span>{record.gesture}</span>
                        <span>{record.responseMs}ms</span>
                        <span>{new Date(record.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p className="text-[var(--color-muted)]">Unable to load stats.</p>
      )}

      <div className="mt-8">
        <Link
          href="/quiz"
          className="inline-block px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white font-semibold transition-colors"
        >
          Continue Learning
        </Link>
      </div>
    </main>
  );
}
