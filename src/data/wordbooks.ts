import type { Word, WordBook } from "@/lib/types";
import rawCET4 from "./cet4-words.json";
import rawCET6 from "./cet6-words.json";
import rawTOEFL from "./toefl-words.json";
import rawIELTS from "./ielts-words.json";
import rawGRE from "./gre-words.json";
import rawKaoyan from "./kaoyan-words.json";
import rawSAT from "./sat-words.json";
import rawBEC from "./bec-words.json";

// ============================================================
// 本地词书数据
// 数据来源：
//   CET4/CET6/TOEFL/考研/SAT — KyleBing/english-vocabulary (GitHub, 1.5k★)
//   IELTS/GRE/BEC — kajweb/dict (GitHub, 3.2k★)
// ============================================================

// --- CET-4 ---
export const CET4_BOOK_ID = "cet4-builtin";
export const CET4_BOOK: WordBook = {
  id: CET4_BOOK_ID,
  name: "CET-4 词汇",
  description: "大学英语四级词汇，来自 KyleBing 开源词库",
  isBuiltin: true,
  wordCount: rawCET4.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "cet",
};
export const CET4_WORDS: Word[] = rawCET4.map((w) => ({
  ...w,
  bookId: CET4_BOOK_ID,
}));

// --- CET-6 ---
export const CET6_BOOK_ID = "cet6-builtin";
export const CET6_BOOK: WordBook = {
  id: CET6_BOOK_ID,
  name: "CET-6 词汇",
  description: "大学英语六级词汇，来自 KyleBing 开源词库",
  isBuiltin: true,
  wordCount: rawCET6.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "cet",
};
export const CET6_WORDS: Word[] = rawCET6.map((w) => ({
  ...w,
  bookId: CET6_BOOK_ID,
}));

// --- 考研 ---
export const KAOYAN_BOOK_ID = "kaoyan-builtin";
export const KAOYAN_BOOK: WordBook = {
  id: KAOYAN_BOOK_ID,
  name: "考研词汇",
  description: "考研英语词汇，来自 KyleBing 开源词库",
  isBuiltin: true,
  wordCount: rawKaoyan.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "cet",
};
export const KAOYAN_WORDS: Word[] = rawKaoyan.map((w) => ({
  ...w,
  bookId: KAOYAN_BOOK_ID,
}));

// --- IELTS ---
export const IELTS_BOOK_ID = "ielts-builtin";
export const IELTS_BOOK: WordBook = {
  id: IELTS_BOOK_ID,
  name: "雅思词汇",
  description: "雅思考试词汇，来自有道词库（kajweb/dict）",
  isBuiltin: true,
  wordCount: rawIELTS.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "ielts",
};
export const IELTS_WORDS: Word[] = rawIELTS.map((w) => ({
  ...w,
  bookId: IELTS_BOOK_ID,
}));

// --- TOEFL ---
export const TOEFL_BOOK_ID = "toefl-builtin";
export const TOEFL_BOOK: WordBook = {
  id: TOEFL_BOOK_ID,
  name: "托福词汇",
  description: "托福考试词汇，来自 KyleBing 开源词库",
  isBuiltin: true,
  wordCount: rawTOEFL.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "toefl",
};
export const TOEFL_WORDS: Word[] = rawTOEFL.map((w) => ({
  ...w,
  bookId: TOEFL_BOOK_ID,
}));

// --- GRE ---
export const GRE_BOOK_ID = "gre-builtin";
export const GRE_BOOK: WordBook = {
  id: GRE_BOOK_ID,
  name: "GRE 词汇",
  description: "GRE 考试词汇，来自有道词库（kajweb/dict）",
  isBuiltin: true,
  wordCount: rawGRE.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "gre",
};
export const GRE_WORDS: Word[] = rawGRE.map((w) => ({
  ...w,
  bookId: GRE_BOOK_ID,
}));

// --- SAT ---
export const SAT_BOOK_ID = "sat-builtin";
export const SAT_BOOK: WordBook = {
  id: SAT_BOOK_ID,
  name: "SAT 词汇",
  description: "SAT 考试词汇，来自 KyleBing 开源词库",
  isBuiltin: true,
  wordCount: rawSAT.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "sat",
};
export const SAT_WORDS: Word[] = rawSAT.map((w) => ({
  ...w,
  bookId: SAT_BOOK_ID,
}));

