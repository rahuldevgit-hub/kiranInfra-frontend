import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // domains: ["newstaging.kiraninfra.com"],
    domains: ["192.168.0.65"],
  },
};

export default nextConfig;
