import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  async rewrites() {
    return [
      // Serve the Sveltia CMS dashboard at /admin (public/admin/index.html).
      { source: "/admin", destination: "/admin/index.html" },
    ];
  },
};

export default nextConfig;
