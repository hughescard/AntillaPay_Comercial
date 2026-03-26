import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/pasarela",
  output: "export",
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.66.66.3',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;
