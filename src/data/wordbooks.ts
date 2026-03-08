import type { Word, WordBook } from "@/lib/types";
import rawCET4 from "./cet4-words.json";

// ============================================================
// 本地词书数据
// ============================================================

// CET-4 词书
export const CET4_BOOK_ID = "cet4-builtin";
export const CET4_BOOK: WordBook = {
  id: CET4_BOOK_ID,
  name: "CET-4 核心词汇",
  description: "大学英语四级核心高频词汇，约727词",
  isBuiltin: true,
  wordCount: rawCET4.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "cet",
};

export const CET4_WORDS: Word[] = rawCET4.map((w) => ({
  ...w,
  bookId: CET4_BOOK_ID,
}));

// CET-6 词书数据（核心词汇）
const rawCET6 = [
  { "id": "c6-001", "word": "abbreviate", "phonetic": "/əˈbriːvieɪt/", "meaning": "缩写；缩短" },
  { "id": "c6-002", "word": "abnormal", "phonetic": "/æbˈnɔːrml/", "meaning": "反常的；不规则的" },
  { "id": "c6-003", "word": "abolish", "phonetic": "/əˈbɑːlɪʃ/", "meaning": "废除；废止" },
  { "id": "c6-004", "word": "abrupt", "phonetic": "/əˈbrʌpt/", "meaning": "突然的；唐突的" },
  { "id": "c6-005", "word": "absolute", "phonetic": "/ˈæbsəluːt/", "meaning": "绝对的；完全的" },
  { "id": "c6-006", "word": "absurd", "phonetic": "/əbˈsɜːrd/", "meaning": "荒谬的；可笑的" },
  { "id": "c6-007", "word": "abundance", "phonetic": "/əˈbʌndəns/", "meaning": "丰富；充裕" },
  { "id": "c6-008", "word": "academy", "phonetic": "/əˈkædəmi/", "meaning": "学院；研究院" },
  { "id": "c6-009", "word": "accelerate", "phonetic": "/əkˈseləreɪt/", "meaning": "加速；促进" },
  { "id": "c6-010", "word": "accent", "phonetic": "/ˈæksent/", "meaning": "口音；重音" },
  { "id": "c6-011", "word": "accessory", "phonetic": "/əkˈsesəri/", "meaning": "附件；配件" },
  { "id": "c6-012", "word": "accommodate", "phonetic": "/əˈkɑːmədeɪt/", "meaning": "容纳；适应" },
  { "id": "c6-013", "word": "accompany", "phonetic": "/əˈkʌmpəni/", "meaning": "陪伴；伴随" },
  { "id": "c6-014", "word": "accordance", "phonetic": "/əˈkɔːrdns/", "meaning": "一致；按照" },
  { "id": "c6-015", "word": "accumulate", "phonetic": "/əˈkjuːmjəleɪt/", "meaning": "积累；积聚" },
  { "id": "c6-016", "word": "accuracy", "phonetic": "/ˈækjərəsi/", "meaning": "准确；精确度" },
  { "id": "c6-017", "word": "accuse", "phonetic": "/əˈkjuːz/", "meaning": "控告；指责" },
  { "id": "c6-018", "word": "accustomed", "phonetic": "/əˈkʌstəmd/", "meaning": "习惯的；通常的" },
  { "id": "c6-019", "word": "acid", "phonetic": "/ˈæsɪd/", "meaning": "酸；酸性的" },
  { "id": "c6-020", "word": "acquaintance", "phonetic": "/əˈkweɪntəns/", "meaning": "熟人；了解" },
  { "id": "c6-021", "word": "acquisition", "phonetic": "/ˌækwɪˈzɪʃn/", "meaning": "获得；收购" },
  { "id": "c6-022", "word": "activate", "phonetic": "/ˈæktɪveɪt/", "meaning": "激活；使活动" },
  { "id": "c6-023", "word": "acute", "phonetic": "/əˈkjuːt/", "meaning": "严重的；敏锐的" },
  { "id": "c6-024", "word": "adaptation", "phonetic": "/ˌædæpˈteɪʃn/", "meaning": "适应；改编本" },
  { "id": "c6-025", "word": "addict", "phonetic": "/ˈædɪkt/", "meaning": "上瘾者；入迷的人" },
  { "id": "c6-026", "word": "addition", "phonetic": "/əˈdɪʃn/", "meaning": "添加；加法" },
  { "id": "c6-027", "word": "adequacy", "phonetic": "/ˈædɪkwəsi/", "meaning": "足够；适当" },
  { "id": "c6-028", "word": "adjacent", "phonetic": "/əˈdʒeɪsnt/", "meaning": "邻近的；毗连的" },
  { "id": "c6-029", "word": "adjoin", "phonetic": "/əˈdʒɔɪn/", "meaning": "毗连；靠近" },
  { "id": "c6-030", "word": "administer", "phonetic": "/ədˈmɪnɪstər/", "meaning": "管理；执行" },
  { "id": "c6-031", "word": "adolescent", "phonetic": "/ˌædəˈlesnt/", "meaning": "青少年；青春期的" },
  { "id": "c6-032", "word": "adore", "phonetic": "/əˈdɔːr/", "meaning": "崇拜；爱慕" },
  { "id": "c6-033", "word": "advantageous", "phonetic": "/ˌædvənˈteɪdʒəs/", "meaning": "有利的；有益的" },
  { "id": "c6-034", "word": "adventure", "phonetic": "/ədˈventʃər/", "meaning": "冒险；奇遇" },
  { "id": "c6-035", "word": "adverse", "phonetic": "/ədˈvɜːrs/", "meaning": "不利的；相反的" },
  { "id": "c6-036", "word": "advocate", "phonetic": "/ˈædvəkeɪt/", "meaning": "提倡；拥护者" },
  { "id": "c6-037", "word": "aerial", "phonetic": "/ˈeriəl/", "meaning": "空中的；天线" },
  { "id": "c6-038", "word": "aesthetic", "phonetic": "/esˈθetɪk/", "meaning": "美学的；审美的" },
  { "id": "c6-039", "word": "affirm", "phonetic": "/əˈfɜːrm/", "meaning": "肯定；断言" },
  { "id": "c6-040", "word": "afflict", "phonetic": "/əˈflɪkt/", "meaning": "使痛苦；折磨" },
  { "id": "c6-041", "word": "agenda", "phonetic": "/əˈdʒendə/", "meaning": "议程；议事日程" },
  { "id": "c6-042", "word": "aggravate", "phonetic": "/ˈæɡrəveɪt/", "meaning": "加重；激怒" },
  { "id": "c6-043", "word": "aggregate", "phonetic": "/ˈæɡrɪɡət/", "meaning": "合计；总数" },
  { "id": "c6-044", "word": "agony", "phonetic": "/ˈæɡəni/", "meaning": "极度痛苦" },
  { "id": "c6-045", "word": "agreeable", "phonetic": "/əˈɡriːəbl/", "meaning": "愉快的；和蔼的" },
  { "id": "c6-046", "word": "air-conditioning", "phonetic": "/ˈer kəndɪʃənɪŋ/", "meaning": "空调" },
  { "id": "c6-047", "word": "aisle", "phonetic": "/aɪl/", "meaning": "过道；通道" },
  { "id": "c6-048", "word": "alarm", "phonetic": "/əˈlɑːrm/", "meaning": "警报；惊慌" },
  { "id": "c6-049", "word": "album", "phonetic": "/ˈælbəm/", "meaning": "相册；专辑" },
  { "id": "c6-050", "word": "alert", "phonetic": "/əˈlɜːrt/", "meaning": "警觉的；警报" },
];

