import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Drop your own photos in /public/photos and reference them as "/photos/name.jpg".
    // If you later host images elsewhere, add the hostname here.
    remotePatterns: [],
  },
};

export default nextConfig;
