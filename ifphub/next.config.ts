import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typedRoutes: false,  
    images: {
        domains: ['images.unsplash.com'],
      },   
    devIndicators:false,
};

export default nextConfig;
