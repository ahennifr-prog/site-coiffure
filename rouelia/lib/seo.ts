import type { Metadata } from "next";
import { brand, seo } from "@/content";

/** Aperçu de partage commun à toutes les pages ; l'image est générée par app/opengraph-image.tsx. */
export const baseOpenGraph = {
  type: "website",
  locale: seo.locale,
  siteName: brand.name,
  title: seo.ogTitle,
  description: seo.ogDescription,
} satisfies Metadata["openGraph"];

/**
 * Adresse canonique et og:url d'une page publique indexée. Posées page par page (et non dans le layout)
 * pour que les pages non indexées et la page 404 ne déclarent pas l'accueil comme canonique.
 */
export function indexedPage(path: string, share?: { title: string; description: string }): Metadata {
  // Un openGraph défini dans une page remplace celui du layout, image comprise : on la redonne aux sous-pages.
  const images = path === "/" ? {} : { images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: seo.ogTitle }] };
  return { alternates: { canonical: path }, openGraph: { ...baseOpenGraph, ...share, url: path, ...images } };
}
