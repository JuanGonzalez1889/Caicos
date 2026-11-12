// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["adopt-spent-cassette-gen.trycloudflare.com"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