export const CET6_BOOK_ID = "cet6-builtin";
export const CET6_BOOK: WordBook = {
  id: CET6_BOOK_ID,
  name: "CET-6 核心词汇",
  description: "大学英语六级核心高频词汇，约50词（示例）",
  isBuiltin: true,
  wordCount: rawCET6.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "cet",
};

export const CET6_WORDS: Word[] = rawCET6.map((w) => ({
  ...w,
  bookId: CET6_BOOK_ID,
}));

// 雅思核心词汇
const rawIELTS = [
  { "id": "ielts-001", "word": "abandon", "phonetic": "/əˈbændən/", "meaning": "放弃；抛弃" },
  { "id": "ielts-002", "word": "ability", "phonetic": "/əˈbɪləti/", "meaning": "能力；才能" },
  { "id": "ielts-003", "word": "absence", "phonetic": "/ˈæbsəns/", "meaning": "缺席；缺乏" },
  { "id": "ielts-004", "word": "absolute", "phonetic": "/ˈæbsəluːt/", "meaning": "绝对的；完全的" },
  { "id": "ielts-005", "word": "absorb", "phonetic": "/əbˈzɔːrb/", "meaning": "吸收；理解" },
  { "id": "ielts-006", "word": "abstract", "phonetic": "/ˈæbstrækt/", "meaning": "抽象的；摘要" },
  { "id": "ielts-007", "word": "abundant", "phonetic": "/əˈbʌndənt/", "meaning": "丰富的；大量的" },
  { "id": "ielts-008", "word": "academic", "phonetic": "/ˌækəˈdemɪk/", "meaning": "学术的；学院的" },
  { "id": "ielts-009", "word": "accelerate", "phonetic": "/əkˈseləreɪt/", "meaning": "加速；促进" },
  { "id": "ielts-010", "word": "access", "phonetic": "/ˈækses/", "meaning": "进入；使用权" },
  { "id": "ielts-011", "word": "accommodate", "phonetic": "/əˈkɒmədeɪt/", "meaning": "容纳；适应" },
  { "id": "ielts-012", "word": "accompany", "phonetic": "/əˈkʌmpəni/", "meaning": "陪伴；伴随" },
  { "id": "ielts-013", "word": "accomplish", "phonetic": "/əˈkʌmplɪʃ/", "meaning": "完成；实现" },
  { "id": "ielts-014", "word": "accord", "phonetic": "/əˈkɔːd/", "meaning": "一致；符合" },
  { "id": "ielts-015", "word": "account", "phonetic": "/əˈkaʊnt/", "meaning": "账户；解释" },
  { "id": "ielts-016", "word": "accumulate", "phonetic": "/əˈkjuːmjəleɪt/", "meaning": "积累；积聚" },
  { "id": "ielts-017", "word": "accurate", "phonetic": "/ˈækjərət/", "meaning": "精确的；准确的" },
  { "id": "ielts-018", "word": "accuse", "phonetic": "/əˈkjuːz/", "meaning": "控告；指责" },
  { "id": "ielts-019", "word": "achieve", "phonetic": "/əˈtʃiːv/", "meaning": "达到；完成" },
  { "id": "ielts-020", "word": "acknowledge", "phonetic": "/əkˈnɒlɪdʒ/", "meaning": "承认；致谢" },
  { "id": "ielts-021", "word": "acquire", "phonetic": "/əˈkwaɪə(r)/", "meaning": "获得；学到" },
  { "id": "ielts-022", "word": "adapt", "phonetic": "/əˈdæpt/", "meaning": "适应；改编" },
  { "id": "ielts-023", "word": "adequate", "phonetic": "/ˈædɪkwət/", "meaning": "足够的；适当的" },
  { "id": "ielts-024", "word": "adjust", "phonetic": "/əˈdʒʌst/", "meaning": "调整；适应" },
  { "id": "ielts-025", "word": "administration", "phonetic": "/ədˌmɪnɪˈstreɪʃn/", "meaning": "管理；行政" },
  { "id": "ielts-026", "word": "admire", "phonetic": "/ədˈmaɪə(r)/", "meaning": "钦佩；赞赏" },
  { "id": "ielts-027", "word": "admit", "phonetic": "/ədˈmɪt/", "meaning": "承认；准许进入" },
  { "id": "ielts-028", "word": "adopt", "phonetic": "/əˈdɒpt/", "meaning": "采用；收养" },
  { "id": "ielts-029", "word": "advance", "phonetic": "/ədˈvɑːns/", "meaning": "前进；提前" },
  { "id": "ielts-030", "word": "advantage", "phonetic": "/ədˈvɑːntɪdʒ/", "meaning": "优势；有利条件" },
];

