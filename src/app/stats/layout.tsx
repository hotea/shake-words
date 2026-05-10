import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "学习统计 - ShakeWords",
  description: "查看你的英语学习进度和统计数据。跟踪每日学习量、正确率和词汇掌握情况，通过头部动作交互学习，边背单词边放松颈椎。",
  keywords: ["学习统计", "学习进度", "单词记忆", "数据分析", "颈椎放松"],
  openGraph: {
    title: "学习统计 - ShakeWords",
    description: "查看你的英语学习进度和统计数据",
    type: "website",
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
