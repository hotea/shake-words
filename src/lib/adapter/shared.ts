/**
 * Shared utilities used by all adapter implementations.
 */

import type { GestureDirection, Word, WordProgress, LearningRecord, LearningStats, QuizQuestion, QuizOption } from "@/lib/types";
import { wordBookManager } from "@/data/wordbooks";
import { calculateNextProgress, isDueForReview, isMastered, sortByReviewPriority } from "@/lib/spaced-repetition";

const DIRECTIONS: GestureDirection[] = ["up", "right", "down", "left"];

/** Pick N random items from an array (Fisher-Yates) */
export function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

/** Shuffle the 4 gesture directions */
export function shuffleDirections(): GestureDirection[] {
  const dirs = [...DIRECTIONS];
  for (let i = dirs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
  }
  return dirs;
}

/** Generate a quiz question for a given book, using the provided progress data */
export function buildQuizQuestion(
  bookId: string,
  progressList: WordProgress[],
): QuizQuestion | null {
  // This is intentionally sync-looking but the caller should have already loaded words
  // We use wordBookManager which caches in memory
  const allWords = wordBookManager.getCachedWords?.(bookId);
  if (!allWords || allWords.length < 4) return null;

  const progressMap = new Map(progressList.map((p) => [p.wordId, p]));
  const unseenWords = allWords.filter((w) => !progressMap.has(w.id));
  let targetWord: Word;

  if (unseenWords.length > 0) {
    targetWord = unseenWords[Math.floor(Math.random() * unseenWords.length)];
  } else {
    const sorted = sortByReviewPriority(progressList);
    const targetProgress = sorted[0];
    const found = allWords.find((w) => w.id === targetProgress.wordId);
    if (!found) return null;
    targetWord = found;
  }

  const wrongWords = pickRandom(
    allWords.filter((w) => w.id !== targetWord.id),
    3,
  );

  const dirs = shuffleDirections();
  const correctDir = dirs[0];

  const options: QuizOption[] = [
    { direction: correctDir, meaning: targetWord.meaning, isCorrect: true },
    ...wrongWords.map((w, i) => ({
      direction: dirs[i + 1],
      meaning: w.meaning,
      isCorrect: false,
    })),
  ];

  return { word: targetWord, options };
}

/** Calculate learning stats from records and progress */
export function calculateStats(
  records: LearningRecord[],
  progressList: WordProgress[],
  bookId?: string,
): LearningStats {
  const filteredRecords = bookId ? records.filter((r) => r.bookId === bookId) : records;
  const filteredProgress = bookId ? progressList.filter((p) => p.bookId === bookId) : progressList;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayRecords = filteredRecords.filter(
    (r) => new Date(r.createdAt).getTime() >= todayStart.getTime(),
  );
  const todayCorrect = todayRecords.filter((r) => r.isCorrect).length;

  // Streak calculation
  let streak = 0;
  const dayMs = 24 * 60 * 60 * 1000;
  const checkDate = new Date(todayStart);

  for (let i = 0; i < 365; i++) {
    const dayStart = new Date(checkDate.getTime() - i * dayMs);
    const dayEnd = new Date(dayStart.getTime() + dayMs);
    const hasRecord = filteredRecords.some((r) => {
      const t = new Date(r.createdAt).getTime();
      return t >= dayStart.getTime() && t < dayEnd.getTime();
    });
    if (hasRecord) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return {
    totalWords: filteredProgress.length,
    masteredWords: filteredProgress.filter(isMastered).length,
    todayReviewed: todayRecords.length,
    todayCorrectRate: todayRecords.length > 0 ? todayCorrect / todayRecords.length : 0,
    streak,
  };
}

// Re-export for convenience
export { calculateNextProgress, isDueForReview, isMastered, sortByReviewPriority };