export const IELTS_BOOK_ID = "ielts-builtin";
export const IELTS_BOOK: WordBook = {
  id: IELTS_BOOK_ID,
  name: "雅思核心词汇",
  description: "雅思考试核心高频词汇，约30词（示例）",
  isBuiltin: true,
  wordCount: rawIELTS.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "ielts",
};

export const IELTS_WORDS: Word[] = rawIELTS.map((w) => ({
  ...w,
  bookId: IELTS_BOOK_ID,
}));

// 托福核心词汇
const rawTOEFL = [
  { "id": "toefl-001", "word": "abandon", "phonetic": "/əˈbændən/", "meaning": "放弃；抛弃" },
  { "id": "toefl-002", "word": "abide", "phonetic": "/əˈbaɪd/", "meaning": "遵守；忍受" },
  { "id": "toefl-003", "word": "abnormal", "phonetic": "/æbˈnɔːrml/", "meaning": "反常的；不规则的" },
  { "id": "toefl-004", "word": "abolish", "phonetic": "/əˈbɑːlɪʃ/", "meaning": "废除；废止" },
  { "id": "toefl-005", "word": "abound", "phonetic": "/əˈbaʊnd/", "meaning": "大量存在；充满" },
  { "id": "toefl-006", "word": "abroad", "phonetic": "/əˈbrɔːd/", "meaning": "在国外；到国外" },
  { "id": "toefl-007", "word": "abrupt", "phonetic": "/əˈbrʌpt/", "meaning": "突然的；唐突的" },
  { "id": "toefl-008", "word": "absence", "phonetic": "/ˈæbsəns/", "meaning": "缺席；缺乏" },
  { "id": "toefl-009", "word": "absolute", "phonetic": "/ˈæbsəluːt/", "meaning": "绝对的；完全的" },
  { "id": "toefl-010", "word": "absorb", "phonetic": "/əbˈzɔːrb/", "meaning": "吸收；理解" },
  { "id": "toefl-011", "word": "abstract", "phonetic": "/ˈæbstrækt/", "meaning": "抽象的；摘要" },
  { "id": "toefl-012", "word": "absurd", "phonetic": "/əbˈsɜːrd/", "meaning": "荒谬的；可笑的" },
  { "id": "toefl-013", "word": "abundance", "phonetic": "/əˈbʌndəns/", "meaning": "丰富；充裕" },
  { "id": "toefl-014", "word": "abundant", "phonetic": "/əˈbʌndənt/", "meaning": "丰富的；大量的" },
  { "id": "toefl-015", "word": "abuse", "phonetic": "/əˈbjuːs/", "meaning": "滥用；虐待" },
  { "id": "toefl-016", "word": "academic", "phonetic": "/ˌækəˈdemɪk/", "meaning": "学术的；学院的" },
  { "id": "toefl-017", "word": "academy", "phonetic": "/əˈkædəmi/", "meaning": "学院；研究院" },
  { "id": "toefl-018", "word": "accelerate", "phonetic": "/əkˈseləreɪt/", "meaning": "加速；促进" },
  { "id": "toefl-019", "word": "accent", "phonetic": "/ˈæksent/", "meaning": "口音；重音" },
  { "id": "toefl-020", "word": "accept", "phonetic": "/əkˈsept/", "meaning": "接受；同意" },
];

