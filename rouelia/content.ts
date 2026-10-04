/**
 * Rouelia : source unique de tous les textes, prix, hypothèses et paramètres.
 *
 * Règles de rédaction (voir DESIGN.md et le script scripts/check-copy.ts) :
 * pas de tiret de ponctuation, pas d'emoji, vouvoiement, aucun chiffre inventé,
 * aucune promesse de résultat. Les espaces avant « % », « € », « : » et « ? »
 * sont rendus insécables automatiquement à l'affichage.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type TradeId = "coiffeur" | "restaurant" | "institut" | "boulangerie" | "bar" | "autre";
export type PackId = "essentiel" | "croissance" | "premium";

export type PrizeIcon =
  | "ciseaux" | "flacon" | "goutte" | "etoile" | "pourcent" | "cadeau"
  | "cafe" | "verre" | "assiette" | "dessert" | "croissant" | "baguette"
  | "gateau" | "vernis" | "main" | "feuille" | "carte" | "coeur";

export interface Prize {
  name: string;
  icon: PrizeIcon;
  /** Coût estimé pour le commerçant, en euros. */
  cost: number;
  /** Probabilité en pourcentage. La somme d'un modèle vaut 100. */
  percent: number;
}

export interface Trade {
  id: TradeId;
  label: string;
  /** Nom d'exemple affiché dans la démo avant toute saisie. */
  sampleName: string;
  prizes: Prize[];
  simulator: {
    clientsPerDay: number;
    averageBasket: number;
    /** Part du panier qui reste au commerçant après achats, hors charges fixes. */
    grossMargin: number;
  };
}

/* ------------------------------------------------------------------ */
/* Marque, SEO                                                         */
/* ------------------------------------------------------------------ */

export const brand = {
  name: "Rouelia",
  url: "https://rouelia.fr",
  email: "contact@rouelia.fr",
  phone: "",
  founder: "Enzo",
  area: "Paris et petite couronne",
};

/**
 * Identité légale. Aymen exerce en entrepreneur individuel (micro-entreprise).
 * Les champs vides s'affichent « à compléter » et gardent le bandeau d'alerte sur les pages légales.
 */
export const company = {
  /** Nom et prénom de l'entrepreneur, suivis de la mention obligatoire « EI ». */
  owner: "Aymen Henni",
  form: "Entrepreneur individuel (EI), régime de la micro-entreprise",
  tradeName: "Rouelia",
  siren: "",
  address: "",
  publisher: "Aymen Henni",
  /** Franchise en base de TVA (art. 293 B du CGI). */
  vatExempt: true,
  vatMention: "TVA non applicable, art. 293 B du CGI",
  lastUpdate: "1er octobre 2026",
};

const missing = "[à compléter]";
const siren = company.siren || missing;
const address = company.address || missing;

export const host = {
  name: "Cloudflare, Inc.",
  address: "101 Townsend St, San Francisco, CA 94107, États-Unis",
  phone: "+1 650 319 8930",
  site: "cloudflare.com",
};

export const seo = {
  title: "Rouelia : la roue à cadeaux qui fait revenir vos clients",
  description:
    "Un QR code sur votre comptoir, une roue où chaque client gagne un cadeau à retirer à sa prochaine visite. Vous réglez les lots et leur coût. Essai gratuit de 14 jours.",
  ogTitle: "Vos clients gagnent un cadeau. Vous gagnez leur prochaine visite.",
  ogDescription:
    "La roue à cadeaux 100 % gagnante pour les coiffeurs, restaurants, instituts, boulangeries et bars. Prête en 5 minutes.",
  locale: "fr_FR",
};

/* ------------------------------------------------------------------ */
/* Navigation et appels à l'action                                     */
/* ------------------------------------------------------------------ */

export const cta = {
  primary: "Créer ma roue",
  secondary: "Voir les tarifs",
  trial: "Démarrer l'essai gratuit",
};

export const nav = {
  links: [
    { href: "#demo", label: "Démo" },
    { href: "#fonctionnement", label: "Comment ça marche" },
    { href: "#tarifs", label: "Tarifs" },
    { href: "#faq", label: "Questions" },
  ],
  menuOpen: "Ouvrir le menu",
  menuClose: "Fermer le menu",
  skipLink: "Aller au contenu",
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: "Pour les commerces de quartier",
  title: "Vos clients gagnent un cadeau. Vous gagnez leur prochaine visite.",
  titleAlternatives: [
    "Une roue sur le comptoir. Des clients qui reviennent.",
    "Un QR code, une roue, et une bonne raison de revenir chez vous.",
  ],
  lead: "Un QR code sur le comptoir. Une roue où chaque client gagne. Un cadeau qui le fait revenir.",
  reassurance: ["14 jours gratuits", "Sans carte bancaire", "100 % gagnant"],
  /** Étiquettes décoratives qui flottent autour de la roue. */
  floating: ["Brushing offert", "Café offert", "-10 % sur la coupe"],
  wheelLabel: "Exemple de roue Rouelia",
  spinHint: "Touchez la roue pour la faire tourner",
  heroPrizes: [
    "Soin offert",
    "Café offert",
    "-10 %",
    "Échantillon",
    "Dessert offert",
    "Brushing offert",
    "Croissant offert",
    "Surprise",
  ],
};

/* ------------------------------------------------------------------ */
/* Vidéo de présentation                                               */
/* ------------------------------------------------------------------ */

export const video = {
  eyebrow: "En vidéo",
  title: "Rouelia, vu par vos clients.",
  play: "Lancer la vidéo de présentation, avec le son",
  sound: "Avec le son",
  replay: "Revoir",
  endTitle: "À vous de jouer.",
  endNote: "14 jours gratuits, sans carte bancaire.",
  /** Fichiers dans /public/video. */
  mp4: "/video/rouelia-16x9.mp4",
  webm: "/video/rouelia-16x9.webm",
  poster: "/video/apercu-16x9.jpg",
};

