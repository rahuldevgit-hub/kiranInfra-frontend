import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: 'export',       // ✅ enables static export
  images: {
    domains: ["192.168.0.65"],
  },
  // optional: trailingSlash: true, // uncomment if you want URLs to end with '/'
};

export default nextConfig;
