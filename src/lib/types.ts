// ============================================================
// Core domain types for ShakeWords
// ============================================================

/** Gesture directions mapped to quiz option positions */
export type GestureDirection = "up" | "down" | "left" | "right";

/** Word book (vocabulary list) */
export interface WordBook {
  id: string;
  name: string;
  description: string;
  isBuiltin: boolean;
  wordCount: number;
  createdAt: string;
}

/** A single vocabulary word */
export interface Word {
  id: string;
  bookId: string;
  word: string;
  phonetic: string;
  meaning: string; // primary meaning (Chinese)
  example?: string;
}

/** Quiz question with 4 options */
export interface QuizQuestion {
  word: Word;
  options: QuizOption[];
}

/** A single quiz option positioned at a direction */
export interface QuizOption {
  direction: GestureDirection;
  meaning: string;
  isCorrect: boolean;
}

/** Answer submission payload */
export interface AnswerPayload {
  wordId: string;
  bookId: string;
  selectedDirection: GestureDirection;
  isCorrect: boolean;
  responseMs: number;
}

/** Learning record */
export interface LearningRecord {
  id: string;
  wordId: string;
  bookId: string;
  isCorrect: boolean;
  responseMs: number;
  gesture: GestureDirection;
  createdAt: string;
}

/** User progress for a word */
export interface WordProgress {
  wordId: string;
  bookId: string;
  mastery: number; // 0-5
  nextReview: string; // ISO date
  updatedAt: string;
}

/** Aggregate stats for display */
export interface LearningStats {
  totalWords: number;
  masteredWords: number; // mastery >= 4
  todayReviewed: number;
  todayCorrectRate: number;
  streak: number; // consecutive days
}

/** Gesture detection event */
export interface GestureEvent {
  direction: GestureDirection;
  confidence: number;
  timestamp: number;
}

/** Head pose angles */
export interface HeadPose {
  pitch: number; // up/down rotation in degrees
  yaw: number; // left/right rotation in degrees
  roll: number; // tilt in degrees
}
