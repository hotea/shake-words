import type { Word } from "@/lib/types";

/**
 * CET-4 core vocabulary (50 words for MVP).
 * In production this would be a much larger dataset loaded from a JSON file or API.
 */
export const CET4_BOOK_ID = "cet4-builtin";

export const CET4_BOOK = {
  id: CET4_BOOK_ID,
  name: "CET-4 核心词汇",
  description: "大学英语四级核心高频词汇",
  isBuiltin: true,
  wordCount: 50,
  createdAt: "2024-01-01T00:00:00Z",
};

export const CET4_WORDS: Word[] = [
  { id: "w001", bookId: CET4_BOOK_ID, word: "abandon", phonetic: "/əˈbændən/", meaning: "放弃；遗弃" },
  { id: "w002", bookId: CET4_BOOK_ID, word: "ability", phonetic: "/əˈbɪlɪti/", meaning: "能力；才能" },
  { id: "w003", bookId: CET4_BOOK_ID, word: "absorb", phonetic: "/əbˈzɔːrb/", meaning: "吸收；吸引" },
  { id: "w004", bookId: CET4_BOOK_ID, word: "abstract", phonetic: "/ˈæbstrækt/", meaning: "抽象的；摘要" },
  { id: "w005", bookId: CET4_BOOK_ID, word: "abundant", phonetic: "/əˈbʌndənt/", meaning: "丰富的；充裕的" },
  { id: "w006", bookId: CET4_BOOK_ID, word: "access", phonetic: "/ˈækses/", meaning: "接近；通道；访问" },
  { id: "w007", bookId: CET4_BOOK_ID, word: "accomplish", phonetic: "/əˈkɑːmplɪʃ/", meaning: "完成；实现" },
  { id: "w008", bookId: CET4_BOOK_ID, word: "accurate", phonetic: "/ˈækjərət/", meaning: "精确的；准确的" },
  { id: "w009", bookId: CET4_BOOK_ID, word: "achieve", phonetic: "/əˈtʃiːv/", meaning: "达到；取得" },
  { id: "w010", bookId: CET4_BOOK_ID, word: "acknowledge", phonetic: "/əkˈnɑːlɪdʒ/", meaning: "承认；感谢" },
  { id: "w011", bookId: CET4_BOOK_ID, word: "acquire", phonetic: "/əˈkwaɪər/", meaning: "获得；学到" },
  { id: "w012", bookId: CET4_BOOK_ID, word: "adapt", phonetic: "/əˈdæpt/", meaning: "适应；改编" },
  { id: "w013", bookId: CET4_BOOK_ID, word: "adequate", phonetic: "/ˈædɪkwət/", meaning: "充足的；适当的" },
  { id: "w014", bookId: CET4_BOOK_ID, word: "adjust", phonetic: "/əˈdʒʌst/", meaning: "调整；适应" },
  { id: "w015", bookId: CET4_BOOK_ID, word: "admire", phonetic: "/ədˈmaɪər/", meaning: "钦佩；赞美" },
  { id: "w016", bookId: CET4_BOOK_ID, word: "adopt", phonetic: "/əˈdɑːpt/", meaning: "采用；收养" },
  { id: "w017", bookId: CET4_BOOK_ID, word: "advance", phonetic: "/ədˈvæns/", meaning: "前进；提前" },
  { id: "w018", bookId: CET4_BOOK_ID, word: "advantage", phonetic: "/ədˈvæntɪdʒ/", meaning: "优势；有利条件" },
  { id: "w019", bookId: CET4_BOOK_ID, word: "afford", phonetic: "/əˈfɔːrd/", meaning: "负担得起；提供" },
  { id: "w020", bookId: CET4_BOOK_ID, word: "aggressive", phonetic: "/əˈɡresɪv/", meaning: "侵略的；激进的" },
  { id: "w021", bookId: CET4_BOOK_ID, word: "alternative", phonetic: "/ɔːlˈtɜːrnətɪv/", meaning: "替代的；选择" },
  { id: "w022", bookId: CET4_BOOK_ID, word: "ambition", phonetic: "/æmˈbɪʃn/", meaning: "雄心；抱负" },
  { id: "w023", bookId: CET4_BOOK_ID, word: "analyze", phonetic: "/ˈænəlaɪz/", meaning: "分析；解析" },
  { id: "w024", bookId: CET4_BOOK_ID, word: "announce", phonetic: "/əˈnaʊns/", meaning: "宣布；通知" },
  { id: "w025", bookId: CET4_BOOK_ID, word: "annual", phonetic: "/ˈænjuəl/", meaning: "年度的；每年的" },
  { id: "w026", bookId: CET4_BOOK_ID, word: "anticipate", phonetic: "/ænˈtɪsɪpeɪt/", meaning: "预期；期望" },
  { id: "w027", bookId: CET4_BOOK_ID, word: "apparent", phonetic: "/əˈpærənt/", meaning: "明显的；表面的" },
  { id: "w028", bookId: CET4_BOOK_ID, word: "appeal", phonetic: "/əˈpiːl/", meaning: "呼吁；吸引力" },
  { id: "w029", bookId: CET4_BOOK_ID, word: "apply", phonetic: "/əˈplaɪ/", meaning: "申请；应用" },
  { id: "w030", bookId: CET4_BOOK_ID, word: "appreciate", phonetic: "/əˈpriːʃieɪt/", meaning: "感激；欣赏" },
  { id: "w031", bookId: CET4_BOOK_ID, word: "approach", phonetic: "/əˈproʊtʃ/", meaning: "接近；方法" },
  { id: "w032", bookId: CET4_BOOK_ID, word: "appropriate", phonetic: "/əˈproʊpriət/", meaning: "适当的；合适的" },
  { id: "w033", bookId: CET4_BOOK_ID, word: "approve", phonetic: "/əˈpruːv/", meaning: "批准；赞成" },
  { id: "w034", bookId: CET4_BOOK_ID, word: "arise", phonetic: "/əˈraɪz/", meaning: "出现；产生" },
  { id: "w035", bookId: CET4_BOOK_ID, word: "arrange", phonetic: "/əˈreɪndʒ/", meaning: "安排；整理" },
  { id: "w036", bookId: CET4_BOOK_ID, word: "assert", phonetic: "/əˈsɜːrt/", meaning: "断言；主张" },
  { id: "w037", bookId: CET4_BOOK_ID, word: "assess", phonetic: "/əˈses/", meaning: "评估；估价" },
  { id: "w038", bookId: CET4_BOOK_ID, word: "assign", phonetic: "/əˈsaɪn/", meaning: "分配；指派" },
  { id: "w039", bookId: CET4_BOOK_ID, word: "assist", phonetic: "/əˈsɪst/", meaning: "帮助；协助" },
  { id: "w040", bookId: CET4_BOOK_ID, word: "associate", phonetic: "/əˈsoʊʃieɪt/", meaning: "联系；关联" },
  { id: "w041", bookId: CET4_BOOK_ID, word: "assume", phonetic: "/əˈsuːm/", meaning: "假定；承担" },
  { id: "w042", bookId: CET4_BOOK_ID, word: "attach", phonetic: "/əˈtætʃ/", meaning: "附上；依恋" },
  { id: "w043", bookId: CET4_BOOK_ID, word: "attain", phonetic: "/əˈteɪn/", meaning: "达到；获得" },
  { id: "w044", bookId: CET4_BOOK_ID, word: "attempt", phonetic: "/əˈtempt/", meaning: "尝试；企图" },
  { id: "w045", bookId: CET4_BOOK_ID, word: "attract", phonetic: "/əˈtrækt/", meaning: "吸引；引起" },
  { id: "w046", bookId: CET4_BOOK_ID, word: "attribute", phonetic: "/əˈtrɪbjuːt/", meaning: "属性；归因于" },
  { id: "w047", bookId: CET4_BOOK_ID, word: "authority", phonetic: "/əˈθɔːrəti/", meaning: "权威；当局" },
  { id: "w048", bookId: CET4_BOOK_ID, word: "available", phonetic: "/əˈveɪləbl/", meaning: "可用的；有空的" },
  { id: "w049", bookId: CET4_BOOK_ID, word: "awareness", phonetic: "/əˈwernəs/", meaning: "意识；认识" },
  { id: "w050", bookId: CET4_BOOK_ID, word: "balance", phonetic: "/ˈbæləns/", meaning: "平衡；余额" },
];
