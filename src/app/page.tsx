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
    <main className="min-h-screen bg-[#faf9f7] relative overflow-hidden">
      {/* 背景装饰 — 有机流动的渐变 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#1e3a5f]/[0.04] via-[#2d5a87]/[0.02] to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#b45309]/[0.03] via-[#d97706]/[0.02] to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#1e3a5f]/[0.02] to-[#b45309]/[0.02] rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* 顶部导航 */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <AppLogo />
          <span className="font-semibold text-[#1c1917] text-lg tracking-tight">ShakeWords</span>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/books" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-[#78716c] hover:text-[#1c1917] rounded-lg hover:bg-[#1e3a5f]/[0.04] transition-all duration-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            词书
          </Link>
          <Link href="/stats" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-[#78716c] hover:text-[#1c1917] rounded-lg hover:bg-[#1e3a5f]/[0.04] transition-all duration-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            统计
          </Link>
          <Link href="/settings" className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-[#78716c] hover:text-[#1c1917] rounded-lg hover:bg-[#1e3a5f]/[0.04] transition-all duration-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.212 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            设置
          </Link>
          <div className="w-px h-5 bg-[#e7e5e4] mx-1 hidden sm:block" />
          <AuthHeader />
        </div>
      </nav>

      {/* Hero 区域 */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* 左侧文字 */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f]/[0.06] rounded-full mb-8">
              <span className="w-2 h-2 bg-[#1e3a5f] rounded-full animate-pulse" />
              <span className="text-sm text-[#1e3a5f] font-medium">AI 驱动的头部动作识别</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1c1917] leading-[1.05] tracking-tight mb-6">
              晃晃
              <br />
              <span className="text-[#1e3a5f]">背单词</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-[#78716c] leading-relaxed mb-4 max-w-lg">
              学习时放松颈椎
            </p>
            
            <p className="text-base text-[#a8a29e] leading-relaxed mb-10 max-w-md">
              通过头部动作选择单词释义，边学单词边活动颈椎。
              支持多种词书，让学习更轻松有趣。
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link 
                href="/books" 
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1e3a5f] text-white text-lg font-medium rounded-2xl hover:bg-[#0f1f33] transition-all duration-300 shadow-lg shadow-[#1e3a5f]/20 hover:shadow-xl hover:shadow-[#1e3a5f]/30 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                选择词书
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link 
                href="/quiz" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#1c1917] text-lg font-medium rounded-2xl border border-[#e7e5e4] hover:border-[#1e3a5f]/20 hover:bg-[#1e3a5f]/[0.02] transition-all duration-300"
              >
                <svg className="w-5 h-5 text-[#b45309]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                快速体验
              </Link>
            </div>

            {/* 数据统计 */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-[#e7e5e4]">
              <div>
                <div className="text-2xl font-bold text-[#1c1917]">6+</div>
                <div className="text-sm text-[#a8a29e]">词书资源</div>
              </div>
              <div className="w-px h-10 bg-[#e7e5e4]" />
              <div>
                <div className="text-2xl font-bold text-[#1c1917]">AI</div>
                <div className="text-sm text-[#a8a29e]">动作识别</div>
              </div>
              <div className="w-px h-10 bg-[#e7e5e4]" />
              <div>
                <div className="text-2xl font-bold text-[#1c1917]">免费</div>
                <div className="text-sm text-[#a8a29e]">永久使用</div>
              </div>
            </div>
          </div>

          {/* 右侧视觉 */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* 主圆形背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/[0.08] to-[#b45309]/[0.04] rounded-full" />
              
              {/* 装饰圆环 */}
              <div className="absolute inset-4 border border-[#1e3a5f]/[0.08] rounded-full" />
              <div className="absolute inset-12 border border-dashed border-[#b45309]/[0.12] rounded-full" />
              
              {/* 中心内容 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a87] rounded-3xl flex items-center justify-center shadow-xl shadow-[#1e3a5f]/20">
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-[#1c1917] mb-2">头部动作</div>
                  <div className="text-lg text-[#78716c]">交互学习</div>
                </div>
              </div>

              {/* 浮动元素 */}
              <div className="absolute top-8 right-8 bg-white rounded-2xl px-4 py-3 shadow-lg shadow-black/5 border border-[#e7e5e4]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#047857] rounded-full" />
                  <span className="text-sm text-[#44403c] font-medium">颈椎放松</span>
                </div>
              </div>
              
              <div className="absolute bottom-12 left-0 bg-white rounded-2xl px-4 py-3 shadow-lg shadow-black/5 border border-[#e7e5e4]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#1d4ed8] rounded-full" />
                  <span className="text-sm text-[#44403c] font-medium">实时识别</span>
                </div>
              </div>
              
              <div className="absolute top-1/3 left-4 bg-white rounded-2xl px-4 py-3 shadow-lg shadow-black/5 border border-[#e7e5e4]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#b45309] rounded-full" />
                  <span className="text-sm text-[#44403c] font-medium">久坐缓解</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特性区域 */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-4">边学单词边放松颈椎</h2>
          <p className="text-lg text-[#78716c] max-w-2xl mx-auto">
            ShakeWords 将英语学习与颈部运动相结合，让你在记忆单词的同时，通过自然的头部转动活动颈椎
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 特性 1 */}
          <div className="group bg-white rounded-3xl p-8 border border-[#e7e5e4] hover:border-[#1e3a5f]/10 hover:shadow-xl hover:shadow-[#1e3a5f]/5 transition-all duration-500">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a5f]/10 to-[#1e3a5f]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#1c1917] mb-3">AI 动作识别</h3>
            <p className="text-[#78716c] leading-relaxed">
              通过摄像头实时识别头部动作，向左转头选择左侧答案，向右转头选择右侧答案，点头确认
            </p>
          </div>

          {/* 特性 2 */}
          <div className="group bg-white rounded-3xl p-8 border border-[#e7e5e4] hover:border-[#b45309]/10 hover:shadow-xl hover:shadow-[#b45309]/5 transition-all duration-500">
            <div className="w-14 h-14 bg-gradient-to-br from-[#b45309]/10 to-[#b45309]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-[#b45309]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#1c1917] mb-3">颈椎健康</h3>
            <p className="text-[#78716c] leading-relaxed">
              每学习一个单词都是一次颈部运动，有效缓解久坐带来的颈椎疲劳，预防颈椎病
            </p>
          </div>

          {/* 特性 3 */}
          <div className="group bg-white rounded-3xl p-8 border border-[#e7e5e4] hover:border-[#047857]/10 hover:shadow-xl hover:shadow-[#047857]/5 transition-all duration-500">
            <div className="w-14 h-14 bg-gradient-to-br from-[#047857]/10 to-[#047857]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-[#047857]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#1c1917] mb-3">丰富词书</h3>
            <p className="text-[#78716c] leading-relaxed">
              支持 CET4、CET6、GRE、雅思、托福、BEC 等多种词书，满足不同学习阶段的需求
            </p>
          </div>
        </div>
      </section>

      {/* 词书展示 */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a87] rounded-3xl p-8 sm:p-12 lg:p-16 text-white overflow-hidden relative">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">丰富的词书资源</h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                覆盖从四六级到出国考试的全阶段词汇需求
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "CET-4", desc: "大学英语四级", count: "4,500+" },
                { name: "CET-6", desc: "大学英语六级", count: "6,000+" },
                { name: "GRE", desc: "美国研究生入学", count: "8,000+" },
                { name: "雅思", desc: "IELTS 考试", count: "5,000+" },
                { name: "托福", desc: "TOEFL 考试", count: "5,500+" },
                { name: "BEC", desc: "商务英语", count: "3,000+" },
              ].map((book, i) => (
                <div key={i} className="group bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.1] hover:bg-white/[0.12] hover:border-white/[0.2] transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold">{book.name}</h3>
                    <span className="text-sm text-white/50">{book.count} 词</span>
                  </div>
                  <p className="text-white/60 text-sm">{book.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link 
                href="/books" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1e3a5f] text-lg font-medium rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-lg"
              >
                浏览全部词书
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 健康学习理念 */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] mb-6 leading-tight">
              健康学习，
              <br />
              从 ShakeWords 开始
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#047857]/10 rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-5 h-5 text-[#047857]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1c1917] mb-1">缓解颈椎疲劳</h3>
                  <p className="text-[#78716c]">每学习一个单词都是一次颈部运动，有效缓解久坐带来的颈椎疲劳</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#1d4ed8]/10 rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-5 h-5 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1c1917] mb-1">提升学习效率</h3>
                  <p className="text-[#78716c]">身体活动促进大脑血液循环，让记忆更加深刻持久</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#b45309]/10 rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-5 h-5 text-[#b45309]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1c1917] mb-1">让学习更有趣</h3>
                  <p className="text-[#78716c]">告别枯燥的死记硬背，用身体动作让学习过程更加生动有趣</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-[#f5f3ef] to-[#e7e5e4] rounded-3xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a87] rounded-full flex items-center justify-center shadow-2xl shadow-[#1e3a5f]/20">
                    <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-[#1c1917]">健康学习</div>
                  <div className="text-lg text-[#78716c]">快乐记忆</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="bg-[#1c1917] rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1e3a5f]/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#b45309]/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">开始你的健康学习之旅</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
              免费使用，无需注册即可体验。让每一次学习都成为对颈椎的呵护。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/quiz" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1c1917] text-lg font-medium rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-lg"
              >
                立即体验
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link 
                href="/books" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white text-lg font-medium rounded-2xl border border-white/20 hover:bg-white/5 transition-all duration-300"
              >
                浏览词书
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t border-[#e7e5e4]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AppLogo />
            <span className="font-semibold text-[#1c1917]">ShakeWords</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#78716c]">
            <Link href="/books" className="hover:text-[#1c1917] transition-colors">词书</Link>
            <Link href="/quiz" className="hover:text-[#1c1917] transition-colors">测验</Link>
            <Link href="/stats" className="hover:text-[#1c1917] transition-colors">统计</Link>
            <Link href="/settings" className="hover:text-[#1c1917] transition-colors">设置</Link>
          </div>
          <div className="text-sm text-[#a8a29e]">
            © 2026 ShakeWords. 边学单词边放松颈椎。
          </div>
        </div>
      </footer>
    </main>
  );
}
