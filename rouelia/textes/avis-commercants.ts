/**
 * Avis de commerçants affichés sur le site.
 * RÈGLE : un avis ne passe à `valide: true` qu'une fois son texte relu et accepté par écrit par le commerçant.
 * Seuls les avis valides s'affichent. Tant qu'aucun ne l'est, la section reste masquée
 * (aperçu interne possible avec l'adresse /?apercu=avis, signalé « brouillon »).
 */
export interface MerchantReview {
  shop: string;
  /** Métier et ville, affichés sous le nom. */
  trade: string;
  text: string;
  /** Note sur 5. */
  stars: number;
  /** Logo dans /public/logos (fond foncé conseillé pour un logo blanc), sinon monogramme. */
  logo?: { src: string; width: number; height: number; background: string };
  monogram: string;
  /** Couleur du monogramme. */
  color: string;
  valide: boolean;
}

export const merchantReviews: MerchantReview[] = [
  {
    shop: "Alia Coiffure",
    trade: "Salon de coiffure, Champigny-sur-Marne",
    text: "Je ne m'attendais pas à ce que ça apporte autant. Avec cette roue, mes clientes reviennent et mon planning est plus rempli.",
    stars: 5,
    logo: { src: "/logos/alia-coiffure.webp", width: 160, height: 158, background: "#1D1A16" },
    monogram: "AC",
    color: "#1D1A16",
    valide: false,
  },
  {
    shop: "Pizza Time",
    trade: "Pizzeria",
    text: "Les clients adorent jouer en attendant leur commande, et ils reviennent pour leur cadeau.",
    stars: 5,
    monogram: "PT",
    color: "#C4401F",
    valide: false,
  },
  {
    shop: "Bangkok Factory 94",
    trade: "Restaurant thaï",
    text: "Avec la roue, on fidélise vraiment : les clients reviennent pour utiliser leur cadeau.",
    stars: 5,
    monogram: "BF",
    color: "#2E6150",
    valide: false,
  },
  {
    shop: "Elsa Beauty",
    trade: "Institut de beauté",
    text: "Simple à installer, et mes clientes reviennent plus souvent. Je recommande.",
    stars: 5,
    monogram: "EB",
    color: "#8A4B5C",
    valide: false,
  },
];

export const merchantReviewsSection = {
  eyebrow: "Ils l'utilisent",
  title: "Ce qu'en disent les commerçants.",
  draft: "Brouillon, non publié : en attente de validation du commerçant",
};
