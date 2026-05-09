const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig = {
  output: "standalone",
  basePath: basePath || undefined,
  images: { unoptimized: true },
  turbopack: {},
  // 禁用静态页面缓存，确保每次部署都能立即生效
  staticPageGenerationTimeout: 60,
  // 添加缓存控制
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
