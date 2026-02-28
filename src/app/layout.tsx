import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShakeWords - 摇头背单词",
  description: "通过Face Mesh识别头部动作，用摇头来选择单词释义，让背单词变得有趣",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        {children}
      </body>
    </html>
  );
}
