import type { MetadataRoute } from "next";
import { brand } from "@/content";

const PRIVATE = ["/api/", "/admin", "/espace", "/j/"];
/** Robots des moteurs de réponse IA, autorisés explicitement (pages publiques seulement). */
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })),
    ],
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  };
}
