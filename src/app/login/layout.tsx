import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登录 - ShakeWords",
  description: "登录 ShakeWords 开始你的英语单词学习之旅。通过头部动作交互学习，边背单词边放松颈椎。",
  keywords: ["登录", "背单词", "英语学习", "颈椎放松", "头部动作"],
  openGraph: {
    title: "登录 - ShakeWords",
    description: "登录开始你的英语单词学习之旅",
    type: "website",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
