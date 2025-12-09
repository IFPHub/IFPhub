import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: false,     // evita más problemas
  },
};

export default nextConfig;
