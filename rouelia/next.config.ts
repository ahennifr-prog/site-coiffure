import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  // Adresse officielle : https://rouelia.fr (canonical et og:url pointent dessus, voir brand.url).
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.rouelia.fr" }],
        destination: "https://rouelia.fr/",
        permanent: true,
      },
      {
        source: "/:path+",
        has: [{ type: "host", value: "www.rouelia.fr" }],
        destination: "https://rouelia.fr/:path+",
        permanent: true,
      },
    ];
  },
  // L'adresse de démo en .workers.dev ne doit pas être indexée : seul rouelia.fr compte pour Google.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.workers\\.dev" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;

// En développement (npm run dev), donne accès aux liaisons Cloudflare locales (base D1 simulée).
initOpenNextCloudflareForDev();
