import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "单词测验 - ShakeWords",
  description: "通过头部动作（点头、摇头、转头）选择单词释义，边背单词边活动颈椎。支持多种词书，让学习更健康有趣。",
  keywords: ["单词测验", "背单词", "头部动作", "颈椎放松", "交互学习", "英语单词"],
  openGraph: {
    title: "单词测验 - ShakeWords",
    description: "通过头部动作选择单词释义，边背单词边放松颈椎",
    type: "website",
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
