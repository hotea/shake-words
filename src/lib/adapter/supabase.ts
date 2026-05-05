import type { BackendAdapter } from "./types";
import type {
  WordBook,
  Word,
  QuizQuestion,
  AnswerPayload,
  WordProgress,
  LearningRecord,
  LearningStats,
  GestureDirection,
} from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { wordBookManager } from "@/data/wordbooks";
import { buildQuizQuestion, calculateStats, calculateNextProgress } from "./shared";

// ============================================================
// SupabaseAdapter
// ============================================================
// Uses Supabase for records + progress (cloud-synced),
// but keeps vocabulary data local (built-in wordbooks).
//
// Required Supabase tables:
//   learning_records (id uuid PK, user_id uuid, word_id text, book_id text,
//                     is_correct bool, response_ms int, gesture text, created_at timestamptz)
//   word_progress    (user_id uuid, word_id text, book_id text, mastery int,
//                     next_review timestamptz, updated_at timestamptz, PK(user_id, word_id))
// ============================================================
export class SupabaseAdapter implements BackendAdapter {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  private async getUserId(): Promise<string | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user?.id ?? null;
  }

  async getWordBooks(): Promise<WordBook[]> {
    return wordBookManager.getAllBooks();
  }

  async getWordBook(bookId: string): Promise<WordBook | null> {
    return wordBookManager.getBook(bookId) ?? null;
  }

  async getWords(bookId: string, limit = 50, offset = 0): Promise<Word[]> {
    const words = await wordBookManager.getWords(bookId);
    return words.slice(offset, offset + limit);
  }

  async getWord(wordId: string): Promise<Word | null> {
    for (const book of wordBookManager.getAllBooks()) {
      const words = await wordBookManager.getWords(book.id);
      const found = words.find((w) => w.id === wordId);
      if (found) return found;
    }
    return null;
  }

  async getQuizQuestion(bookId: string): Promise<QuizQuestion | null> {
    await wordBookManager.getWords(bookId);
    const progressList = await this.getProgress(bookId);
    return buildQuizQuestion(bookId, progressList);
  }

  async submitAnswer(answer: AnswerPayload): Promise<void> {
    const userId = await this.getUserId();
    if (!userId) return;

    await this.supabase.from("learning_records").insert({
      user_id: userId,
      word_id: answer.wordId,
      book_id: answer.bookId,
      is_correct: answer.isCorrect,
      response_ms: answer.responseMs,
      gesture: answer.selectedDirection,
      created_at: new Date().toISOString(),
    });

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

    return calculateStats(records, progressList, bookId);
  }
}
