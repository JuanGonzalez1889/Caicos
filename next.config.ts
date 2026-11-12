import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["adopt-spent-cassette-gen.trycloudflare.com"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
