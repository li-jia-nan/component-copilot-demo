import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    qualities: [25, 50, 75, 100],
  },
};

export default nextConfig;
