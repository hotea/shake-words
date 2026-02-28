import type {
  WordBook,
  Word,
  QuizQuestion,
  AnswerPayload,
  WordProgress,
  LearningRecord,
  LearningStats,
} from "@/lib/types";

/**
 * Backend adapter interface.
 * All backend implementations (Supabase, REST, LocalStorage) must implement this.
 */
export interface BackendAdapter {
  // Word books
  getWordBooks(): Promise<WordBook[]>;
  getWordBook(bookId: string): Promise<WordBook | null>;

  // Words
  getWords(bookId: string, limit?: number, offset?: number): Promise<Word[]>;
  getWord(wordId: string): Promise<Word | null>;

  // Quiz
  getQuizQuestion(bookId: string): Promise<QuizQuestion | null>;

  // Learning records
  submitAnswer(answer: AnswerPayload): Promise<void>;
  getRecords(bookId?: string, limit?: number): Promise<LearningRecord[]>;

  // Progress
  getProgress(bookId: string): Promise<WordProgress[]>;
  getWordProgress(wordId: string): Promise<WordProgress | null>;

  // Stats
  getStats(bookId?: string): Promise<LearningStats>;

  // Sync (for offline-first)
  syncPendingRecords?(): Promise<void>;
}
