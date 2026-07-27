import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow real photography to be dropped in later via Supabase Storage or a
    // stock provider without touching code. Placeholders are used until then.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
