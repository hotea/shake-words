const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig = {
  output: "standalone",
  basePath: basePath || undefined,
  images: { unoptimized: true },
  turbopack: {},
};

export default nextConfig;
