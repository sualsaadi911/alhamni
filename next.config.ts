import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com", "picsum.photos", "images.unsplash.com"],
  },
};

export default nextConfig;
