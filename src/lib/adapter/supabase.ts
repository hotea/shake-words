import type { BackendAdapter } from "./types";
import type {
  WordBook,
  Word,
  QuizQuestion,
  QuizOption,
  AnswerPayload,
  WordProgress,
  LearningRecord,
  LearningStats,
  GestureDirection,
} from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CET4_BOOK, CET4_WORDS } from "@/data/cet4";
import { calculateNextProgress, isDueForReview, isMastered, sortByReviewPriority } from "@/lib/spaced-repetition";

// ============================================================
// Helpers
// ============================================================
const DIRECTIONS: GestureDirection[] = ["up", "right", "down", "left"];

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function shuffleDirections(): GestureDirection[] {
  const dirs = [...DIRECTIONS];
  for (let i = dirs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
  }
  return dirs;
}

// ============================================================
// SupabaseAdapter
// ============================================================
// Uses Supabase for records + progress (cloud-synced),
// but keeps vocabulary data local (built-in CET4 words).
//
// Required Supabase tables:
//   learning_records (id uuid PK, user_id uuid, word_id text, book_id text,
//                     is_correct bool, response_ms int, gesture text, created_at timestamptz)
//   word_progress    (user_id uuid, word_id text, book_id text, mastery int,
//                     next_review timestamptz, updated_at timestamptz, PK(user_id, word_id))
// ============================================================
export class SupabaseAdapter implements BackendAdapter {
  private supabase: SupabaseClient;
  private books: WordBook[] = [CET4_BOOK];
  private wordsByBook: Map<string, Word[]> = new Map([[CET4_BOOK.id, CET4_WORDS]]);

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  private async getUserId(): Promise<string | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user?.id ?? null;
  }

  async getWordBooks(): Promise<WordBook[]> {
    return this.books;
  }

  async getWordBook(bookId: string): Promise<WordBook | null> {
    return this.books.find((b) => b.id === bookId) ?? null;
  }

  async getWords(bookId: string, limit = 50, offset = 0): Promise<Word[]> {
    const words = this.wordsByBook.get(bookId) ?? [];
    return words.slice(offset, offset + limit);
  }

  async getWord(wordId: string): Promise<Word | null> {
    for (const words of this.wordsByBook.values()) {
      const found = words.find((w) => w.id === wordId);
      if (found) return found;
    }
    return null;
  }

  async getQuizQuestion(bookId: string): Promise<QuizQuestion | null> {
    const allWords = this.wordsByBook.get(bookId);
    if (!allWords || allWords.length < 4) return null;

    const progressList = await this.getProgress(bookId);
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

  async submitAnswer(answer: AnswerPayload): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    // Insert record
    await this.supabase.from("learning_records").insert({
      user_id: userId,
      word_id: answer.wordId,
      book_id: answer.bookId,
      is_correct: answer.isCorrect,
      response_ms: answer.responseMs,
      gesture: answer.selectedDirection,
      created_at: new Date().toISOString(),
    });

    // Upsert progress
    const progressList = await this.getProgress(answer.bookId);
    const existing = progressList.find((p) => p.wordId === answer.wordId);
    const updated = calculateNextProgress(existing ?? null, answer.wordId, answer.bookId, answer.isCorrect);

    await this.supabase.from("word_progress").upsert({
      user_id: userId,
      word_id: updated.wordId,
      book_id: updated.bookId,
      mastery: updated.mastery,
      next_review: updated.nextReview,
      updated_at: updated.updatedAt,
    }, { onConflict: "user_id,word_id" });
  }

  async getRecords(bookId?: string, limit = 100): Promise<LearningRecord[]> {
    const userId = await this.getUserId();
    if (!userId) return [];

    let query = this.supabase
      .from("learning_records")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (bookId) {
      query = query.eq("book_id", bookId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((r: Record<string, unknown>) => ({
      id: r.id as string,
      wordId: r.word_id as string,
      bookId: r.book_id as string,
      isCorrect: r.is_correct as boolean,
      responseMs: r.response_ms as number,
      gesture: r.gesture as GestureDirection,
      createdAt: r.created_at as string,
    }));
  }

  async getProgress(bookId: string): Promise<WordProgress[]> {
    const userId = await this.getUserId();
    if (!userId) return [];

    const { data, error } = await this.supabase
      .from("word_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("book_id", bookId);

    if (error || !data) return [];

    return data.map((p: Record<string, unknown>) => ({
      wordId: p.word_id as string,
      bookId: p.book_id as string,
      mastery: p.mastery as number,
      nextReview: p.next_review as string,
      updatedAt: p.updated_at as string,
    }));
  }

  async getWordProgress(wordId: string): Promise<WordProgress | null> {
    const userId = await this.getUserId();
    if (!userId) return null;

    const { data, error } = await this.supabase
      .from("word_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("word_id", wordId)
      .single();

    if (error || !data) return null;

    return {
      wordId: data.word_id,
      bookId: data.book_id,
      mastery: data.mastery,
      nextReview: data.next_review,
      updatedAt: data.updated_at,
    };
  }

  async getStats(bookId?: string): Promise<LearningStats> {
    const records = await this.getRecords(bookId, 10000);
    const userId = await this.getUserId();

    let progressList: WordProgress[] = [];
    if (userId && bookId) {
      progressList = await this.getProgress(bookId);
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRecords = records.filter(
      (r) => new Date(r.createdAt).getTime() >= todayStart.getTime(),
    );

    const todayCorrect = todayRecords.filter((r) => r.isCorrect).length;

    // Streak
    let streak = 0;
    const dayMs = 24 * 60 * 60 * 1000;
    const checkDate = new Date(todayStart);

    for (let i = 0; i < 365; i++) {
      const dayStart = new Date(checkDate.getTime() - i * dayMs);
      const dayEnd = new Date(dayStart.getTime() + dayMs);
      const hasRecord = records.some((r) => {
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
      totalWords: progressList.length,
      masteredWords: progressList.filter(isMastered).length,
      todayReviewed: todayRecords.length,
      todayCorrectRate: todayRecords.length > 0 ? todayCorrect / todayRecords.length : 0,
      streak,
    };
  }
}
