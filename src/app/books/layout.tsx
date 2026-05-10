import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "选择词书 - ShakeWords",
  description: "浏览和选择适合你的英语词书，包括CET4、CET6、GRE、雅思、托福等。通过头部动作交互学习，边背单词边放松颈椎。",
  keywords: ["词书", "单词书", "CET4", "CET6", "GRE", "雅思", "托福", "英语词汇", "颈椎放松"],
  openGraph: {
    title: "选择词书 - ShakeWords",
    description: "浏览和选择适合你的英语词书",
    type: "website",
  },
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
