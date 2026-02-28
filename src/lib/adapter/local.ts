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
import { CET4_BOOK, CET4_WORDS } from "@/data/cet4";
import { calculateNextProgress, isDueForReview, isMastered, sortByReviewPriority } from "@/lib/spaced-repetition";

// ============================================================
// LocalStorage keys
// ============================================================
const STORAGE_KEYS = {
  RECORDS: "sw_records",
  PROGRESS: "sw_progress",
} as const;

// ============================================================
// Helpers
// ============================================================
function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Pick N random items from an array (Fisher-Yates) */
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

const DIRECTIONS: GestureDirection[] = ["up", "right", "down", "left"];

function shuffleDirections(): GestureDirection[] {
  const dirs = [...DIRECTIONS];
  for (let i = dirs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
  }
  return dirs;
}

// ============================================================
// LocalStorageAdapter
// ============================================================
export class LocalStorageAdapter implements BackendAdapter {
  private books: WordBook[] = [CET4_BOOK];
  private wordsByBook: Map<string, Word[]> = new Map([[CET4_BOOK.id, CET4_WORDS]]);

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

    // Get all progress
    const progressList = await this.getProgress(bookId);
    const progressMap = new Map(progressList.map((p) => [p.wordId, p]));

    // Find the best word to quiz:
    // 1. Words never seen (no progress)
    // 2. Words due for review (sorted by priority)
    const unseenWords = allWords.filter((w) => !progressMap.has(w.id));
    let targetWord: Word;

    if (unseenWords.length > 0) {
      // Pick a random unseen word
      targetWord = unseenWords[Math.floor(Math.random() * unseenWords.length)];
    } else {
      // All words have been seen — pick the one most due for review
      const sorted = sortByReviewPriority(progressList);
      const targetProgress = sorted[0];
      const found = allWords.find((w) => w.id === targetProgress.wordId);
      if (!found) return null;
      targetWord = found;
    }

    // Pick 3 wrong options (different meanings)
    const wrongWords = pickRandom(
      allWords.filter((w) => w.id !== targetWord.id),
      3,
    );

    // Assign directions
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
    // Save record
    const records = loadJSON<LearningRecord[]>(STORAGE_KEYS.RECORDS, []);
    const record: LearningRecord = {
      id: generateId(),
      wordId: answer.wordId,
      bookId: answer.bookId,
      isCorrect: answer.isCorrect,
      responseMs: answer.responseMs,
      gesture: answer.selectedDirection,
      createdAt: new Date().toISOString(),
    };
    records.push(record);
    saveJSON(STORAGE_KEYS.RECORDS, records);

    // Update progress
    const progressList = loadJSON<WordProgress[]>(STORAGE_KEYS.PROGRESS, []);
    const existing = progressList.find((p) => p.wordId === answer.wordId);
    const updated = calculateNextProgress(existing ?? null, answer.wordId, answer.bookId, answer.isCorrect);

    if (existing) {
      const idx = progressList.indexOf(existing);
      progressList[idx] = updated;
    } else {
      progressList.push(updated);
    }
    saveJSON(STORAGE_KEYS.PROGRESS, progressList);
  }

  async getRecords(bookId?: string, limit = 100): Promise<LearningRecord[]> {
    let records = loadJSON<LearningRecord[]>(STORAGE_KEYS.RECORDS, []);
    if (bookId) {
      records = records.filter((r) => r.bookId === bookId);
    }
    return records.slice(-limit).reverse();
  }

  async getProgress(bookId: string): Promise<WordProgress[]> {
    const all = loadJSON<WordProgress[]>(STORAGE_KEYS.PROGRESS, []);
    return all.filter((p) => p.bookId === bookId);
  }

  async getWordProgress(wordId: string): Promise<WordProgress | null> {
    const all = loadJSON<WordProgress[]>(STORAGE_KEYS.PROGRESS, []);
    return all.find((p) => p.wordId === wordId) ?? null;
  }

  async getStats(bookId?: string): Promise<LearningStats> {
    const records = loadJSON<LearningRecord[]>(STORAGE_KEYS.RECORDS, []);
    const progress = loadJSON<WordProgress[]>(STORAGE_KEYS.PROGRESS, []);

    const filteredRecords = bookId ? records.filter((r) => r.bookId === bookId) : records;
    const filteredProgress = bookId ? progress.filter((p) => p.bookId === bookId) : progress;

    // Today's records
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRecords = filteredRecords.filter(
      (r) => new Date(r.createdAt).getTime() >= todayStart.getTime(),
    );

    const todayCorrect = todayRecords.filter((r) => r.isCorrect).length;

    // Streak calculation (simplified: count consecutive days with records)
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
}
