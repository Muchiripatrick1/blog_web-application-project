import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
    deviceSizes: [576, 768, 992, 1200, 1400]
  }
};

export default nextConfig;
