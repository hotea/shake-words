import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const basePath = process.env.NEXT_BASE_PATH || "";

export const metadata: Metadata = {
  title: {
    default: "ShakeWords - 晃晃背单词 | 边学单词边放松颈椎",
    template: "%s - ShakeWords",
  },
  description: "创新的英语单词学习应用，通过摄像头识别头部动作（点头、摇头、转头）来选择单词释义。边背单词边活动颈椎，缓解久坐疲劳，让学习更健康有趣。支持CET4、CET6、GRE、雅思、托福等词库。",
  keywords: ["背单词", "英语学习", "单词记忆", "CET4", "CET6", "GRE", "雅思", "托福", "颈椎放松", "头部运动", "交互学习", "健康学习", "久坐缓解", "颈部活动"],
  authors: [{ name: "ShakeWords Team" }],
  creator: "ShakeWords",
  publisher: "ShakeWords",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://shakewords.wyld.cc",
    siteName: "ShakeWords - 晃晃背单词",
    title: "ShakeWords - 晃晃背单词 | 边学单词边放松颈椎",
    description: "通过头部动作交互学习英语单词，边背单词边活动颈椎，让学习更健康有趣。",
    images: [
      {
        url: "https://shakewords.wyld.cc/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShakeWords 晃晃背单词 - 边学单词边放松颈椎",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShakeWords - 晃晃背单词 | 边学单词边放松颈椎",
    description: "通过头部动作交互学习英语单词，边背单词边活动颈椎，让学习更健康有趣。",
    images: ["https://shakewords.wyld.cc/og-image.png"],
    creator: "@shakewords",
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://shakewords.wyld.cc",
  },
  category: "教育",
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
        <link rel="apple-touch-icon" href={`${basePath}/apple-touch-icon.png`} />
        <link rel="manifest" href={`${basePath}/manifest.json`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ShakeWords - 晃晃背单词",
              description: "通过头部动作交互学习英语单词，边背单词边活动颈椎，让学习更健康有趣。",
              url: "https://shakewords.wyld.cc",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CNY",
              },
              featureList: [
                "头部动作识别",
                "颈椎放松运动",
                "CET4/CET6/GRE/雅思/托福词库",
                "实时学习统计",
                "个性化学习设置",
              ],
              author: {
                "@type": "Organization",
                name: "ShakeWords Team",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
