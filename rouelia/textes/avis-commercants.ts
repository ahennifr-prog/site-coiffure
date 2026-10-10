/**
 * Avis de commerçants affichés sur le site.
 * RÈGLE : un avis ne passe à `valide: true` qu'une fois son texte relu et accepté par écrit par le commerçant.
 * Seuls les avis valides s'affichent. Tant qu'aucun ne l'est, la section reste masquée
 * (aperçu interne possible avec l'adresse /?apercu=avis, signalé « brouillon »).
 * Les 4 premiers avis ont été validés par les commerçants (confirmé par Aymen le 8 octobre 2026) ; les 5 suivants ont été
 * transmis par Aymen le 10 octobre 2026 (Nails Studio non publié, voir plus bas).
 */
export interface MerchantReview {
  shop: string;
  /** Métier, affiché sous le nom (remplacé par `metier` et `ville` quand ils sont renseignés). Sans ville pour l'instant. */
  trade: string;
  /**
   * Champs facultatifs pour rendre le témoignage vérifiable. Ne les remplir qu'avec des informations exactes
   * fournies ou acceptées par le commerçant. Affichés sur la carte uniquement s'ils sont renseignés.
   */
  /** Métier, par exemple « Salon de coiffure ». */
  metier?: string;
  /** Ville du commerce, par exemple « Champigny-sur-Marne ». */
  ville?: string;
  /** Lien public de la fiche Google du commerce (https://...). */
  ficheGoogle?: string;
  text: string;
  /** Note sur 5, affichée seulement si le commerçant l'a donnée. */
  stars?: number;
  /** Mois de publication, affiché sur la carte s'il est renseigné. Laissé vide pour l'instant (choix d'Aymen, 9 octobre 2026). */
  date?: string;
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
    trade: "Salon de coiffure",
    text: "Je ne m'attendais pas à ce que ça apporte autant. Avec cette roue, mes clientes reviennent et mon planning est plus rempli.",
    stars: 5,
    logo: { src: "/logos/alia-coiffure.webp", width: 160, height: 158, background: "#1D1A16" },
    monogram: "AC",
    color: "#1D1A16",
    valide: true,
  },
  {
    shop: "Pizza Time",
    trade: "Pizzeria",
    text: "Les clients adorent jouer en attendant leur commande, et ils reviennent pour leur cadeau.",
    stars: 5,
    logo: { src: "/logos/pizza-time.webp", width: 200, height: 131, background: "#FFFFFF" },
    monogram: "PT",
    color: "#C4401F",
    valide: true,
  },
  {
    shop: "Bangkok Factory 94",
    trade: "Restaurant thaï",
    text: "Avec la roue, on fidélise vraiment : les clients reviennent pour utiliser leur cadeau.",
    stars: 5,
    logo: { src: "/logos/bangkok-factory-94.webp", width: 200, height: 200, background: "#FFFFFF" },
    monogram: "BF",
    color: "#2E6150",
    valide: true,
  },
  {
    shop: "Elsa Beauty",
    trade: "Institut de beauté",
    text: "Simple à installer, et mes clientes reviennent plus souvent. Je recommande.",
    stars: 5,
    monogram: "EB",
    color: "#8A4B5C",
    valide: true,
  },
  // Avis transmis par Aymen le 10 octobre 2026, avec les logos (Drive). Pas de note sur 5 : elle n'a pas été donnée.
  {
    shop: "Nails Studio",
    trade: "Prothésiste ongulaire",
    // Non publié : le texte relie Rouelia à la note Google, ce que le site s'interdit (aucun lien entre le jeu et un avis).
    // À republier si le commerçant valide par écrit une version sans la note Google.
    text: "Grâce à Rouelia, notre note Google a augmenté. Un vrai plus pour la visibilité et l'image de notre salon !",
    logo: { src: "/logos/nails-studio.webp", width: 200, height: 200, background: "#F6DCD6" },
    monogram: "NS",
    color: "#B76E79",
    valide: false,
  },
  {
    shop: "Yoga Sens",
    trade: "Studio de yoga",
    text: "Une belle découverte pour notre studio. Rouelia rend l'expérience plus interactive et donne envie de participer.",
    logo: { src: "/logos/yoga-sens.webp", width: 200, height: 200, background: "#000000" },
    monogram: "YS",
    color: "#C4401F",
    valide: true,
  },
  {
    shop: "Coffee Shop Paris",
    trade: "Coffee shop",
    text: "Une solution sympa pour faire découvrir notre coffee shop et donner aux clients une bonne raison de revenir !",
    logo: { src: "/logos/coffee-shop-paris.webp", width: 200, height: 200, background: "#D9C3A5" },
    monogram: "CS",
    color: "#5C3B28",
    valide: true,
  },
  {
    shop: "Spa Traditionnel",
    trade: "Spa",
    text: "Une belle façon d'améliorer l'expérience client et de renforcer la fidélité de notre clientèle.",
    logo: { src: "/logos/spa-traditionnel.webp", width: 200, height: 200, background: "#5B4634" },
    monogram: "ST",
    color: "#8A6A3B",
    valide: true,
  },
  {
    shop: "Cleans Cars",
    trade: "Lavage automobile",
    text: "Rouelia nous permet de nous démarquer et d'encourager nos clients à revenir régulièrement.",
    logo: { src: "/logos/clean-cars.webp", width: 200, height: 200, background: "#FFFFFF" },
    monogram: "CC",
    color: "#1C5FC4",
    valide: true,
  },
];

export const merchantReviewsSection = {
  eyebrow: "Ils l'utilisent",
  title: "Ce qu'en disent les commerçants.",
  draft: "Brouillon, non publié : en attente de validation du commerçant",
  /** Information sur la collecte des avis, affichée sous le bandeau (art. L111-7-2 du Code de la consommation). */
  googleLink: "Voir la fiche Google",
  howTitle: "Comment ces avis sont recueillis",
  logosTitle: "Ils utilisent Rouelia dans leur commerce",
  logosLink: "Lire leurs avis",
  how: "Témoignages de commerçants qui utilisent Rouelia, relus et validés par écrit par chacun avant publication. Aucune contrepartie n'est accordée pour un témoignage, et aucun n'est modifié après validation. Une question ou une demande de retrait : contact@rouelia.fr.",
};

/** Ligne affichée sous le nom du commerce : métier et ville s'ils sont renseignés, sinon `trade`. */
export function reviewSubtitle(r: MerchantReview): string {
  if (!r.metier && !r.ville) return r.trade;
  return [r.metier ?? r.trade, r.ville].filter(Boolean).join(", ");
}
