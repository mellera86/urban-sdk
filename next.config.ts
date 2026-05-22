import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.urbansdk.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
