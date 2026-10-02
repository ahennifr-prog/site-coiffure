import type { MetadataRoute } from "next";
import { brand } from "@/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/espace", "/j/"] },
    sitemap: `${brand.url}/sitemap.xml`,
  };
}