/* ------------------------------------------------------------------ */
/* Bandeau de cadeaux                                                  */
/* ------------------------------------------------------------------ */

/** Bandeau des avantages pour le commerçant, sous la vidéo. */
export const advantages = {
  label: "Ce que vous y gagnez",
  items: ["14 jours d'essai gratuit", "Des clients fidélisés", "De nouveaux clients", "Plus d'avis Google", "Prêt en 5 minutes", "Sans engagement"],
};

/* ------------------------------------------------------------------ */
/* Démo interactive                                                    */
/* ------------------------------------------------------------------ */

export const demo = {
  eyebrow: "Démo gratuite, sans inscription",
  title: "Réglez votre roue. Tournez-la comme un client.",

  steps: {
    identity: "Votre commerce",
    look: "Couleurs et logo",
    prizes: "Vos lots",
  },

  fields: {
    name: { label: "Nom du commerce", placeholder: "Chez Martine" },
    trade: { label: "Votre métier" },
    logo: {
      label: "Logo",
      upload: "Choisir une image",
      replace: "Changer",
      remove: "Retirer le logo",
      none: "Je n'ai pas de logo",
      noneHelp: "On crée un visuel avec le nom de votre commerce.",
      privacy: "Votre image reste sur votre téléphone.",
      errorType: "Ce fichier n'est pas une image. Essayez un JPG, un PNG ou un SVG.",
      errorSize: "Cette image dépasse 5 Mo. Essayez une version plus légère.",
    },
    palette: { label: "Couleurs", custom: "Couleur principale au choix", customActive: "Couleur personnalisée" },
  },

  prizes: {
    count: (n: number) => `${n} lots sur la roue`,
    add: "Ajouter un lot",
    addDisabled: "8 lots maximum : au-delà, la roue devient illisible sur téléphone.",
    remove: (name: string) => `Retirer le lot ${name}`,
    removeDisabled: "3 lots minimum pour une vraie roue.",
    name: "Nom du lot",
    namePlaceholder: "Café offert",
    icon: "Image",
    iconUpload: "Photo du lot",
    iconRemovePhoto: "Retirer la photo",
    iconChoose: (name: string) => `Changer l'image du lot ${name}`,
    iconPanel: "Choisissez une icône ou ajoutez une photo",
    costSuffix: "€",
    percentSuffix: "%",
    percentSlider: (name: string) => `Chance de sortir pour ${name}`,
    locked: "Bloqué",
    lockShort: "Bloquer",
    minReached: "Il faut au moins 3 lots : modifiez-en un plutôt que de le retirer.",
    lockLimit: "Gardez au moins deux lots libres pour que les chances puissent s'ajuster.",
    cost: "Coût pour vous",
    percent: "Chance",
    newPrizeName: "Nouveau lot",
    total: "Total des chances",
    totalHint: "Les autres lots s'ajustent tout seuls.",
    lock: (name: string) => `Bloquer la chance de ${name}`,
    unlock: (name: string) => `Débloquer la chance de ${name}`,
  },

  cost: {
    label: "Coût moyen par partie",
    explain: "Ce que vous coûte un joueur, en moyenne.",
    ok: "Raisonnable pour un cadeau qui fait revenir un client.",
    warning: (threshold: string) =>
      `Au-dessus de ${threshold} par partie. C'est possible, mais baissez la chance des gros lots si vous voulez garder la main.`,
  },

  preview: {
    phoneLabel: "Aperçu de la roue sur le téléphone d'un client",
    tagline: "Tentez votre chance : chaque case est un cadeau.",
    test: "Tester comme un client",
    testHint: "Exactement ce que voit un client après le scan.",
    liveHint: "La roue suit vos réglages en direct.",
    loading: "Chargement de la démo",
    spin: "Tourner la roue",
    spinning: "La roue tourne",
    sound: { on: "Couper le son", off: "Activer le son" },
    restart: "Rejouer",
    backToSettings: "Revenir aux réglages",
  },

  recap: {
    title: "Votre roue est prête",
    prizes: "Lots",
    cost: "Coût moyen par partie",
    cta: "Choisir mon pack et démarrer l'essai",
    kept: "Elle vous attend dans votre compte.",
  },

  /** Seuil de l'alerte douce sur le coût moyen par partie, en euros. */
  costWarningThreshold: 3,
  minPrizes: 3,
  maxPrizes: 8,
  maxLogoSizeMb: 5,
};

/**
 * Fenêtre d'invitation à l'avis : reproduit le vrai produit à l'identique.
 * Ne pas modifier sans vérifier la conformité aux règles de Google :
 * texte neutre, croix de fermeture, roue qui tourne dans tous les cas.
 */
export const reviewPrompt = {
  text: "Votre avis compte beaucoup pour nous. Souhaitez-vous laisser un avis Google ?",
  button: "Laisser un avis",
  close: "Fermer",
  demoNotice: "Dans la vraie version, ce bouton ouvre votre fiche Google.",
};

export const winScreen = {
  title: "Bravo, vous avez gagné",
  prizeLabel: "Votre cadeau",
  codeLabel: "Votre code",
  deadlineLabel: "À retirer avant le",
  howTo: (shop: string) => `Montrez ce code en caisse lors de votre prochaine visite chez ${shop}.`,
  emailNote: "Dans la vraie version, le code est aussi envoyé par e-mail.",
  demoNotice: "Ceci est une démo, aucun cadeau réel.",
  announce: (prize: string) => `Vous avez gagné : ${prize}.`,
  codePrefix: "ROU",
  /** Durée de validité d'un cadeau, en jours. */
  validityDays: 30,
};

