import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/pasarela",
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.66.66.3',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
