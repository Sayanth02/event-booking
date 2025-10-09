import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Do not fail the production build on TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
