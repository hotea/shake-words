// ============================================================
// 网络词典 API 服务
// 支持多个免费词典 API 源
// ============================================================

import type { Word } from "@/lib/types";

// API 响应类型定义
interface DatamuseWord {
  word: string;
  defs?: string[];
}

interface FreeDictionaryDefinition {
  definition: string;
  synonyms?: string[];
  antonyms?: string[];
  example?: string;
}

interface FreeDictionaryMeaning {
  partOfSpeech: string;
  definitions: FreeDictionaryDefinition[];
}

interface FreeDictionaryResponse {
  word: string;
  phonetic?: string;
  phonetics?: { text?: string; audio?: string }[];
  meanings: FreeDictionaryMeaning[];
}

// ============================================================
// Datamuse API (免费，无需密钥)
// https://www.datamuse.com/api/
// ============================================================
export class DatamuseAPI {
  private baseUrl = "https://api.datamuse.com";

  /**
   * 获取单词列表（按主题/分类）
   * @param topic 主题，如 "college", "business", "science"
   * @param max 最大返回数量
   */
  async getWordsByTopic(topic: string, max = 50): Promise<Word[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/words?ml=${encodeURIComponent(topic)}&max=${max}&md=d`
      );
      
      if (!response.ok) {
        throw new Error(`Datamuse API error: ${response.status}`);
      }

      const data: DatamuseWord[] = await response.json();
      
      return data
        .filter((item) => item.defs && item.defs.length > 0)
        .map((item, index) => ({
          id: `datamuse-${topic}-${index}`,
          bookId: `online-${topic}`,
          word: item.word,
          phonetic: "",
          meaning: this.parseDefinition(item.defs?.[0] || ""),
        }));
    } catch (error) {
      console.error("Datamuse API error:", error);
      return [];
    }
  }

  /**
   * 搜索相关词汇
   * @param query 查询词
   * @param max 最大返回数量
   */
  async getRelatedWords(query: string, max = 20): Promise<Word[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/words?rel_syn=${encodeURIComponent(query)}&max=${max}&md=d`
      );
      
      if (!response.ok) {
        throw new Error(`Datamuse API error: ${response.status}`);
      }

      const data: DatamuseWord[] = await response.json();
      
