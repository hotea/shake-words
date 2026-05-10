import Link from "next/link";
import { AuthHeader } from "@/components/AuthHeader";
import { AppLogo } from "@/components/AppLogo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShakeWords - 晃晃背单词 | 边学单词边放松颈椎",
  description: "创新的英语单词学习应用，通过摄像头识别头部动作来选择单词释义。边背单词边活动颈椎，让学习更健康有趣。",
};

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* Navigation */}
      <header className="w-full border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppLogo size="sm" />
            <span className="font-semibold text-lg text-gray-800">ShakeWords</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/books" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">词书</Link>
            <Link href="/stats" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">统计</Link>
            <Link href="/settings" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">设置</Link>
            <div className="w-px h-4 bg-gray-200" />
            <AuthHeader />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-800 mb-6">
            晃晃背单词
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            通过头部动作学习英语单词。边学边活动颈椎，缓解久坐疲劳。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/books"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors shadow-md"
            >
              开始学习
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-600 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              快速体验
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section - 垂直居中 + 轻快配色 */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="max-w-6xl w-full">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">AI 动作识别</h3>
              <p className="text-gray-500 leading-relaxed">
                通过摄像头实时识别头部动作，向左转头选择左侧答案，向右转头选择右侧答案，点头确认选择。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">颈椎健康</h3>
              <p className="text-gray-500 leading-relaxed">
                每学习一个单词都是一次颈部运动，有效缓解久坐带来的颈椎疲劳，预防颈椎病，让学习更健康。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">丰富词书</h3>
              <p className="text-gray-500 leading-relaxed">
                支持 CET4、CET6、GRE、雅思、托福、BEC 等多种词书，满足不同学习阶段的需求。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppLogo size="sm" />
            <span className="text-sm font-medium text-gray-600">ShakeWords</span>
          </div>
          <div className="text-xs text-gray-400">© 2026 ShakeWords</div>
        </div>
      </footer>
    </div>
  );
}
