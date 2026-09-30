import { brand, faq, pricing, seo } from "@/content";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: brand.url,
    logo: `${brand.url}/icon.svg`,
    email: brand.email,
    areaServed: { "@type": "AdministrativeArea", name: "Île-de-France" },
    founder: { "@type": "Person", name: brand.founder },
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
    offers: pricing.packs.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price.toFixed(2),
      priceCurrency: "EUR",
      description: p.tagline,
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

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

/** Sérialisation sûre pour une balise <script type="application/ld+json">. */
export function ldString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