/* ------------------------------------------------------------------ */
/* Palettes de la roue                                                 */
/* ------------------------------------------------------------------ */

export const palettes = [
  { id: "tomette", label: "Tomette", colors: ["#C4401F", "#FBF6EE", "#F3B23C", "#2E6150"] },
  { id: "bistrot", label: "Bistrot", colors: ["#7A2233", "#F5EBDD", "#1F4D3F", "#D9A441"] },
  { id: "poudre", label: "Poudre", colors: ["#E7B4A6", "#FFF7F2", "#8A4B5C", "#F2D7C9"] },
  { id: "menthe", label: "Menthe", colors: ["#2E6150", "#EAF4EE", "#8FC7A8", "#1D1A16"] },
  { id: "nuit", label: "Nuit", colors: ["#1D1A16", "#F3B23C", "#3A332C", "#FBF6EE"] },
] as const;

/* ------------------------------------------------------------------ */
/* Métiers et modèles de lots                                          */
/* Les coûts sont des estimations de départ, à ajuster par le          */
/* commerçant. Chaque modèle totalise 100 %.                           */
/* ------------------------------------------------------------------ */

export const trades: Trade[] = [
  {
    id: "coiffeur",
    label: "Coiffeur, barbier",
    sampleName: "Salon Martine",
    prizes: [
      { name: "Soin profond offert", icon: "goutte", cost: 2.5, percent: 15 },
      { name: "-10 % sur la prochaine coupe", icon: "pourcent", cost: 3.5, percent: 20 },
      { name: "Échantillon de soin", icon: "flacon", cost: 0.8, percent: 30 },
      { name: "Diagnostic cheveux offert", icon: "ciseaux", cost: 1, percent: 20 },
      { name: "Coiffant format voyage", icon: "cadeau", cost: 2, percent: 10 },
      { name: "Brushing offert", icon: "etoile", cost: 6, percent: 5 },
    ],
    simulator: { clientsPerDay: 15, averageBasket: 35, grossMargin: 0.75 },
  },
  {
    id: "restaurant",
    label: "Restaurant, pizzeria",
    sampleName: "La Table de Karim",
    prizes: [
      { name: "Café offert", icon: "cafe", cost: 0.4, percent: 35 },
      { name: "Boisson offerte", icon: "verre", cost: 0.9, percent: 25 },
      { name: "Dessert offert", icon: "dessert", cost: 1.8, percent: 20 },
      { name: "Entrée offerte", icon: "assiette", cost: 2.5, percent: 12 },
      { name: "-10 % sur l'addition", icon: "pourcent", cost: 1.8, percent: 5 },
      { name: "Un repas offert", icon: "etoile", cost: 7, percent: 3 },
    ],
    simulator: { clientsPerDay: 60, averageBasket: 18, grossMargin: 0.65 },
  },
  {
    id: "institut",
    label: "Institut, esthétique",
    sampleName: "Institut Lina",
    prizes: [
      { name: "Échantillon de soin", icon: "flacon", cost: 0.8, percent: 30 },
      { name: "Pose de vernis offerte", icon: "vernis", cost: 2, percent: 25 },
      { name: "Massage des mains", icon: "main", cost: 3, percent: 20 },
      { name: "Sourcils offerts", icon: "etoile", cost: 2.5, percent: 10 },
      { name: "Gommage offert", icon: "feuille", cost: 4, percent: 10 },
      { name: "-15 % sur un soin", icon: "pourcent", cost: 6, percent: 5 },
    ],
    simulator: { clientsPerDay: 10, averageBasket: 50, grossMargin: 0.75 },
  },
  {
    id: "boulangerie",
    label: "Boulangerie, pâtisserie",
    sampleName: "Boulangerie du Marché",
    prizes: [
      { name: "Croissant offert", icon: "croissant", cost: 0.35, percent: 35 },
      { name: "Pain au chocolat offert", icon: "croissant", cost: 0.4, percent: 25 },
      { name: "Baguette offerte", icon: "baguette", cost: 0.3, percent: 20 },
      { name: "Part de flan offerte", icon: "dessert", cost: 0.8, percent: 12 },
      { name: "Tartelette offerte", icon: "gateau", cost: 1.5, percent: 6 },
      { name: "Gâteau du dimanche", icon: "etoile", cost: 6, percent: 2 },
    ],
    simulator: { clientsPerDay: 200, averageBasket: 6, grossMargin: 0.6 },
  },
  {
    id: "bar",
    label: "Bar, café",
    sampleName: "Le Comptoir",
    prizes: [
      { name: "Café offert", icon: "cafe", cost: 0.3, percent: 30 },
      { name: "Soft offert", icon: "verre", cost: 0.6, percent: 25 },
      { name: "Demi offert", icon: "verre", cost: 0.9, percent: 20 },
      { name: "Assiette d'olives", icon: "assiette", cost: 0.8, percent: 10 },
      { name: "Cocktail offert", icon: "etoile", cost: 2, percent: 10 },
      { name: "Planche à partager", icon: "coeur", cost: 3, percent: 5 },
    ],
    simulator: { clientsPerDay: 80, averageBasket: 9, grossMargin: 0.7 },
  },
  {
    id: "autre",
    label: "Autre commerce",
    sampleName: "Votre boutique",
    prizes: [
      { name: "-10 % sur le prochain achat", icon: "pourcent", cost: 2, percent: 30 },
      { name: "Petit cadeau surprise", icon: "cadeau", cost: 1, percent: 30 },
      { name: "Double tampon fidélité", icon: "carte", cost: 0.5, percent: 20 },
      { name: "Produit offert", icon: "coeur", cost: 3, percent: 15 },
      { name: "Le gros lot", icon: "etoile", cost: 15, percent: 5 },
    ],
    simulator: { clientsPerDay: 40, averageBasket: 20, grossMargin: 0.6 },
  },
];

