import Link from "next/link";
import type { Metadata } from "next";
import { AuthHeader } from "@/components/AuthHeader";

export const metadata: Metadata = {
  title: "晃晃学 · ShakeWords | 摇头学词诵诗",
  description:
    "AI 视觉识别头部动作，边背单词边活动颈椎。支持英语词书与古诗古文，兼顾学习与文化传承。",
};

const features = [
  { icon: "視", title: "AI 视觉交互", desc: "头部动作实时识别，抬头点头即选答案", accent: "gold" },
  { icon: "頸", title: "颈椎友好", desc: "答题即颈部运动，学习中自然放松", accent: "bamboo" },
  { icon: "詩", title: "双内容体系", desc: "英语词书 + 古诗古文，同一动作两种收获", accent: "jade" },
  { icon: "憶", title: "间隔重复", desc: "SM-2 算法调度，在遗忘临界点复习", accent: "gold" },
  { icon: "計", title: "学习追踪", desc: "正确率、连续记录，量化每次进步", accent: "bamboo" },
  { icon: "隱", title: "隐私至上", desc: "本地识别不上传，进度可随时导出删除", accent: "jade" },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[var(--color-background)]">
      {/* ===== 导航栏 ===== */}
      <header className="w-full border-b border-[var(--color-border)] bg-[var(--color-ink-900)]/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex flex-col leading-tight">
              <span
                className="text-xl text-[var(--color-rice)] tracking-[0.3em] group-hover:text-[var(--color-bamboo)] transition-colors"
                style={{ fontFamily: "var(--font-brand)" }}
              >
                晃晃学
              </span>
              <span
                className="text-[10px] text-[var(--color-muted)] tracking-[0.2em] uppercase italic"
                style={{ fontFamily: "var(--font-en)" }}
              >
                Shake · Words
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {[
              { label: "背单词", href: "/quiz" },
              { label: "拼诗词", href: "/poetry" },
              { label: "统计", href: "/stats" },
              { label: "设置", href: "/settings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[var(--color-muted)] hover:text-[var(--color-bamboo-bright)] transition-colors tracking-[0.25em]"
              >
                {item.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-[var(--color-border)]" />
            <Link
              href="/quiz"
              className="text-sm text-[var(--color-rice)] hover:text-[var(--color-bamboo-bright)] transition-colors tracking-[0.2em]"
            >
              背单词 →
            </Link>
            <Link
              href="/poetry"
              className="text-sm text-[var(--color-rice)] hover:text-[var(--color-bamboo-bright)] transition-colors tracking-[0.2em]"
            >
              拼诗词 →
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <AuthHeader />
            </div>
            <div className="md:hidden">
              <AuthHeader />
            </div>
            <Link href="/quiz" className="btn-primary btn-sm md:hidden">
              开始体验
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <main className="flex-1 w-full relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 900px 600px at 15% 20%, rgba(106, 170, 138, 0.10), transparent 55%), radial-gradient(ellipse 800px 600px at 85% 80%, rgba(184, 164, 114, 0.08), transparent 55%), radial-gradient(ellipse 600px 500px at 50% 50%, rgba(106, 170, 138, 0.04), transparent 60%)",
          }}
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
          {/* 顶部小标签 */}
          <div
            className="flex items-center justify-center gap-4 mb-10 animate-fade-in"
            style={{ animationDelay: "0.05s", animationFillMode: "both" }}
          >
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-bamboo)] opacity-60" />
            <span
              className="text-xs tracking-[0.4em] text-[var(--color-bamboo)] uppercase"
              style={{ fontFamily: "var(--font-en)" }}
            >
              AI · Vision · Interaction
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--color-bamboo)] opacity-60" />
          </div>

          {/* 主标题 */}
          <h1
            className="text-center text-[var(--color-rice)] leading-[0.95] mb-8 animate-fade-in"
            style={{
              fontFamily: "var(--font-brand)",
              fontSize: "clamp(64px, 13vw, 180px)",
              letterSpacing: "0.05em",
              animationDelay: "0.1s",
              animationFillMode: "both",
            }}
          >
            晃晃学
            <span
              className="block text-[var(--color-bamboo-bright)] mt-4 font-normal"
              style={{
                fontFamily: "var(--font-en)",
                fontSize: "clamp(18px, 2.8vw, 42px)",
                letterSpacing: "0.1em",
                opacity: 0.85,
              }}
            >
              Learn · by · Shaking · Your · Head
            </span>
          </h1>

          {/* 副标题 */}
          <p
            className="max-w-2xl mx-auto text-center text-[var(--color-rice-muted)] leading-relaxed mb-12 animate-fade-in"
            style={{
              fontSize: "clamp(16px, 1.6vw, 19px)",
              animationDelay: "0.25s",
              animationFillMode: "both",
            }}
          >
            用摄像头识别头部动作，抬头点头转头即选择答案。
            <br className="hidden md:block" />
            边背单词边活动颈椎，边摇头边温习经典。
          </p>

          {/* CTA 按钮 */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in"
            style={{ animationDelay: "0.35s", animationFillMode: "both" }}
          >
            <Link href="/quiz" className="btn-primary btn-lg group">
              <span className="tracking-[0.2em]" style={{ fontFamily: "var(--font-brand)" }}>
                背单词
              </span>
              <svg
                width="20"
                height="12"
                viewBox="0 0 20 12"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M1 6H19M19 6L13 1M19 6L13 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Link>

            <Link href="/poetry" className="btn-outline btn-lg group">
              <span className="tracking-[0.2em]" style={{ fontFamily: "var(--font-brand)" }}>
                拼诗词
              </span>
              <svg
                width="18"
                height="12"
                viewBox="0 0 18 12"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M1 6H17M17 6L12 1M17 6L12 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* ===== 功能板块 ===== */}
        <section className="w-full relative py-28 border-t border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-6">
            {/* 标题 */}
            <div className="text-center mb-20">
              <div
                className="text-xs tracking-[0.4em] text-[var(--color-bamboo)] uppercase mb-4"
                style={{ fontFamily: "var(--font-en)" }}
              >
                Features
              </div>
              <h2
                className="text-[var(--color-rice)] mb-4"
                style={{
                  fontFamily: "var(--font-brand)",
                  fontSize: "clamp(36px, 5vw, 64px)",
                  letterSpacing: "0.1em",
                }}
              >
                核心特性
              </h2>
            </div>

            {/* 功能卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, idx) => {
                const accentColor =
                  feature.accent === "bamboo"
                    ? "var(--color-bamboo)"
                    : feature.accent === "jade"
                    ? "var(--color-jade)"
                    : "var(--color-bamboo)";
                const accentDim =
                  feature.accent === "bamboo"
                    ? "var(--color-bamboo-dim)"
                    : feature.accent === "jade"
                    ? "var(--color-jade-dim)"
                    : "var(--color-bamboo-dim)";

                return (
                  <div
                    key={idx}
                    className="group relative p-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-bamboo)]/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* 顶部装饰发光线 */}
                    <div
                      className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                      }}
                    />

                    {/* 数字编号 */}
                    <div
                      className="absolute top-4 right-5 text-[20px] text-[var(--color-ink-600)]"
                      style={{ fontFamily: "var(--font-en)" }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </div>

                    {/* 汉字图标 */}
                    <div
                      className="w-14 h-14 rounded flex items-center justify-center mb-6 text-3xl transition-all duration-500 group-hover:scale-105"
                      style={{
                        fontFamily: "var(--font-brand)",
                        background: accentDim,
                        color: accentColor,
                        border: `1px solid ${accentColor}30`,
                      }}
                    >
                      {feature.icon}
                    </div>

                    <h3
                      className="text-lg text-[var(--color-rice)] mb-3 tracking-wider"
                      style={{ fontFamily: "var(--font-brand)", letterSpacing: "0.15em" }}
                    >
                      {feature.title}
                    </h3>

                    <p
                      className="text-sm text-[var(--color-rice-muted)] leading-relaxed"
                      style={{ lineHeight: "1.9" }}
                    >
                      {feature.desc}
                    </p>

                    {/* 底部装饰细线 */}
                    <div
                      className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"
                      style={{ width: "100%" }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== 交互概念展示 ===== */}
        <section className="w-full py-28 border-t border-[var(--color-border)] bg-[var(--color-ink-950)]/40">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <div
                className="text-xs tracking-[0.4em] text-[var(--color-bamboo)] uppercase mb-4"
                style={{ fontFamily: "var(--font-en)" }}
              >
                Interaction Flow
              </div>
              <h2
                className="text-[var(--color-rice)] mb-4"
                style={{
                  fontFamily: "var(--font-brand)",
                  fontSize: "clamp(30px, 4vw, 50px)",
                  letterSpacing: "0.1em",
                }}
              >
                四向答題
              </h2>
              <p className="text-[var(--color-rice-muted)] max-w-xl mx-auto text-sm leading-relaxed">
                抬头选上，点头选下，转头左右选择两边。简单的动作，组成无限的学习循环。
              </p>
            </div>

            {/* 四方向演示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
              {/* 左：人脸 + 方向标 */}
              <div className="relative aspect-square max-w-md mx-auto w-full">
                <div
                  className="absolute inset-0 rounded-full border border-[var(--color-border)]"
                  style={{
                    background:
                      "radial-gradient(circle, var(--color-bamboo-dim) 0%, transparent 70%)",
                  }}
                />
                <div className="absolute inset-10 rounded-full border border-dashed border-[var(--color-border)] opacity-60" />
                {/* 中心圆 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="w-40 h-40 rounded-full flex items-center justify-center"
                    style={{
                      background:
                      "radial-gradient(circle, var(--color-jade-dim), transparent 80%)",
                    border: "1px solid var(--color-jade-glow)",
                    }}
                  >
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-4xl text-[var(--color-rice)] bg-[var(--color-surface)] border border-[var(--color-border)]"
                      style={{ fontFamily: "var(--font-brand)" }}
                    >
                      頭
                    </div>
                  </div>
                </div>
                {/* 四个方向标 */}
                {[
                  { label: "上", sub: "UP", pos: "top-4 left-1/2 -translate-x-1/2", arrow: "↑" },
                  { label: "下", sub: "DOWN", pos: "bottom-4 left-1/2 -translate-x-1/2", arrow: "↓" },
                  { label: "左", sub: "LEFT", pos: "left-4 top-1/2 -translate-y-1/2", arrow: "←" },
                  { label: "右", sub: "RIGHT", pos: "right-4 top-1/2 -translate-y-1/2", arrow: "→" },
                ].map((d) => (
                  <div
                    key={d.label}
                    className={`absolute ${d.pos} flex flex-col items-center gap-1`}
                  >
                    <span
                      className="text-2xl text-[var(--color-bamboo-bright)]"
                      style={{ fontFamily: "var(--font-brand)" }}
                    >
                      {d.arrow}
                    </span>
                    <span
                      className="text-xs text-[var(--color-rice)]"
                      style={{ fontFamily: "var(--font-brand)" }}
                    >
                      {d.label}
                    </span>
                    <span
                      className="text-[10px] text-[var(--color-muted)] tracking-[0.2em]"
                      style={{ fontFamily: "var(--font-en)" }}
                    >
                      {d.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* 右：流程文字 */}
              <div className="space-y-6">
                {[
                  { step: "第一步", title: "授权摄像头", desc: "浏览器会询问是否允许访问摄像头，允许后即可开始。图像仅在本地处理，不会上传。" },
                  { step: "第二步", title: "头部动作校准", desc: "系统会自动记录你的中立姿态作为基准。保持坐姿端正，约 1-2 秒后即可开始答题。" },
                  { step: "第三步", title: "四向选择答案", desc: "屏幕会显示单词 + 四个释义选项。分别对应上/下/左/右，用头部动作确认即可。" },
                  { step: "第四步", title: "智能调度复习", desc: "答对升级，答错归零，系统自动根据掌握程度安排下次复习时间。" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-5 items-start p-5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
                  >
                    <div
                      className="shrink-0 w-10 h-10 rounded flex items-center justify-center text-[var(--color-bamboo-bright)] bg-[var(--color-bamboo-dim)] border border-[var(--color-border)]"
                      style={{ fontFamily: "var(--font-brand)" }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div
                        className="text-xs tracking-[0.3em] text-[var(--color-muted)] mb-1"
                        style={{ fontFamily: "var(--font-en)" }}
                      >
                        {item.step}
                      </div>
                      <h4
                        className="text-base text-[var(--color-rice)] mb-2"
                        style={{ fontFamily: "var(--font-brand)", letterSpacing: "0.1em" }}
                      >
                        {item.title}
                      </h4>
                      <p
                        className="text-sm text-[var(--color-rice-muted)] leading-relaxed"
                        style={{ lineHeight: "1.85" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 底部 CTA 区块 */}
            <div
              className="relative max-w-4xl mx-auto text-center p-12 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
            >
              <div
                className="absolute -top-px left-1/2 -translate-x-1/2 w-40 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, var(--color-bamboo), transparent)",
                }}
              />
              <h3
                className="text-[var(--color-rice)] mb-3"
                style={{
                  fontFamily: "var(--font-brand)",
                  fontSize: "clamp(24px, 3.5vw, 40px)",
                  letterSpacing: "0.15em",
                }}
              >
                摇一摇，头脑清明
              </h3>
              <p className="text-[var(--color-rice-muted)] text-sm mb-8 leading-relaxed">
                给自己 10 分钟，背 20 个单词，同时把颈椎也活动一遍。
              </p>
              <Link href="/quiz" className="btn-primary btn-lg group">
                <span className="tracking-[0.2em]" style={{ fontFamily: "var(--font-brand)" }}>
                  立即开始
                </span>
                <svg
                  width="18"
                  height="10"
                  viewBox="0 0 18 10"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M1 5H17M17 5L12 1M17 5L12 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="w-full border-t border-[var(--color-border)] py-10 bg-[var(--color-ink-900)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="leading-tight">
              <div
                className="text-[var(--color-rice)] text-sm tracking-[0.25em]"
                style={{ fontFamily: "var(--font-brand)" }}
              >
                晃晃学
              </div>
              <div
                className="text-[var(--color-muted)] text-[10px] tracking-[0.2em] uppercase italic"
                style={{ fontFamily: "var(--font-en)" }}
              >
                Shake · Words
              </div>
            </div>
          </div>

          <div className="text-xs text-[var(--color-muted)] tracking-[0.15em]">
            © 2026 晃晃学 · 边背单词，边养颈椎
          </div>

          <div
            className="text-[10px] text-[var(--color-muted-light)] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            v1.0 · Ink · Ember Theme
          </div>
        </div>
      </footer>
    </div>
  );
}
