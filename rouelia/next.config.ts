import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;

// En développement (npm run dev), donne accès aux liaisons Cloudflare locales (base D1 simulée).
initOpenNextCloudflareForDev();