/* ------------------------------------------------------------------ */
/* Comment ça marche : le parcours réel du client                      */
/* ------------------------------------------------------------------ */

export const howItWorks = {
  eyebrow: "Côté cliente, 20 secondes",
  title: "Sa coupe est finie. Voilà comment elle revient.",
  steps: [
    { title: "Elle scanne", text: "Le QR code posé sur votre comptoir." },
    { title: "Elle laisse un avis", text: "En quelques secondes, sur votre fiche Google." },
    { title: "Elle tourne, elle gagne", text: "Elle repart ravie, avec son cadeau." },
    { title: "Elle revient le chercher", text: "Et vous la revoyez au salon." },
  ],
};

/* ------------------------------------------------------------------ */
/* Preuve sociale                                                      */
/* ------------------------------------------------------------------ */

export const founder = {
  eyebrow: "Qui est derrière Rouelia",
  title: "Je viens installer la roue moi-même.",
  text: [
    "Je m'appelle Enzo. Chez les commerçants, j'entends toujours la même chose : les clients sont contents, mais ils ne reviennent pas assez.",
    "Rouelia rend ça simple. À Paris et en petite couronne, je la pose chez vous.",
  ],
  signature: "Enzo, fondateur de Rouelia",
  photoAlt: "Portrait d'Enzo, fondateur de Rouelia",
  /** Chemin de la photo dans /public. Vide tant qu'elle n'est pas fournie. */
  photo: "/enzo.jpg",
};

export interface PilotResult {
  enabled: boolean;
  shopName: string;
  trade: string;
  city: string;
  googleUrl: string;
  /** Date de l'accord écrit du commerçant pour publication. */
  consentDate: string;
  period: string;
  metrics: { label: string; value: string }[];
  quote?: string;
}

/**
 * Résultats des pilotes. Désactivés par défaut.
 * N'activer qu'avec des chiffres mesurés et l'accord écrit du commerçant.
 */