export const TOEFL_BOOK_ID = "toefl-builtin";
export const TOEFL_BOOK: WordBook = {
  id: TOEFL_BOOK_ID,
  name: "托福核心词汇",
  description: "托福考试核心高频词汇，约20词（示例）",
  isBuiltin: true,
  wordCount: rawTOEFL.length,
  createdAt: "2024-01-01T00:00:00Z",
  category: "toefl",
};

export const TOEFL_WORDS: Word[] = rawTOEFL.map((w) => ({
  ...w,
  bookId: TOEFL_BOOK_ID,
}));

// ============================================================
// 网络词书配置
// ============================================================

export interface OnlineWordbookConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  fetcher: () => Promise<Word[]>;
}

// 网络词书源配置
export const ONLINE_BOOKS: OnlineWordbookConfig[] = [
  {
    id: "online-gre",
    name: "GRE 高频词汇",
    description: "GRE考试学术高频词汇",
    category: "gre",
    icon: "🎓",
    fetcher: async () => {
      const { onlineWordbookService } = await import("@/lib/api/dictionary");
      return onlineWordbookService.getGREWords();
    },
  },
  {
    id: "online-business",
    name: "商务英语词汇",
    description: "职场商务英语核心词汇",
    category: "business",
    icon: "💼",
    fetcher: async () => {
      const { onlineWordbookService } = await import("@/lib/api/dictionary");
      return onlineWordbookService.getBusinessWords();
    },
  },
  {
    id: "online-tech",
    name: "IT技术词汇",
    description: "计算机和IT行业专业词汇",
    category: "tech",
    icon: "💻",
    fetcher: async () => {
      const { onlineWordbookService } = await import("@/lib/api/dictionary");
      return onlineWordbookService.getTechWords();
    },
  },
  {
    id: "online-daily",
    name: "日常高频词汇",
    description: "日常生活最常用的高频词汇",
    category: "daily",
    icon: "🗣️",
    fetcher: async () => {
      const { onlineWordbookService } = await import("@/lib/api/dictionary");
      return onlineWordbookService.getDailyWords();
    },
  },
];

