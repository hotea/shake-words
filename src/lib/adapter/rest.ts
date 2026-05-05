"use client";

import type { BackendAdapter } from "./types";
import type {
  WordBook,
  Word,
  QuizQuestion,
  AnswerPayload,
  WordProgress,
  LearningRecord,
  LearningStats,
} from "@/lib/types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function api(path: string): string {
  return `${basePath}${path}`;
}

export class RestAdapter implements BackendAdapter {
  private async fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  async getWordBooks(): Promise<WordBook[]> {
    return this.fetchJSON<WordBook[]>(api("/api/wordbooks"));
  }

  async getWordBook(bookId: string): Promise<WordBook | null> {
    const books = await this.getWordBooks();
    return books.find((b) => b.id === bookId) ?? null;
  }

  async getWords(bookId: string, limit = 50, offset = 0): Promise<Word[]> {
    return this.fetchJSON<Word[]>(
      api(`/api/words?bookId=${encodeURIComponent(bookId)}&limit=${limit}&offset=${offset}`),
    );
  }

  async getWord(wordId: string): Promise<Word | null> {
    const books = await this.getWordBooks();
    for (const book of books) {
      const words = await this.getWords(book.id, 10000);
      const found = words.find((w) => w.id === wordId);
      if (found) return found;
    }
    return null;
  }

  async getQuizQuestion(bookId: string): Promise<QuizQuestion | null> {
    return this.fetchJSON<QuizQuestion | null>(
      api(`/api/quiz?bookId=${encodeURIComponent(bookId)}`),
    );
  }

  async submitAnswer(answer: AnswerPayload): Promise<void> {
    const res = await fetch(api("/api/answer"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answer),
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
  }

  async getRecords(bookId?: string, limit = 100): Promise<LearningRecord[]> {
    const params = new URLSearchParams();
    if (bookId) params.set("bookId", bookId);
    params.set("limit", String(limit));
    return this.fetchJSON<LearningRecord[]>(api(`/api/records?${params}`));
  }

  async getProgress(bookId: string): Promise<WordProgress[]> {
    return this.fetchJSON<WordProgress[]>(
      api(`/api/progress?bookId=${encodeURIComponent(bookId)}`),
    );
  }

  async getWordProgress(wordId: string): Promise<WordProgress | null> {
    return null;
  }

  async getStats(bookId?: string): Promise<LearningStats> {
    const params = new URLSearchParams();
    if (bookId) params.set("bookId", bookId);
    return this.fetchJSON<LearningStats>(api(`/api/stats?${params}`));
  }
}
