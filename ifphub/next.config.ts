import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,   // 🔥 DESACTIVAR ESTO ES CRÍTICO
    typedRoutes: false,     // evita más problemas
  },
};

export default nextConfig;
