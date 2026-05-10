import Link from "next/link";
import { AuthHeader } from "@/components/AuthHeader";
import { AppLogo } from "@/components/AppLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShakeWords - 晃晃背单词 | 边学单词边放松颈椎",
  description: "创新的英语单词学习应用，通过摄像头识别头部动作（点头、摇头、转头）来选择单词释义。边背单词边活动颈椎，缓解久坐疲劳，让学习更健康有趣。",
  keywords: ["背单词", "英语学习", "颈椎放松", "头部运动", "健康学习", "CET4", "CET6", "GRE", "雅思", "托福"],
  openGraph: {
    title: "ShakeWords - 晃晃背单词",
    description: "边背单词边活动颈椎，让学习更健康有趣",
    url: "https://shakewords.wyld.cc",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* 背景装饰 — 温暖柔和的渐变光晕 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[var(--color-accent-light)]/[0.04] blur-[100px]" />
      </div>

      {/* 顶部导航 */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 z-20">
        <div className="flex items-center gap-3">
          <AppLogo />
          <span className="font-semibold text-[var(--color-foreground)] text-lg tracking-tight">ShakeWords</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/books" className="btn-ghost">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.967 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="hidden sm:inline">词书</span>
          </Link>
          <Link href="/stats" className="btn-ghost">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <span className="hidden sm:inline">统计</span>
          </Link>
          <Link href="/settings" className="btn-ghost">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.212 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">设置</span>
          </Link>
          <div className="w-px h-5 bg-[var(--color-border)] mx-1 hidden sm:block" />
          <AuthHeader />
        </div>
      </nav>

      {/* Hero 区域 */}
      <div className="text-center mb-16 max-w-2xl animate-fade-in z-10">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: "var(--font-heading)" }}>
          晃晃背单词
        </h1>
        <p className="text-xl sm:text-2xl text-[var(--color-primary)] font-medium mb-8 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          学习时放松颈椎
        </p>
        <p className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed max-w-md mx-auto">
          通过头部动作选择单词释义，边学单词边活动颈椎。
          支持多种词书，让学习更轻松有趣。
        </p>
      </div>

      {/* CTA 按钮 */}
      <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up stagger-2 z-10 mb-20">
        <Link href="/books" className="btn-primary text-lg px-10 py-4 rounded-[var(--radius-md)] shadow-lg hover:shadow-xl transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.967 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          选择词书
        </Link>
        <Link href="/quiz" className="btn-secondary px-8 py-4 rounded-[var(--radius-md)] text-base">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
          快速体验
        </Link>
      </div>

      {/* SEO 内容区域 */}
      <section className="max-w-4xl mx-auto px-6 py-16 z-10">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[var(--color-foreground)]">边学单词边放松颈椎</h2>
            <p className="text-[var(--color-muted)] leading-relaxed mb-4">
              ShakeWords 是一款创新的英语单词学习应用，通过摄像头识别头部动作，让你在背单词的同时活动颈椎，缓解久坐带来的颈部疲劳。
            </p>
            <p className="text-[var(--color-muted)] leading-relaxed">
              向左转头选择左侧答案，向右转头选择右侧答案，点头确认。简单的动作让学习过程更加生动有趣，同时保护你的颈椎健康。
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[var(--color-foreground)]">丰富的词书资源</h2>
            <ul className="space-y-2 text-[var(--color-muted)]">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                CET-4 大学英语四级词汇
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                CET-6 大学英语六级词汇
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                GRE 美国研究生入学考试词汇
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                雅思 IELTS 词汇
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                托福 TOEFL 词汇
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                BEC 商务英语词汇
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-foreground)]">健康学习，从 ShakeWords 开始</h2>
          <p className="text-[var(--color-muted)] max-w-2xl mx-auto">
            长时间伏案工作学习容易导致颈椎问题。ShakeWords 将英语学习与颈部运动相结合，
            让你在记忆单词的同时，通过自然的头部转动活动颈椎，预防久坐带来的健康隐患。
          </p>
        </div>
      </section>
    </main>
  );
}