      return data.map((item, index) => ({
        id: `datamuse-syn-${index}`,
        bookId: `online-related`,
        word: item.word,
        phonetic: "",
        meaning: this.parseDefinition(item.defs?.[0] || ""),
      }));
    } catch (error) {
      console.error("Datamuse API error:", error);
      return [];
    }
  }

  /**
   * 获取高频词汇（按使用频率）
   * @param prefix 前缀过滤
   * @param max 最大返回数量
   */
  async getFrequentWords(prefix = "", max = 100): Promise<Word[]> {
    try {
      const url = prefix
        ? `${this.baseUrl}/words?sp=${prefix}*&max=${max}&md=d&fq=f:100`
        : `${this.baseUrl}/words?max=${max}&md=d&fq=f:100`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Datamuse API error: ${response.status}`);
      }

      const data: DatamuseWord[] = await response.json();
      
      return data
        .filter((item) => item.defs && item.defs.length > 0)
        .map((item, index) => ({
          id: `datamuse-freq-${index}`,
          bookId: `online-frequent`,
          word: item.word,
          phonetic: "",
          meaning: this.parseDefinition(item.defs?.[0] || ""),
        }));
    } catch (error) {
      console.error("Datamuse API error:", error);
      return [];
    }
  }

  private parseDefinition(def: string): string {
    // Datamuse 返回的定义格式通常是 "n\t定义内容" 或 "v\t定义内容"
    const parts = def.split("\t");
    if (parts.length > 1) {
      const pos = parts[0]; // part of speech
      const meaning = parts[1];
      const posMap: Record<string, string> = {
        n: "n.",
        v: "v.",
        adj: "adj.",
        adv: "adv.",
      };
      return `${posMap[pos] || pos} ${meaning}`;
    }
    return def;
  }
}

// ============================================================
// Free Dictionary API (免费，无需密钥)
// https://dictionaryapi.dev/
// ============================================================
export class FreeDictionaryAPI {
  private baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en";

  /**
   * 查询单词详细定义
   * @param word 要查询的单词
   */
  async lookupWord(word: string): Promise<Word | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${encodeURIComponent(word)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // 单词未找到
        }
        throw new Error(`Dictionary API error: ${response.status}`);
      }

      const data: FreeDictionaryResponse[] = await response.json();
      const entry = data[0];
      
      if (!entry || !entry.meanings || entry.meanings.length === 0) {
        return null;
      }

      // 提取主要定义
      const primaryMeaning = entry.meanings[0];
      const primaryDef = primaryMeaning.definitions[0];
      
      return {
        id: `dict-${entry.word}`,
        bookId: "online-dictionary",
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics?.[0]?.text || "",
        meaning: `${this.translatePOS(primaryMeaning.partOfSpeech)} ${primaryDef.definition}`,
        example: primaryDef.example,
      };
    } catch (error) {
      console.error("Dictionary API error:", error);
      return null;
    }
  }

  /**
   * 批量查询单词（带缓存）
   * @param words 单词列表
   */
  async lookupWords(words: string[]): Promise<Word[]> {
    const results: Word[] = [];
    
    // 使用 Promise.allSettled 并行查询，但限制并发数
    const batchSize = 5;
    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map((word) => this.lookupWord(word))
      );
      
      batchResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          results.push(result.value);
        }
      });
    }
    
    return results;
  }

  private translatePOS(pos: string): string {
    const posMap: Record<string, string> = {
      noun: "n.",
      verb: "v.",
      "adjective": "adj.",
      "adverb": "adv.",
      pronoun: "pron.",
      preposition: "prep.",
      conjunction: "conj.",
      interjection: "int.",
    };
    return posMap[pos.toLowerCase()] || pos;
  }
}

// ============================================================
// 网络词书服务（组合多个 API）
// ============================================================
export class OnlineWordbookService {
  private datamuse = new DatamuseAPI();
  private dictionary = new FreeDictionaryAPI();

  /**
   * 获取 GRE 高频词汇
   */
  async getGREWords(): Promise<Word[]> {
    // 使用 Datamuse 获取学术相关词汇
    const words = await this.datamuse.getWordsByTopic("academic", 100);
    return words.map((w, i) => ({
      ...w,
      bookId: "online-gre",
      id: `gre-${i}`,
    }));
  }

  /**
   * 获取商务英语词汇
   */
  async getBusinessWords(): Promise<Word[]> {
    const words = await this.datamuse.getWordsByTopic("business", 80);
    return words.map((w, i) => ({
      ...w,
      bookId: "online-business",
      id: `business-${i}`,
    }));
  }

  /**
   * 获取日常高频词汇
   */
  async getDailyWords(): Promise<Word[]> {
    const words = await this.datamuse.getFrequentWords("", 100);
    return words.map((w, i) => ({
      ...w,
      bookId: "online-daily",
      id: `daily-${i}`,
    }));
  }

  /**
   * 获取计算机/IT 词汇
   */
  async getTechWords(): Promise<Word[]> {
    const words = await this.datamuse.getWordsByTopic("computer", 80);
    return words.map((w, i) => ({
      ...w,
      bookId: "online-tech",
      id: `tech-${i}`,
    }));
  }

  /**
   * 搜索特定主题的词汇
   * @param topic 主题关键词
   * @param max 最大数量
   */
  async getWordsByTopic(topic: string, max = 50): Promise<Word[]> {
    const words = await this.datamuse.getWordsByTopic(topic, max);
    return words.map((w, i) => ({
      ...w,
      bookId: `online-${topic}`,
      id: `${topic}-${i}`,
    }));
  }

  /**
   * 查询单个单词详情
   */
  async lookupWord(word: string): Promise<Word | null> {
    return this.dictionary.lookupWord(word);
  }

  /**
   * 从文本导入词书（支持多种格式）
   * @param text 文本内容，每行一个单词或"单词\t释义"格式
   */
  importFromText(text: string, bookId: string): Word[] {
    const lines = text.split("\n").filter((line) => line.trim());
    const words: Word[] = [];

    lines.forEach((line, index) => {
      const parts = line.split(/\t|,/).map((p) => p.trim());
      if (parts.length >= 2) {
        // 有单词和释义
        words.push({
          id: `${bookId}-imported-${index}`,
          bookId,
          word: parts[0],
          phonetic: "",
          meaning: parts.slice(1).join(", "),
        });
      } else if (parts.length === 1 && parts[0]) {
        // 只有单词，需要查询释义
        words.push({
          id: `${bookId}-imported-${index}`,
          bookId,
          word: parts[0],
          phonetic: "",
          meaning: "待查询",
        });
      }
    });

    return words;
  }

  /**
   * 从 JSON 导入词书
   * @param json JSON 字符串
   */
  importFromJSON(json: string, bookId: string): Word[] {
    try {
      const data = JSON.parse(json);
      
      // 支持数组格式
      if (Array.isArray(data)) {
        return data.map((item, index) => ({
          id: item.id || `${bookId}-json-${index}`,
          bookId,
          word: item.word || item.english || "",
          phonetic: item.phonetic || item.pronunciation || "",
          meaning: item.meaning || item.chinese || item.definition || "",
          example: item.example || undefined,
        }));
      }

      // 支持对象格式 { words: [...] }
      if (data.words && Array.isArray(data.words)) {
        return data.words.map((item: any, index: number) => ({
          id: item.id || `${bookId}-json-${index}`,
          bookId,
          word: item.word || item.english || "",
          phonetic: item.phonetic || item.pronunciation || "",
          meaning: item.meaning || item.chinese || item.definition || "",
          example: item.example || undefined,
        }));
      }

      return [];
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return [];
    }
  }

  /**
   * 导出词书为 JSON
   * @param words 单词列表
   */
  exportToJSON(words: Word[]): string {
    return JSON.stringify(
      {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        wordCount: words.length,
        words: words.map(({ id, word, phonetic, meaning, example }) => ({
          id,
          word,
          phonetic,
          meaning,
          example,
        })),
      },
      null,
      2
    );
  }

  /**
   * 自动补全单词释义（批量查询）
   * @param words 需要补全的单词列表
   */
  async enrichWords(words: Word[]): Promise<Word[]> {
    const needsEnrichment = words.filter((w) => w.meaning === "待查询");
    
    if (needsEnrichment.length === 0) {
      return words;
    }

    const enriched = await this.dictionary.lookupWords(
      needsEnrichment.map((w) => w.word)
    );

    const enrichedMap = new Map(enriched.map((w) => [w.word, w]));

    return words.map((w) => {
      if (w.meaning === "待查询") {
        const enriched = enrichedMap.get(w.word);
        if (enriched) {
          return {
            ...w,
            phonetic: enriched.phonetic || w.phonetic,
            meaning: enriched.meaning,
            example: enriched.example,
          };
        }
      }
      return w;
    });
  }
}

// 单例导出
export const onlineWordbookService = new OnlineWordbookService();
