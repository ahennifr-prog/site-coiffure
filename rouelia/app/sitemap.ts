import type { MetadataRoute } from "next";
import { brand } from "@/content";
import { sitePages } from "@/lib/site-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return sitePages.map((p) => ({
    url: p.path === "/" ? brand.url : `${brand.url}${p.path}`,
    lastModified: p.lastModified ? new Date(p.lastModified) : now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