export const pilots: { title: string; note: string; googleLink: string; items: PilotResult[] } = {
  title: "Ce que la roue a donné chez nos premiers commerçants",
  note: "Chiffres mesurés dans Rouelia, publiés avec l'accord du commerçant.",
  googleLink: "Voir la fiche Google",
  items: [
    {
      enabled: false,
      shopName: "",
      trade: "",
      city: "",
      googleUrl: "",
      consentDate: "",
      period: "",
      metrics: [],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Tarifs                                                              */
/* ------------------------------------------------------------------ */

export interface Pack {
  id: PackId;
  name: string;
  price: number;
  tagline: string;
  highlights: string[];
  badge?: string;
}

export const pricing = {
  eyebrow: "Tarifs",
  title: "Un prix fixe par mois. Pas d'engagement.",
  lead: "14 jours gratuits sur chaque pack. Sans carte bancaire.",
  perMonth: "par mois",
  perDay: (amount: string) => `soit environ ${amount} par jour`,
  /** La ligne de rentabilité, reprise de la vidéo. Calcul : lib/simulator.ts (visitsToCoverPack). */
  profit: "Rentable dès 3 clients qui reviennent par mois.",
  profitNote: "Exemple : salon de coiffure, panier moyen 35 €, pack Croissance.",
  choose: (name: string) => `Essayer ${name}`,
  more: "Voir plus",
  less: "Voir moins",
  /** Nombre de points masqués par défaut sur chaque pack (dépliables avec « Voir plus »). */
  hiddenHighlights: 2,
  packs: [
    {
      id: "essentiel",
      name: "Essentiel",
      price: 29,
      tagline: "La roue, le QR code, les cadeaux.",
      highlights: [
        "Roue 100 % gagnante, lots et chances à votre main",
        "QR code et flyer PDF prêts à imprimer",
        "Code cadeau envoyé par e-mail, validé en caisse",
        "Modèles par métier et calculateur de coût",
        "Rapport hebdomadaire par e-mail",
      ],
    },
    {
      id: "croissance",
      name: "Croissance",
      price: 49,
      badge: "Le plus choisi",
      tagline: "Faire revenir, et répondre aux avis sans y passer la soirée.",
      highlights: [
        "Tout l'Essentiel",
        "Relances automatiques des cadeaux non retirés",
        "50 SMS par mois : rappels, relances, anniversaires",
        "Réponses aux avis en un clic",
        "Roues saisonnières et roue de parrainage",
        "Visio de configuration de 30 minutes offerte",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 89,
      tagline: "On s'occupe de tout. Et on surveille les voisins.",
      highlights: [
        "Tout Croissance, réponses aux avis illimitées",
        "200 SMS par mois",
        "Veille de 3 concurrents voisins",
        "Alerte avis négatif et analyse des avis",
        "Point mensuel de 15 minutes et audit de votre fiche Google",
        "Chevalet offert et support sous 24 h",
      ],
    },
  ] as Pack[],
  guarantee: {
    title: "Vous ne prenez aucun risque",
    items: [
      "Vous arrêtez en un clic, sans appeler personne.",
      "Si vous mettez votre compte en pause, les cadeaux déjà gagnés restent valables pour vos clients.",
    ],
  },
  printNote: "Chevalets et flyers imprimés disponibles à part, sur demande.",
  vatNote: company.vatExempt ? `Prix nets, sans TVA. ${company.vatMention}.` : "Prix hors taxes.",
  tableToggle: { open: "Comparer tous les détails", close: "Masquer le comparatif" },
  tableCaption: "Comparatif complet des packs Rouelia",
  /** Contenu du tableau complet. true = inclus, false = non inclus, texte = précision. */
  table: [
    { feature: "Roue 100 % gagnante, QR code, flyer PDF, personnalisation, lots et chances", values: [true, true, true] },
    { feature: "Cadeaux à retirer avec date limite, validation en caisse par code", values: [true, true, true] },
    { feature: "Code du cadeau envoyé", values: ["Par e-mail", "Par e-mail", "Par e-mail"] },
    { feature: "Modèles par métier, calculateur de coût des lots", values: [true, true, true] },
    { feature: "Mise en route guidée par IA", values: [true, true, true] },
    { feature: "Mise en route en ligne par vous", values: ["Gratuite", "Gratuite", "Gratuite"] },
    { feature: "Visio de configuration de 30 minutes", values: [false, "Offerte", "Offerte"] },
    { feature: "Installation sur place (Paris et petite couronne)", values: ["49 € (79 € si déplacement dédié)", "49 € (79 € si déplacement dédié)", "49 € (79 € si déplacement dédié)"] },
    { feature: "Rapport hebdomadaire", values: ["Par e-mail", "WhatsApp ou SMS, avec une action courte à faire", "WhatsApp ou SMS, avec une action détaillée à faire"] },
    { feature: "SMS inclus (rappels, relances, anniversaires)", values: ["0", "50 par mois", "200 par mois"] },
    { feature: "Relances automatiques du cadeau non retiré", values: [false, true, true] },
    { feature: "Réponses aux avis en un clic", values: [false, "Quota mensuel", "Illimitées"] },
    { feature: "Ajustement des lots par IA", values: [false, true, true] },
    { feature: "Roues saisonnières programmées, roue de parrainage", values: [false, true, true] },
    { feature: "Actions Instagram et Facebook, lien de réservation après le jeu", values: [false, true, true] },
    { feature: "Statistiques par employé (visibles par vous seul)", values: [false, true, true] },
    { feature: "Lots pour heures creuses, suivi de la rentabilité", values: [false, false, true] },
    { feature: "Analyse IA des avis, alerte avis négatif", values: [false, false, true] },
    { feature: "Point mensuel de 15 minutes, audit de la fiche Google", values: [false, false, true] },
    { feature: "Veille de 3 concurrents voisins (note et nombre d'avis)", values: [false, false, true] },
    { feature: "Refonte de la roue à chaque saison, faite par nous", values: [false, false, true] },
    { feature: "Kit de bienvenue (chevalet offert), support prioritaire sous 24 h", values: [false, false, true] },
    { feature: "Sans mention « Propulsé par Rouelia », domaine personnalisé", values: [false, false, true] },
  ] as { feature: string; values: (boolean | string)[] }[],
  featureColumn: "Fonction",
  included: "Inclus",
  notIncluded: "Non inclus",
};

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const faq = {
  eyebrow: "Questions fréquentes",
  title: "Ce qu'on nous demande au comptoir",
  items: [
    {
      q: "La roue est-elle vraiment 100 % gagnante ?",
      a: "Oui. Chaque case est un cadeau que vous choisissez. Il n'y a aucune case perdante.",
    },
    {
      q: "Le cadeau est-il donné en échange d'un avis ?",
      a: "Non. La roue tourne dans tous les cas. L'avis reste facultatif, comme l'exigent les règles de Google.",
    },
    {
      q: "Combien me coûtent les cadeaux ?",
      a: "Ce que vous décidez. Vous fixez chaque lot et sa chance, et Rouelia affiche en direct le coût moyen d'une partie.",
    },
    {
      q: "Faut-il du matériel ?",
      a: "Non. Un QR code imprimé suffit. Vos clients jouent sur leur téléphone, sans appli.",
    },
    {
      q: "Et après les 14 jours d'essai ?",
      a: "Vous continuez en ajoutant un moyen de paiement, ou vous arrêtez. Rien n'est prélevé sans votre accord, et vous pouvez arrêter en un clic.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Roue d'offres Rouelia (dernière section)                            */
/* 100 % gagnante. Cadeaux valables sur Croissance et Premium,         */
/* jamais sur l'Essentiel. Logique dans lib/offers.ts.                 */
/* ------------------------------------------------------------------ */

export type OfferId =
  | "essai_21"
  | "installation"
  | "flyers"
  | "audit"
  | "moitie_1er_mois"
  | "premium_prix_croissance"
  | "mois_offert";

export interface Offer {
  id: OfferId;
  /** Nom complet, affiché après le tirage et à l'inscription. */
  label: string;
  /** Nom court dessiné sur la roue. */
  short: string;
  icon: PrizeIcon;
  /** Chance de sortir, en pourcentage. Le total vaut 100. */
  percent: number;
}

export const offerWheel = {
  title: "Avant de partir, tournez la roue Rouelia.",
  text: "Chaque case est un cadeau pour démarrer, valable sur Croissance et Premium.",
  wheelLabel: "Roue d'offres Rouelia",
  spinHint: "Touchez la roue pour tenter votre chance",
  spinning: "La roue tourne",
  won: "Gagné",
  codeLabel: "Votre code",
  activate: "Créez votre compte pour activer votre cadeau (valable 7 jours)",
  validUntil: (date: string) => `Valable jusqu'au ${date}, sur Croissance et Premium.`,
  cta: "Créer mon compte",
  expired: "Votre cadeau a expiré. Vous pouvez retenter votre chance.",
  error: "Le tirage n'a pas fonctionné. Vérifiez votre connexion et réessayez.",
  rules: "Un seul tirage, gardé 7 jours sur cet appareil. Un cadeau par compte, non cumulable, non échangeable contre de l'argent.",
  /** Durée de validité du cadeau, en jours. */
  validityDays: 7,
  codePrefix: "OFF",
  offers: [
    { id: "essai_21", label: "Essai prolongé à 21 jours", short: "Essai de 21 jours", icon: "etoile", percent: 28 },
    { id: "installation", label: "Installation sur place offerte", short: "Installation offerte", icon: "main", percent: 24 },
    { id: "flyers", label: "Flyers imprimés offerts", short: "Flyers offerts", icon: "carte", percent: 22 },
    { id: "audit", label: "Audit de votre fiche Google offert", short: "Audit Google offert", icon: "feuille", percent: 17 },
    { id: "moitie_1er_mois", label: "-50 % le premier mois", short: "-50 % le 1er mois", icon: "pourcent", percent: 5 },
    { id: "premium_prix_croissance", label: "Premium au prix de Croissance le premier mois", short: "Premium au prix Croissance", icon: "coeur", percent: 3 },
    { id: "mois_offert", label: "Premier mois offert", short: "1er mois offert", icon: "cadeau", percent: 1 },
  ] as Offer[],
  /** Textes de la fenêtre d'inscription selon le pack choisi. */
  signup: {
    applied: (label: string) => `Votre cadeau : ${label}. Il sera appliqué à votre compte.`,
    code: (code: string, date: string) => `Code ${code}, valable jusqu'au ${date}.`,
    essentiel: "Votre cadeau est valable sur Croissance et Premium. Passez à Croissance pour l'activer.",
    toCroissance: "Passer à Croissance",
    needsPremium: "Votre cadeau s'applique au pack Premium : vous le payez au prix de Croissance le premier mois. Passez à Premium pour l'activer.",
    toPremium: "Passer à Premium",
    auditInPremium: "L'audit de votre fiche Google est déjà inclus dans Premium. Votre cadeau devient : installation sur place offerte.",
    installationArea: "Installation à Paris et en petite couronne.",
    success: (label: string) => `Votre cadeau « ${label} » est enregistré avec votre compte.`,
  },
};

/* ------------------------------------------------------------------ */
/* Appel final et pied de page                                         */
/* ------------------------------------------------------------------ */

export const finalCta = {
  title: "Votre roue est à deux minutes d'ici.",
  text: "Réglez vos lots, testez, posez le QR code demain.",
  button: cta.primary,
  note: "14 jours gratuits, sans carte bancaire.",
};

export const footer = {
  tagline: "La roue à cadeaux des commerces de quartier.",
  links: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/cgv", label: "CGV" },
    { href: "/confidentialite", label: "Confidentialité" },
    { href: `mailto:${brand.email}`, label: "Contact" },
  ],
  cookies: "Gérer les cookies",
  copyright: (year: number) => `© ${year} Rouelia`,
};

/* ------------------------------------------------------------------ */
/* Inscription                                                         */
/* ------------------------------------------------------------------ */

export const signup = {
  title: "Démarrer mon essai gratuit",
  lead: "Deux minutes, sans carte bancaire. Votre roue est déjà prête.",
  fields: {
    firstName: { label: "Prénom", autocomplete: "given-name" },
    email: { label: "E-mail", autocomplete: "email" },
    phone: { label: "Téléphone", prefix: "+33", placeholder: "6 12 34 56 78", autocomplete: "tel-national", help: "Pour vous envoyer votre rapport et vous aider à démarrer." },
    shopName: { label: "Nom de votre établissement", help: "Tel qu'il apparaît sur Google." },
    logo: { label: "Logo", none: "Je n'ai pas de logo" },
    pack: { label: "Pack choisi" },
  },
  consent:
    "J'accepte que Rouelia utilise ces informations pour créer mon compte d'essai et me contacter à ce sujet. Je peux retirer mon accord à tout moment en écrivant à contact@rouelia.fr.",
  info:
    "Vos données servent uniquement à créer votre compte et à vous accompagner pendant l'essai. Elles ne sont ni vendues ni partagées.",
  privacyLink: "Lire notre politique de confidentialité",
  errors: {
    firstName: "Indiquez votre prénom, c'est pour savoir comment vous appeler.",
    emailMissing: "Il nous faut votre e-mail pour vous envoyer l'accès.",
    emailInvalid: "Cet e-mail semble incomplet. Vérifiez qu'il contient bien un @ et un point.",
    phoneMissing: "Indiquez un numéro pour qu'on puisse vous aider à démarrer.",
    phoneInvalid: "Ce numéro ne ressemble pas à un numéro français. Exemple : 6 12 34 56 78.",
    shopName: "Indiquez le nom de votre établissement.",
    consent: "Cochez la case pour qu'on puisse créer votre compte.",
    summary: "Il manque quelques informations, elles sont indiquées en rouge.",
    server: "L'envoi n'a pas fonctionné. Vérifiez votre connexion et réessayez.",
  },
  submit: "Créer mon compte d'essai",
  submitting: "Création en cours",
  success: {
    title: "C'est noté, merci.",
    text: (firstName: string) =>
      `${firstName}, votre demande est enregistrée avec votre roue. On vous écrit très vite pour ouvrir votre accès.`,
    close: "Revenir au site",
  },
  close: "Fermer",
};

/* ------------------------------------------------------------------ */
/* Consentement cookies                                                */
/* ------------------------------------------------------------------ */

export const cookieBanner = {
  label: "Choix des cookies",
  text:
    "Nous aimerions mesurer l'audience de ce site pour l'améliorer. Rien n'est déposé sans votre accord.",
  accept: "Accepter",
  refuse: "Refuser",
  more: "En savoir plus",
};

/* ------------------------------------------------------------------ */
/* Pages légales                                                       */
/* ------------------------------------------------------------------ */

export const legal = {
  /** Affiché tant qu'une information légale obligatoire manque. */
  draftNotice: "Certaines informations légales sont encore à compléter (SIREN, adresse).",
  complete: !!(company.siren && company.address),
  back: "Retour à l'accueil",
  updated: `Dernière mise à jour : ${company.lastUpdate}.`,
  pages: {
    mentions: {
      title: "Mentions légales",
      description: "Éditeur, hébergeur et contact du site Rouelia.",
      sections: [
        {
          h: "Éditeur du site",
          p: [
            `Le site rouelia.fr est édité par ${company.owner}, ${company.form}, exerçant sous le nom commercial ${company.tradeName}.`,
            `SIREN : ${siren}. Adresse : ${address}.`,
            `${company.vatMention}.`,
            `Directeur de la publication : ${company.publisher}.`,
            `Contact : ${brand.email}.`,
          ],
        },
        {
          h: "Hébergement",
          p: [
            `Le site et la base des inscriptions sont hébergés par ${host.name}, ${host.address}. Téléphone : ${host.phone}. ${host.site}.`,
          ],
        },
        {
          h: "Propriété intellectuelle",
          p: [
            "Les textes, visuels et le logotype Rouelia sont protégés. Toute reproduction sans accord écrit est interdite.",
          ],
        },
        {
          h: "Données personnelles",
          p: ["Le traitement de vos données est décrit dans notre politique de confidentialité."],
        },
      ],
    },
    confidentialite: {
      title: "Politique de confidentialité",
      description: "Comment Rouelia collecte et protège vos données.",
      sections: [
        {
          h: "Qui est responsable de vos données",
          p: [
            `${company.owner}, ${company.form}, exerçant sous le nom ${company.tradeName}, ${address}, joignable à ${brand.email}, est responsable des traitements décrits ici.`,
          ],
        },
        {
          h: "La démo du site",
          p: [
            "La démo fonctionne entièrement dans votre navigateur. Le nom, les lots et le logo que vous saisissez restent sur votre appareil, dans le stockage local, pour que vous retrouviez votre roue. Rien n'est envoyé tant que vous ne créez pas de compte.",
          ],
        },
        {
          h: "La roue d'offres",
          p: [
            "Le tirage est fait par notre serveur, sans aucune donnée personnelle. Le cadeau gagné et son code sont gardés 7 jours dans le stockage local de votre navigateur, puis effacés. Ils ne nous sont transmis que si vous créez un compte.",
          ],
        },
        {
          h: "L'inscription à l'essai",
          p: [
            "Nous collectons votre prénom, votre e-mail, votre téléphone, le nom de votre établissement, le pack choisi, la configuration de votre roue, le cadeau éventuellement gagné et la page d'où vous venez.",
            "Finalité : créer votre compte d'essai et vous accompagner. Base légale : votre consentement, puis l'exécution du contrat si vous devenez client.",
            "Durée de conservation : 3 ans après le dernier contact si vous ne devenez pas client. Si vous devenez client, pendant toute la durée de l'abonnement puis 5 ans. Les factures sont gardées 10 ans, comme l'exige la loi.",
          ],
        },
        {
          h: "Qui a accès à vos données",
          p: [
            `Seul ${company.owner} a accès à vos données. Elles ne sont ni vendues ni louées.`,
            `Hébergement : ${host.name} (États-Unis) héberge le site et la base des inscriptions. Ce transfert hors de l'Union européenne est encadré par le cadre de protection des données UE et États-Unis (Data Privacy Framework) et par les clauses contractuelles types de la Commission européenne.`,
            "Envoi des e-mails : Brevo (Sendinblue SAS, 106 boulevard Haussmann, 75008 Paris, France) envoie les e-mails du service : accusé de réception, accès à votre espace, fin d'essai, rapport hebdomadaire, et pour vos clients le code gagné et son rappel.",
          ],
        },
        {
          h: "Les données de vos clients",
          p: [
            "Quand vos clients jouent, Rouelia agit comme sous-traitant pour votre compte. Ils ne sont recontactés que s'ils l'ont accepté, et chaque message contient un lien de désinscription.",
          ],
        },
        {
          h: "Cookies et stockage local",
          p: [
            "Aucun traceur publicitaire. Le site garde dans votre navigateur votre choix sur les cookies, votre roue de démo et le cadeau de la roue d'offres : ces éléments servent seulement au fonctionnement du site et ne demandent pas d'accord.",
            "Une mesure d'audience ne peut être activée qu'après votre accord. Vous pouvez changer d'avis à tout moment via le lien « Gérer les cookies » en bas de page.",
          ],
        },
        {
          h: "Vos droits",
          p: [
            `Vous pouvez accéder à vos données, les rectifier, les supprimer, les récupérer, vous opposer à leur traitement ou retirer votre consentement en écrivant à ${brand.email}. Nous répondons sous un mois. Vous pouvez aussi saisir la CNIL (cnil.fr).`,
          ],
        },
      ],
    },
    cgv: {
      title: "Conditions générales de vente",
      description: "Conditions de l'abonnement Rouelia.",
      sections: [
        {
          h: "Objet",
          p: [
            `Les présentes conditions encadrent l'abonnement au service Rouelia, vendu par ${company.owner}, ${company.form} (SIREN : ${siren}), à des professionnels.`,
          ],
        },
        {
          h: "Essai gratuit",
          p: [
            "Chaque pack commence par un essai gratuit de 14 jours, sans moyen de paiement. À la fin de l'essai, l'abonnement ne démarre que si vous ajoutez un moyen de paiement.",
          ],
        },
        {
          h: "Prix et paiement",
          p: [
            `Les prix sont indiqués en euros, par mois, sans engagement. ${company.vatMention} : les prix affichés sont ceux que vous payez. Essentiel : 29 €. Croissance : 49 €. Premium : 89 €.`,
            "L'installation sur place est facturée 49 €, ou 79 € si le déplacement est fait uniquement pour vous, à Paris et en petite couronne.",
            "L'abonnement se paie chaque mois, d'avance. Une facture est émise pour chaque paiement.",
          ],
        },
        {
          h: "Résiliation et pause",
          p: [
            "Vous pouvez arrêter à tout moment, sans frais ni préavis. L'arrêt prend effet à la fin du mois déjà payé, qui n'est pas remboursé. Les cadeaux déjà gagnés par vos clients restent utilisables jusqu'à leur date limite.",
          ],
        },
        {
          h: "Cadeaux de la roue d'offres Rouelia",
          p: [
            "La roue d'offres du site est gagnante à chaque tirage. Le cadeau est valable 7 jours, sur les packs Croissance et Premium uniquement, jamais sur l'Essentiel. Un seul cadeau par commerce, non cumulable et non échangeable contre de l'argent.",
            "Les réductions (-50 %, Premium au prix de Croissance, premier mois offert) portent sur le premier mois payant, après l'essai. L'essai prolongé porte la durée de l'essai à 21 jours.",
            "L'installation sur place offerte est réservée à Paris et à la petite couronne. Avec le pack Premium, qui inclut déjà l'audit de la fiche Google, le cadeau « audit offert » est remplacé par l'installation sur place offerte.",
          ],
        },
        {
          h: "Règles du jeu et avis Google",
          p: [
            "La roue est gagnante à chaque partie. L'invitation à laisser un avis est facultative, identique pour tous et sans lien avec le cadeau. Le commerçant s'engage à ne pas modifier ce fonctionnement.",
          ],
        },
        {
          h: "Responsabilité",
          p: [
            "Le commerçant fixe ses lots et en assume le coût. Rouelia ne garantit aucun nombre d'avis, aucune note et aucun chiffre d'affaires.",
          ],
        },
        {
          h: "Droit applicable",
          p: [
            "Les présentes conditions sont soumises au droit français. En cas de désaccord, nous cherchons d'abord une solution amiable ; à défaut, le litige est porté devant les tribunaux compétents.",
          ],
        },
      ],
    },
  },
};

/* ------------------------------------------------------------------ */
/* Rareté : désactivée tant qu'elle n'est pas réelle                   */
/* ------------------------------------------------------------------ */

export const scarcity = {
  enabled: false,
  text: "",
};

/* ------------------------------------------------------------------ */
/* Petits libellés d'interface                                         */
/* ------------------------------------------------------------------ */

export const ui = {
  step: (n: number) => `Étape ${n}`,
  won: (prize: string) => `Gagné : ${prize}`,
  illustrations: {
    standTitle: "Tentez votre chance",
    giftCode: "Code cadeau",
    validated: "Validé en caisse",
  },
  packsLabel: "Inclus dans",
  mainNav: "Navigation principale",
  homeLink: "Rouelia, retour en haut de page",
  legalNav: "Liens légaux",
  close: "Fermer",
};

export const notFound = {
  title: "Cette page n'existe pas",
  text: "Le lien est peut-être ancien. La roue, elle, vous attend sur la page d'accueil.",
  back: "Revenir à l'accueil",
};

/* ------------------------------------------------------------------ */
/* Espace admin (réservé à Aymen)                                      */
/* ------------------------------------------------------------------ */

export const admin = {
  title: "Inscriptions",
  login: {
    title: "Espace admin",
    password: "Mot de passe",
    submit: "Se connecter",
    show: "Afficher le mot de passe",
    hide: "Masquer le mot de passe",
    wrong: "Mot de passe incorrect.",
    tooMany: "Trop d'essais. Patientez 15 minutes.",
    notConfigured: "Le mot de passe n'est pas encore réglé sur l'hébergement (variable ADMIN_PASSWORD).",
    failed: "La connexion a échoué. Réessayez.",
  },
  logout: "Se déconnecter",
  refresh: "Actualiser",
  export: "Exporter (Excel)",
  search: "Rechercher : prénom, commerce, e-mail, téléphone",
  loading: "Chargement des inscriptions",
  empty: "Aucune inscription pour l'instant. Elles apparaîtront ici dès qu'un commerçant démarre son essai.",
  noResult: "Aucun résultat.",
  memoryWarning: "Base de données non connectée : les inscriptions ne sont pas conservées. Vérifiez la liaison D1 nommée DB (voir DEPLOIEMENT.md).",
  counts: { total: "Inscriptions", pending: "Essais à ouvrir", active: "Essais en cours", clients: "Clients" },
  statuses: { essai_en_attente: "Essai à ouvrir", essai_en_cours: "Essai en cours", client: "Client", perdu: "Perdu" },
  statusLabel: "Statut",
  wheel: "Roue configurée",
  avgCost: "coût moyen par partie",
  source: "Arrivé par",
  direct: "Accès direct",
  call: "Appeler",
  mail: "Écrire",
  remove: "Supprimer",
  confirmRemove: (name: string) => `Supprimer définitivement l'inscription de ${name} ? Cette action est irréversible.`,
  logo: "Logo envoyé",
  offer: {
    title: "Cadeau de la roue",
    status: {
      applied: "À appliquer",
      needs_croissance: "Non appliqué : pack Essentiel",
      needs_premium: "Non appliqué : valable en Premium",
    },
    substituted: "audit remplacé par l'installation (Premium)",
    until: (date: string) => `valable jusqu'au ${date}`,
  },
};
