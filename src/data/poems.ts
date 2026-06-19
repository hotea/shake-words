// ============================================================
// 诗词数据 — 数据来源：chinese-poetry (GitHub, 公有领域)
// 精选唐宋经典，适合四向拼图玩法（4-8 句为宜）
// ============================================================

export interface Poem {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  /** 每句一行，不含标点 */
  lines: string[];
  /** 标点版本，用于完成时展示 */
  linesPunctuated: string[];
}

export const POEMS: Poem[] = [
  {
    id: "libai-jingyesi",
    title: "静夜思",
    author: "李白",
    dynasty: "唐",
    lines: ["床前明月光", "疑是地上霜", "举头望明月", "低头思故乡"],
    linesPunctuated: ["床前明月光，", "疑是地上霜。", "举头望明月，", "低头思故乡。"],
  },
  {
    id: "menghaoran-chunxiao",
    title: "春晓",
    author: "孟浩然",
    dynasty: "唐",
    lines: ["春眠不觉晓", "处处闻啼鸟", "夜来风雨声", "花落知多少"],
    linesPunctuated: ["春眠不觉晓，", "处处闻啼鸟。", "夜来风雨声，", "花落知多少。"],
  },
  {
    id: "wangzhihuan-dengguanquelou",
    title: "登鹳雀楼",
    author: "王之涣",
    dynasty: "唐",
    lines: ["白日依山尽", "黄河入海流", "欲穷千里目", "更上一层楼"],
    linesPunctuated: ["白日依山尽，", "黄河入海流。", "欲穷千里目，", "更上一层楼。"],
  },
  {
    id: "liuzongyuan-jiangxue",
    title: "江雪",
    author: "柳宗元",
    dynasty: "唐",
    lines: ["千山鸟飞绝", "万径人踪灭", "孤舟蓑笠翁", "独钓寒江雪"],
    linesPunctuated: ["千山鸟飞绝，", "万径人踪灭。", "孤舟蓑笠翁，", "独钓寒江雪。"],
  },
  {
    id: "wangwei-luzhai",
    title: "鹿柴",
    author: "王维",
    dynasty: "唐",
    lines: ["空山不见人", "但闻人语响", "返景入深林", "复照青苔上"],
    linesPunctuated: ["空山不见人，", "但闻人语响。", "返景入深林，", "复照青苔上。"],
  },
  {
    id: "libai-wanglushanpubu",
    title: "望庐山瀑布",
    author: "李白",
    dynasty: "唐",
    lines: ["日照香炉生紫烟", "遥看瀑布挂前川", "飞流直下三千尺", "疑是银河落九天"],
    linesPunctuated: ["日照香炉生紫烟，", "遥看瀑布挂前川。", "飞流直下三千尺，", "疑是银河落九天。"],
  },
  {
    id: "dumou-shanxing",
    title: "山行",
    author: "杜牧",
    dynasty: "唐",
    lines: ["远上寒山石径斜", "白云生处有人家", "停车坐爱枫林晚", "霜叶红于二月花"],
    linesPunctuated: ["远上寒山石径斜，", "白云生处有人家。", "停车坐爱枫林晚，", "霜叶红于二月花。"],
  },
  {
    id: "libai-zaoefabaicheng",
    title: "早发白帝城",
    author: "李白",
    dynasty: "唐",
    lines: ["朝辞白帝彩云间", "千里江陵一日还", "两岸猿声啼不住", "轻舟已过万重山"],
    linesPunctuated: ["朝辞白帝彩云间，", "千里江陵一日还。", "两岸猿声啼不住，", "轻舟已过万重山。"],
  },
  {
    id: "wangwei-xiangsi",
    title: "相思",
    author: "王维",
    dynasty: "唐",
    lines: ["红豆生南国", "春来发几枝", "愿君多采撷", "此物最相思"],
    linesPunctuated: ["红豆生南国，", "春来发几枝。", "愿君多采撷，", "此物最相思。"],
  },
  {
    id: "liuyuxi-wuyi",
    title: "乌衣巷",
    author: "刘禹锡",
    dynasty: "唐",
    lines: ["朱雀桥边野草花", "乌衣巷口夕阳斜", "旧时王谢堂前燕", "飞入寻常百姓家"],
    linesPunctuated: ["朱雀桥边野草花，", "乌衣巷口夕阳斜。", "旧时王谢堂前燕，", "飞入寻常百姓家。"],
  },
  {
    id: "dumu-qingming",
    title: "清明",
    author: "杜牧",
    dynasty: "唐",
    lines: ["清明时节雨纷纷", "路上行人欲断魂", "借问酒家何处有", "牧童遥指杏花村"],
    linesPunctuated: ["清明时节雨纷纷，", "路上行人欲断魂。", "借问酒家何处有，", "牧童遥指杏花村。"],
  },
  {
    id: "hezhizhang-huixiangoushu",
    title: "回乡偶书",
    author: "贺知章",
    dynasty: "唐",
    lines: ["少小离家老大回", "乡音无改鬓毛衰", "儿童相见不相识", "笑问客从何处来"],
    linesPunctuated: ["少小离家老大回，", "乡音无改鬓毛衰。", "儿童相见不相识，", "笑问客从何处来。"],
  },
  {
    id: "wanganchi-yuanshang",
    title: "元日",
    author: "王安石",
    dynasty: "宋",
    lines: ["爆竹声中一岁除", "春风送暖入屠苏", "千门万户曈曈日", "总把新桃换旧符"],
    linesPunctuated: ["爆竹声中一岁除，", "春风送暖入屠苏。", "千门万户曈曈日，", "总把新桃换旧符。"],
  },
  {
    id: "sushi-yinjiuchucheng",
    title: "饮湖上初晴后雨",
    author: "苏轼",
    dynasty: "宋",
    lines: ["水光潋滟晴方好", "山色空蒙雨亦奇", "欲把西湖比西子", "淡妆浓抹总相宜"],
    linesPunctuated: ["水光潋滟晴方好，", "山色空蒙雨亦奇。", "欲把西湖比西子，", "淡妆浓抹总相宜。"],
  },
  {
    id: "luyou-shier",
    title: "示儿",
    author: "陆游",
    dynasty: "宋",
    lines: ["死去元知万事空", "但悲不见九州同", "王师北定中原日", "家祭无忘告乃翁"],
    linesPunctuated: ["死去元知万事空，", "但悲不见九州同。", "王师北定中原日，", "家祭无忘告乃翁。"],
  },
  {
    id: "libai-yuexiaduzhuo",
    title: "月下独酌",
    author: "李白",
    dynasty: "唐",
    lines: ["花间一壶酒", "独酌无相亲", "举杯邀明月", "对影成三人"],
    linesPunctuated: ["花间一壶酒，", "独酌无相亲。", "举杯邀明月，", "对影成三人。"],
  },
  {
    id: "mengjiao-youzinyin",
    title: "游子吟",
    author: "孟郊",
    dynasty: "唐",
    lines: ["慈母手中线", "游子身上衣", "临行密密缝", "意恐迟迟归", "谁言寸草心", "报得三春晖"],
    linesPunctuated: ["慈母手中线，", "游子身上衣。", "临行密密缝，", "意恐迟迟归。", "谁言寸草心，", "报得三春晖。"],
  },
  {
    id: "baijuyi-fudegucayuanbie",
    title: "赋得古原草送别",
    author: "白居易",
    dynasty: "唐",
    lines: ["离离原上草", "一岁一枯荣", "野火烧不尽", "春风吹又生"],
    linesPunctuated: ["离离原上草，", "一岁一枯荣。", "野火烧不尽，", "春风吹又生。"],
  },
  {
    id: "libai-chunsi",
    title: "春思",
    author: "李白",
    dynasty: "唐",
    lines: ["燕草如碧丝", "秦桑低绿枝", "当君怀归日", "是妾断肠时"],
    linesPunctuated: ["燕草如碧丝，", "秦桑低绿枝。", "当君怀归日，", "是妾断肠时。"],
  },
  {
    id: "liuzongyuan-shijiangxue",
    title: "渔翁",
    author: "柳宗元",
    dynasty: "唐",
    lines: ["渔翁夜傍西岩宿", "晓汲清湘燃楚竹", "烟销日出不见人", "欸乃一声山水绿"],
    linesPunctuated: ["渔翁夜傍西岩宿，", "晓汲清湘燃楚竹。", "烟销日出不见人，", "欸乃一声山水绿。"],
  },
];

/** 随机取一首诗 */
export function getRandomPoem(excludeIds: string[] = []): Poem {
  const available = POEMS.filter((p) => !excludeIds.includes(p.id));
  const pool = available.length > 0 ? available : POEMS;
  return pool[Math.floor(Math.random() * pool.length)];
}