// ============================================================
// 词书管理器
// ============================================================

export class WordBookManager {
  private books: Map<string, WordBook> = new Map();
  private words: Map<string, Word[]> = new Map();
  private onlineCache: Map<string, { words: Word[]; timestamp: number }> = new Map();
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24小时缓存

  constructor() {
    // 注册本地词书
    this.registerBook(CET4_BOOK, CET4_WORDS);
    this.registerBook(CET6_BOOK, CET6_WORDS);
    this.registerBook(IELTS_BOOK, IELTS_WORDS);
    this.registerBook(TOEFL_BOOK, TOEFL_WORDS);
  }

  registerBook(book: WordBook, words: Word[]) {
    this.books.set(book.id, book);
    this.words.set(book.id, words);
  }

  getAllBooks(): WordBook[] {
    // 返回本地词书 + 网络词书配置
    const localBooks = Array.from(this.books.values());
    const onlineBooks: WordBook[] = ONLINE_BOOKS.map((config) => ({
      id: config.id,
      name: config.name,
      description: config.description,
      isBuiltin: false,
      isOnline: true,
      wordCount: 0, // 网络词书数量动态获取
      createdAt: "2024-01-01T00:00:00Z",
      category: config.category,
    }));
    return [...localBooks, ...onlineBooks];
  }

  getBook(id: string): WordBook | undefined {
    // 先查本地
    const localBook = this.books.get(id);
    if (localBook) return localBook;

    // 再查网络词书配置
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
    // 先查本地
    const localWords = this.words.get(bookId);
    if (localWords) return localWords;

    // 查网络词书缓存
    const cached = this.onlineCache.get(bookId);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.words;
    }

    // 获取网络词书
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

  getOnlineBookConfig(bookId: string): OnlineWordbookConfig | undefined {
    return ONLINE_BOOKS.find((c) => c.id === bookId);
  }
}

// 单例实例
export const wordBookManager = new WordBookManager();