// --- BEC 商务英语 ---
export const BEC_BOOK_ID = "bec-builtin";
export const BEC_BOOK: WordBook = {
  id: BEC_BOOK_ID,
  name: "商务英语词汇",
  description: "BEC 商务英语词汇，来自有道词库（kajweb/dict）",
  isBuiltin: true,
  wordCount: rawBEC.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "business",
};
export const BEC_WORDS: Word[] = rawBEC.map((w) => ({
  ...w,
  bookId: BEC_BOOK_ID,
}));

// ============================================================
// 网络词书配置（保留接口兼容）
// ============================================================

export interface OnlineWordbookConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  fetcher: () => Promise<Word[]>;
}

export const ONLINE_BOOKS: OnlineWordbookConfig[] = [];

// ============================================================
// 词书管理器
// ============================================================

export class WordBookManager {
  private books: Map<string, WordBook> = new Map();
  private words: Map<string, Word[]> = new Map();
  private onlineCache: Map<string, { words: Word[]; timestamp: number }> = new Map();
  private customBooks: Map<string, WordBook> = new Map();
  private customWords: Map<string, Word[]> = new Map();
  private cacheExpiry = 24 * 60 * 60 * 1000;

  constructor() {
    // 注册所有本地词书
    this.registerBook(CET4_BOOK, CET4_WORDS);
    this.registerBook(CET6_BOOK, CET6_WORDS);
    this.registerBook(KAOYAN_BOOK, KAOYAN_WORDS);
    this.registerBook(IELTS_BOOK, IELTS_WORDS);
    this.registerBook(TOEFL_BOOK, TOEFL_WORDS);
    this.registerBook(GRE_BOOK, GRE_WORDS);
    this.registerBook(SAT_BOOK, SAT_WORDS);
    this.registerBook(BEC_BOOK, BEC_WORDS);

    // 从 localStorage 加载自定义词书
    this.loadCustomBooks();
  }

