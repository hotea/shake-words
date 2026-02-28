import type { Word } from "@/lib/types";
import rawWords from "./cet4-words.json";

/**
 * CET-4 high-frequency vocabulary (~727 words).
 * Raw data lives in cet4-words.json; this module adds bookId and exports typed arrays.
 */
export const CET4_BOOK_ID = "cet4-builtin";

export const CET4_BOOK = {
  id: CET4_BOOK_ID,
  name: "CET-4 核心词汇",
  description: "大学英语四级核心高频词汇",
  isBuiltin: true,
  wordCount: rawWords.length,
  createdAt: "2024-01-01T00:00:00Z",
};

/** Full word list with bookId injected at load time */
export const CET4_WORDS: Word[] = rawWords.map((w) => ({
  ...w,
  bookId: CET4_BOOK_ID,
}));

/** Fast lookup: wordId -> Word */
export const CET4_WORD_MAP: Map<string, Word> = new Map(
  CET4_WORDS.map((w) => [w.id, w]),
);
