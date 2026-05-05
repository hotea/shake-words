import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const basePath = process.env.NEXT_BASE_PATH || "";

export const metadata: Metadata = {
  title: "ShakeWords - 晃晃背单词",
  description: "通过Face Mesh识别头部动作，用晃头来选择单词释义，让背单词变得有趣",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" type="image/svg+xml" href={`${basePath}/favicon.svg`} />
        <link rel="shortcut icon" type="image/svg+xml" href={`${basePath}/favicon.svg`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