  private loadCustomBooks() {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("shakewords-custom-books");
      if (saved) {
        const data = JSON.parse(saved);
        data.forEach((item: { book: WordBook; words: Word[] }) => {
          this.customBooks.set(item.book.id, item.book);
          this.customWords.set(item.book.id, item.words);
        });
      }
    } catch (error) {
      console.error("Failed to load custom books:", error);
    }
  }

  private saveCustomBooks() {
    if (typeof window === "undefined") return;

    try {
      const data = Array.from(this.customBooks.entries()).map(([id]) => ({
        book: this.customBooks.get(id)!,
        words: this.customWords.get(id) || [],
      }));
      localStorage.setItem("shakewords-custom-books", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save custom books:", error);
    }
  }

  registerBook(book: WordBook, words: Word[]) {
    this.books.set(book.id, book);
    this.words.set(book.id, words);
  }

  registerCustomBook(book: WordBook, words: Word[]) {
    this.customBooks.set(book.id, book);
    this.customWords.set(book.id, words);
    this.saveCustomBooks();
  }

  deleteCustomBook(bookId: string) {
    this.customBooks.delete(bookId);
    this.customWords.delete(bookId);
    this.saveCustomBooks();
  }

  async searchAndCreateBook(
    topic: string,
    maxWords = 50
  ): Promise<{ book: WordBook; words: Word[] } | null> {
    try {
      const { onlineWordbookService } = await import("@/lib/api/dictionary");
      const words = await onlineWordbookService.getWordsByTopic(topic, maxWords);

      if (words.length === 0) {
        return null;
      }

      const bookId = `custom-${topic}-${Date.now()}`;
      const book: WordBook = {
        id: bookId,
        name: `${topic}词汇`,
        description: `通过搜索"${topic}"自动获取的${words.length}个相关词汇`,
        isBuiltin: false,
        isOnline: false,
        isCustom: true,
        wordCount: words.length,
        createdAt: new Date().toISOString(),
        category: "custom",
      };

      const updatedWords = words.map((w) => ({ ...w, bookId }));

      this.registerCustomBook(book, updatedWords);
      return { book, words: updatedWords };
    } catch (error) {
      console.error("Failed to search and create book:", error);
      return null;
    }
  }

  async importFromText(
    text: string,
    name: string,
    enrichMeanings = true
  ): Promise<{ book: WordBook; words: Word[] } | null> {
    try {
      const { onlineWordbookService } = await import("@/lib/api/dictionary");
      const bookId = `imported-${Date.now()}`;
      let words = onlineWordbookService.importFromText(text, bookId);

      if (words.length === 0) {
        return null;
      }

      if (enrichMeanings) {
        words = await onlineWordbookService.enrichWords(words);
      }

      const book: WordBook = {
        id: bookId,
        name: name || `导入词书 ${new Date().toLocaleDateString()}`,
        description: `从文本导入，共${words.length}个单词`,
        isBuiltin: false,
        isOnline: false,
        isCustom: true,
        wordCount: words.length,
        createdAt: new Date().toISOString(),
        category: "imported",
      };

      this.registerCustomBook(book, words);
      return { book, words };
    } catch (error) {
      console.error("Failed to import from text:", error);
      return null;
    }
  }

  async importFromJSON(
    json: string,
    name?: string
  ): Promise<{ book: WordBook; words: Word[] } | null> {
    try {
      const { onlineWordbookService } = await import("@/lib/api/dictionary");
      const bookId = `imported-json-${Date.now()}`;
      const words = onlineWordbookService.importFromJSON(json, bookId);

      if (words.length === 0) {
        return null;
      }

      const book: WordBook = {
        id: bookId,
        name: name || `导入词书 ${new Date().toLocaleDateString()}`,
        description: `从JSON导入，共${words.length}个单词`,
        isBuiltin: false,
        isOnline: false,
        isCustom: true,
        wordCount: words.length,
        createdAt: new Date().toISOString(),
        category: "imported",
      };

      this.registerCustomBook(book, words);
      return { book, words };
    } catch (error) {
      console.error("Failed to import from JSON:", error);
      return null;
    }
  }

  async exportToJSON(bookId: string): Promise<string | null> {
    try {
      const words = await this.getWords(bookId);
      if (words.length === 0) {
        return null;
      }

      const { onlineWordbookService } = await import("@/lib/api/dictionary");
      return onlineWordbookService.exportToJSON(words);
    } catch (error) {
      console.error("Failed to export book:", error);
      return null;
    }
  }

  getAllBooks(): WordBook[] {
    const localBooks = Array.from(this.books.values());
    const onlineBooks: WordBook[] = ONLINE_BOOKS.map((config) => ({
      id: config.id,
      name: config.name,
      description: config.description,
      isBuiltin: false,
      isOnline: true,
      wordCount: 0,
      createdAt: "2024-01-01T00:00:00Z",
      category: config.category,
    }));
    const customBooksList = Array.from(this.customBooks.values());
    return [...localBooks, ...onlineBooks, ...customBooksList];
  }

  getBook(id: string): WordBook | undefined {
    const localBook = this.books.get(id);
    if (localBook) return localBook;

    const customBook = this.customBooks.get(id);
    if (customBook) return customBook;

    const onlineConfig = ONLINE_BOOKS.find((c) => c.id === id);
    if (onlineConfig) {
      return {
        id: onlineConfig.id,
        name: onlineConfig.name,
        description: onlineConfig.description,
        isBuiltin: false,
        isOnline: true,
        wordCount: 0,
        createdAt: "2024-01-01T00:00:00Z",
        category: onlineConfig.category,
      };
    }
    return undefined;
  }

  async getWords(bookId: string): Promise<Word[]> {
    const localWords = this.words.get(bookId);
    if (localWords) return localWords;

    const customWords = this.customWords.get(bookId);
    if (customWords) return customWords;

    const cached = this.onlineCache.get(bookId);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.words;
    }

    const onlineConfig = ONLINE_BOOKS.find((c) => c.id === bookId);
    if (onlineConfig) {
      try {
        const words = await onlineConfig.fetcher();
        this.onlineCache.set(bookId, { words, timestamp: Date.now() });
        return words;
      } catch (error) {
        console.error("Failed to fetch online wordbook:", error);
        return [];
      }
    }

    return [];
  }

  getWord(bookId: string, wordId: string): Word | undefined {
    const words = this.words.get(bookId);
    return words?.find((w) => w.id === wordId);
  }

  isOnlineBook(bookId: string): boolean {
    return ONLINE_BOOKS.some((c) => c.id === bookId);
  }

  isCustomBook(bookId: string): boolean {
    return this.customBooks.has(bookId);
  }

  getOnlineBookConfig(bookId: string): OnlineWordbookConfig | undefined {
    return ONLINE_BOOKS.find((c) => c.id === bookId);
  }
}

// 单例实例
export const wordBookManager = new WordBookManager();
