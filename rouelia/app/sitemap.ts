import type { MetadataRoute } from "next";
import { brand } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: brand.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${brand.url}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${brand.url}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${brand.url}/cgv`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
