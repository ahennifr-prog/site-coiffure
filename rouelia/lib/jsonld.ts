import { brand, faq, pricing, seo } from "@/content";

/** Texte sans la syntaxe [lien](/chemin). */
const plain = (text: string) => text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, "$1");
const abs = (path: string) => (path.startsWith("http") ? path : `${brand.url}${path === "/" ? "" : path}`);

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${brand.url}/#organisation`,
    name: brand.name,
    url: brand.url,
    logo: `${brand.url}/icon.svg`,
    email: brand.email,
    description: seo.description,
    areaServed: { "@type": "AdministrativeArea", name: "Île-de-France" },
    founder: { "@id": `${brand.url}/a-propos#fondateur` },
    contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: brand.email, availableLanguage: "French", url: `${brand.url}/rendez-vous` },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${brand.url}/#site`,
    name: brand.name,
    url: brand.url,
    inLanguage: "fr-FR",
    publisher: { "@id": `${brand.url}/#organisation` },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${brand.url}/a-propos#fondateur`,
    name: brand.founder,
    jobTitle: "Fondateur de Rouelia",
    worksFor: { "@id": `${brand.url}/#organisation` },
    url: `${brand.url}/a-propos`,
    image: `${brand.url}/a-propos/poignee-de-main-720.webp`,
  };
}

/** Le service et ses trois abonnements. */
export function productJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${brand.name}, roue à cadeaux de fidélisation`,
    description: seo.description,
    brand: { "@type": "Brand", name: brand.name },
    url: `${brand.url}/tarifs`,
    offers: pricing.packs.map((p) => ({
      "@type": "Offer",
      name: p.name,
      description: `${p.tagline} ${p.features}`,
      price: p.price.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${brand.url}/tarifs`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.price.toFixed(2),
        priceCurrency: "EUR",
        billingDuration: "P1M",
        unitText: "mois",
      },
    })),
  };
}

export function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: brand.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: seo.description,
    url: brand.url,
    offers: pricing.packs.map((p) => ({ "@type": "Offer", name: p.name, price: p.price.toFixed(2), priceCurrency: "EUR" })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[] = faq.items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: plain(i.a) },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: abs(t.href) })),
  };
}

export function articleJsonLd(a: { path: string; h1: string; description: string; date: string; updated: string; author: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.h1,
    description: a.description,
    datePublished: a.date,
    dateModified: a.updated,
    inLanguage: "fr-FR",
    mainEntityOfPage: abs(a.path),
    image: `${brand.url}/opengraph-image`,
    author: { "@type": "Person", name: a.author, url: `${brand.url}/a-propos` },
    publisher: { "@type": "Organization", name: brand.name, logo: { "@type": "ImageObject", url: `${brand.url}/icon.svg` } },
  };
}

/** Sérialisation sûre pour une balise <script type="application/ld+json">. */
export function ldString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
