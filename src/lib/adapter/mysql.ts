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
import { wordBookManager } from "@/data/wordbooks";
import { buildQuizQuestion, calculateStats, calculateNextProgress } from "./shared";
import { query, execute } from "@/lib/db/mysql";

// Row types from MySQL
interface RecordRow {
  id: string;
  user_id: string;
  word_id: string;
  book_id: string;
  is_correct: number;
  response_ms: number;
  gesture: string | null;
  created_at: Date;
}

interface ProgressRow {
  user_id: string;
  word_id: string;
  book_id: string;
  mastery: number;
  next_review: Date;
  updated_at: Date;
}

/**
 * MySQL adapter — stores learning data in MySQL.
 * Word book data is still loaded from built-in sources.
 * All data operations are scoped to a specific user.
 */
export class MySqlAdapter implements BackendAdapter {
  constructor(private userId: string) {}

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
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const now = new Date().toISOString().slice(0, 23).replace("T", " ");

    // Insert learning record
    await execute(
      `INSERT INTO learning_records (id, user_id, word_id, book_id, is_correct, response_ms, gesture, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, this.userId, answer.wordId, answer.bookId, answer.isCorrect ? 1 : 0, answer.responseMs, answer.selectedDirection, now],
    );

    // Upsert word progress
    const progressList = await this.getProgress(answer.bookId);
    const existing = progressList.find((p) => p.wordId === answer.wordId);
    const updated = calculateNextProgress(existing ?? null, answer.wordId, answer.bookId, answer.isCorrect);

    const nextReviewStr = new Date(updated.nextReview).toISOString().slice(0, 23).replace("T", " ");
    const updatedAtStr = new Date(updated.updatedAt).toISOString().slice(0, 23).replace("T", " ");

    if (existing) {
      await execute(
        `UPDATE word_progress SET mastery = ?, next_review = ?, updated_at = ?
         WHERE user_id = ? AND word_id = ? AND book_id = ?`,
        [updated.mastery, nextReviewStr, updatedAtStr, this.userId, updated.wordId, updated.bookId],
      );
    } else {
      await execute(
        `INSERT INTO word_progress (user_id, word_id, book_id, mastery, next_review, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [this.userId, updated.wordId, updated.bookId, updated.mastery, nextReviewStr, updatedAtStr],
      );
    }
  }

  async getRecords(bookId?: string, limit = 100): Promise<LearningRecord[]> {
    let sql = "SELECT * FROM learning_records WHERE user_id = ?";
    const params: (string | number | boolean | Date | null)[] = [this.userId];

    if (bookId) {
      sql += " AND book_id = ?";
      params.push(bookId);
    }

    sql += ` ORDER BY created_at DESC LIMIT ${Math.floor(limit)}`;

    const rows = await query<RecordRow>(sql, params);
    return rows.map((r) => ({
      id: r.id,
      wordId: r.word_id,
      bookId: r.book_id,
      isCorrect: !!r.is_correct,
      responseMs: r.response_ms,
      gesture: (r.gesture as GestureDirection) ?? "up",
      createdAt: new Date(r.created_at).toISOString(),
    }));
  }

  async getProgress(bookId: string): Promise<WordProgress[]> {
    const rows = await query<ProgressRow>(
      "SELECT * FROM word_progress WHERE user_id = ? AND book_id = ?",
      [this.userId, bookId],
    );
    return rows.map((p) => ({
      wordId: p.word_id,
      bookId: p.book_id,
      mastery: p.mastery,
      nextReview: new Date(p.next_review).toISOString(),
      updatedAt: new Date(p.updated_at).toISOString(),
    }));
  }

  async getWordProgress(wordId: string): Promise<WordProgress | null> {
    const rows = await query<ProgressRow>(
      "SELECT * FROM word_progress WHERE user_id = ? AND word_id = ?",
      [this.userId, wordId],
    );
    if (rows.length === 0) return null;
    const p = rows[0];
    return {
      wordId: p.word_id,
      bookId: p.book_id,
      mastery: p.mastery,
      nextReview: new Date(p.next_review).toISOString(),
      updatedAt: new Date(p.updated_at).toISOString(),
    };
  }

  async getStats(bookId?: string): Promise<LearningStats> {
    const records = await this.getRecords(bookId, 10000);
    let progressList: WordProgress[] = [];
    if (bookId) {
      progressList = await this.getProgress(bookId);
    }
    return calculateStats(records, progressList, bookId);
  }
}
