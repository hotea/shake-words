import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_BASE_PATH || "";

export const metadata: Metadata = {
  title: {
    default: "晃晃学 · ShakeWords | 摇头晃脑学词诵诗",
    template: "%s · 晃晃学",
  },
  description:
    "创新的 AI 视觉交互学习应用，通过摄像头识别头部动作（点头、摇头、转头）选择单词释义，边背单词边活动颈椎。支持英语词书与古诗古文，兼顾学习与文化传承。",
  keywords: [
    "背单词",
    "英语学习",
    "颈椎放松",
    "头部动作",
    "AI视觉",
    "MediaPipe",
    "互动学习",
    "古诗词",
    "古籍活化",
    "ShakeWords",
  ],
  authors: [{ name: "晃晃学 ShakeWords Team" }],
  creator: "晃晃学 ShakeWords",
  publisher: "晃晃学 ShakeWords",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://shakewords.wyld.cc",
    siteName: "晃晃学 · ShakeWords",
    title: "晃晃学 · ShakeWords | 摇头晃脑学词诵诗",
    description:
      "AI 视觉识别头部动作，边学边活动颈椎。支持英语词书与古诗古文，兼顾学习与文化传承。",
    images: [
      {
        url: "https://shakewords.wyld.cc/og-image.png",
        width: 1200,
        height: 630,
        alt: "晃晃学 ShakeWords",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "晃晃学 · ShakeWords | 摇头晃脑学词诵诗",
    description:
      "AI 视觉识别头部动作，边学边活动颈椎。支持英语词书与古诗古文，兼顾学习与文化传承。",
    images: ["https://shakewords.wyld.cc/og-image.png"],
    creator: "@shakewords",
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
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href={`${basePath}/favicon.svg`}
        />
        <link
          rel="shortcut icon"
          type="image/svg+xml"
          href={`${basePath}/favicon.svg`}
        />
        <link
          rel="apple-touch-icon"
          href={`${basePath}/apple-touch-icon.png`}
        />
        <link rel="manifest" href={`${basePath}/manifest.json`} />

        {/* 字体预加载：Noto Serif SC + ZCOOL XiaoWei（中文）+ Cormorant Garamond（英文衬线）+ JetBrains Mono（等宽）*/}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;900&family=ZCOOL+XiaoWei&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "晃晃学 · ShakeWords",
              description:
                "通过 AI 视觉识别头部动作交互学习英语单词与古诗古文，边学边活动颈椎，让学习更健康有趣。",
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
                "CET4/6、考研、雅思、托福、GRE 词书",
                "古诗古文学习 · 古籍活化",
                "实时学习统计",
                "个性化学习设置",
              ],
              author: {
                "@type": "Organization",
                name: "晃晃学 ShakeWords Team",
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
