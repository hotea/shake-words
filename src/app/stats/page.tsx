"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdapter } from "@/lib/adapter";
import type { LearningStats, LearningRecord } from "@/lib/types";
import { CET4_BOOK_ID } from "@/data/cet4";

export default function StatsPage() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [recentRecords, setRecentRecords] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const adapter = getAdapter();
      const [s, r] = await Promise.all([
        adapter.getStats(CET4_BOOK_ID),
        adapter.getRecords(CET4_BOOK_ID, 20),
      ]);
      setStats(s);
      setRecentRecords(r);
      setLoading(false);
    }
    load();
  }, []);

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

          {/* Recent records */}
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
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
                    <span className="text-sm font-mono">{record.wordId}</span>
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
