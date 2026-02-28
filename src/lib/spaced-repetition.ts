// ============================================================
// Spaced Repetition Algorithm (SM-2 variant)
// ============================================================

import type { WordProgress } from "@/lib/types";

/** Review intervals in milliseconds indexed by mastery level (0-5) */
const INTERVALS_MS: number[] = [
  1 * 60 * 1000,        // 0 → 1 minute
  10 * 60 * 1000,       // 1 → 10 minutes
  60 * 60 * 1000,       // 2 → 1 hour
  24 * 60 * 60 * 1000,  // 3 → 1 day
  3 * 24 * 60 * 60 * 1000, // 4 → 3 days
  7 * 24 * 60 * 60 * 1000, // 5 → 7 days
];

const MAX_MASTERY = 5;

/**
 * Calculate next progress after answering a question.
 */
export function calculateNextProgress(
  current: WordProgress | null,
  wordId: string,
  bookId: string,
  isCorrect: boolean,
): WordProgress {
  const now = new Date().toISOString();

  if (!current) {
    // First time seeing this word
    const mastery = isCorrect ? 1 : 0;
    return {
      wordId,
      bookId,
      mastery,
      nextReview: new Date(Date.now() + INTERVALS_MS[mastery]).toISOString(),
      updatedAt: now,
    };
  }

  let newMastery: number;
  if (isCorrect) {
    newMastery = Math.min(current.mastery + 1, MAX_MASTERY);
  } else {
    // Wrong answer: reset to 0
    newMastery = 0;
  }

  return {
    ...current,
    mastery: newMastery,
    nextReview: new Date(Date.now() + INTERVALS_MS[newMastery]).toISOString(),
    updatedAt: now,
  };
}

/**
 * Check if a word is due for review.
 */
export function isDueForReview(progress: WordProgress): boolean {
  return new Date(progress.nextReview).getTime() <= Date.now();
}

/**
 * Check if a word is considered mastered (mastery >= 4).
 */
export function isMastered(progress: WordProgress): boolean {
  return progress.mastery >= 4;
}

/**
 * Sort words by priority: due for review first, then by lowest mastery.
 */
export function sortByReviewPriority(progressList: WordProgress[]): WordProgress[] {
  return [...progressList].sort((a, b) => {
    const aDue = isDueForReview(a);
    const bDue = isDueForReview(b);

    // Due words come first
    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;

    // Among same due status, lower mastery first
    if (a.mastery !== b.mastery) return a.mastery - b.mastery;

    // Earlier nextReview first
    return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
  });
}
