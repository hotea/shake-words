import type { Word } from "@/lib/types";
import rawWords from "./cet4-words.json";

/**
 * CET-4 vocabulary (~4544 words).
 * Source: KyleBing/english-vocabulary (GitHub, 1.5k★)
 * Raw data lives in cet4-words.json; this module adds bookId and exports typed arrays.
 */
export const CET4_BOOK_ID = "cet4-builtin";

export const CET4_BOOK = {
  id: CET4_BOOK_ID,
  name: "CET-4 词汇",
  description: "大学英语四级词汇，来自 KyleBing 开源词库",
  isBuiltin: true,
  wordCount: rawWords.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "cet",
};

export const CET4_WORDS: Word[] = rawWords.map((w) => ({
  ...w,
  bookId: CET4_BOOK_ID,
}));

export const CET4_WORD_MAP: Map<string, Word> = new Map(
  CET4_WORDS.map((w) => [w.id, w]),
);
