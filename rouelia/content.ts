/**
 * Rouelia : source unique de tous les textes, prix, hypothèses et paramètres.
 *
 * Règles de rédaction (voir DESIGN.md et le script scripts/check-copy.ts) :
 * pas de tiret de ponctuation, pas d'emoji, vouvoiement, aucun chiffre inventé,
 * aucune promesse de résultat. Les espaces avant « % », « € », « : » et « ? »
 * sont rendus insécables automatiquement à l'affichage.
 */

import { EMAIL, whatsappUrl } from "@/config";

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
  email: EMAIL,
  phone: "",
  whatsapp: whatsappUrl(),
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
  lastUpdate: "8 octobre 2026",
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
    "Un QR code sur le comptoir, une roue où chaque client gagne un cadeau pour sa prochaine visite. Vous réglez lots et coût. Essai gratuit de 14 jours.",
  ogTitle: "Offrez un jeu à vos clients. Ils reviennent.",
  ogDescription:
    "La roue à cadeaux 100 % gagnante pour les coiffeurs, restaurants, instituts, boulangeries et bars. Prête en 5 minutes.",
  locale: "fr_FR",
};

/* ------------------------------------------------------------------ */
/* Navigation et appels à l'action                                     */
/* ------------------------------------------------------------------ */

export const cta = {
  primary: "Créer ma roue",
  /** Tous les boutons « Créer ma roue » mènent à cette page. */
  href: "/creer-ma-roue",
  secondary: "Voir les tarifs",
  trial: "Démarrer l'essai gratuit",
  call: "Réserver un appel gratuit de 5 minutes",
  callShort: "Réserver un appel",
  callHref: "/rendez-vous",
  whatsapp: "Écrire sur WhatsApp",
  email: "Écrire un e-mail",
};

export const nav = {
  links: [
    { href: "/#fonctionnement", label: "Comment ça marche" },
    { href: "/pour-qui", label: "Pour qui ?" },
    { href: "/tarifs", label: "Tarifs" },
    { href: "/faq", label: "FAQ" },
    { href: "/blog", label: "Blog" },
    { href: "/a-propos", label: "À propos" },
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
  title: "Offrez un jeu à vos clients. Ils reviennent.",
  /**
   * Sous-titre retenu face à « Un QR code sur le comptoir. Une roue où chaque client gagne. Un cadeau qui le fait
   * revenir. » : plus court, il dit ce que gagnent le client et le commerçant, sans aucun lien avec les avis.
   */
  lead: "Vos clients gagnent un cadeau. Vous gagnez leur prochaine visite.",
  reassurance: ["14 jours gratuits", "Sans carte bancaire", "Sans engagement"],
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
  caption: "Rouelia en vidéo",
  /** Titre court au-dessus de la vidéo (H2 : le seul H1 reste celui du haut de page). */
  title: "Voyez la roue en action.",
  summaryToggle: "Lire le résumé de la vidéo",
  /** Résumé texte : la vidéo n'est lue ni par Google ni par les IA. */
  summary: [
    "Un commerçant pose un QR code sur son comptoir. Son client le scanne avec son téléphone, sans application.",
    "Le client tourne une roue où chaque case est un cadeau : un brushing, un dessert, une réduction. Son cadeau l'attend lors de sa prochaine visite, avec un code à montrer en caisse.",
    "Le commerçant règle lui-même ses lots, leurs chances et leur coût. Partager son avis reste proposé au client, de façon facultative, sans lien avec le cadeau.",
    "Rouelia s'installe en 5 minutes, avec 14 jours d'essai gratuit et sans engagement.",
  ],
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
  items: ["14 jours d'essai gratuit", "Plus de clients fidèles", "De nouveaux clients", "Prêt en 5 minutes", "Sans engagement", "Sans appli à installer"],
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
 * Invitation à l'avis : reproduit le vrai produit à l'identique (components/jeu/ShopGame.tsx).
 * Règles de conformité (Google et Code de la consommation), à ne jamais changer :
 * proposée APRÈS le gain, à tous les joueurs, sans condition, sans tri selon la note, texte neutre.
 */
export const reviewPrompt = {
  title: "Partager votre avis, c'est facultatif",
  text: "Votre cadeau est déjà à vous, quoi que vous fassiez.",
  button: "Partager mon avis sur Google",
  close: "Fermer",
  demoNotice: "Dans la vraie version, ce lien ouvre votre fiche Google.",
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
  eyebrow: "Comment ça marche",
  title: "Trois gestes, et votre client a une raison de revenir.",
  answer: "Le client scanne le QR code posé sur votre comptoir, tourne la roue sur son téléphone et gagne un cadeau à utiliser lors de sa prochaine visite.",
  steps: [
    { title: "Le client scanne le QR code", text: "Posé sur votre comptoir. Avec son téléphone, sans appli." },
    { title: "Il joue", text: "Il tourne la roue. Chaque case est un cadeau." },
    { title: "Il gagne un cadeau pour sa prochaine visite", text: "Son code l'attend en caisse. Et vous le revoyez." },
  ],
};

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  eyebrow: "Contact",
  title: "Une question ? Parlons-en.",
  text: "Une vraie personne vous répond, par WhatsApp, par e-mail ou au téléphone.",
};

/* ------------------------------------------------------------------ */
/* Preuve sociale                                                      */
/* ------------------------------------------------------------------ */

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
  /** Accroche « Idéal pour... ». */
  tagline: string;
  /** Bénéfices pour le commerçant (pas une liste de fonctions). */
  highlights: string[];
  /** Les fonctions, en petit sous les bénéfices. */
  features: string;
  badge?: string;
}

export const pricing = {
  eyebrow: "Tarifs",
  title: "Un prix fixe par mois. Pas d'engagement.",
  lead: "14 jours gratuits sur chaque pack. Sans carte bancaire.",
  perMonth: "par mois",
  perMonthShort: "/ mois",
  perDay: (amount: string) => `soit environ ${amount} par jour`,
  /** La ligne de rentabilité, reprise de la vidéo. Calcul : lib/simulator.ts (visitsToCoverPack). */
  profit: "Rentable dès 3 clients qui reviennent par mois.",
  profitNote: "Exemple : salon de coiffure, panier moyen 35 €, pack Croissance.",
  choose: (name: string) => `Essayer ${name}`,
  more: "Voir plus",
  less: "Voir moins",
  featuresLabel: "Inclus :",
  details: "Tous les détails des tarifs",
  /** Nombre de points masqués par défaut sur chaque pack (dépliables avec « Voir plus »). */
  hiddenHighlights: 2,
  /** Sur téléphone : nombre de points visibles par pack avant « Voir plus ». */
  mobileHighlights: 2,
  moreMobile: "Voir tous les avantages et le détail",
  packs: [
    {
      id: "essentiel",
      name: "Essentiel",
      price: 29,
      tagline: "Idéal pour démarrer seul, en 5 minutes.",
      highlights: [
        "Vos clients repartent avec une raison de revenir",
        "Un cadeau valable à la prochaine visite fait revenir vos clients",
        "Vous gardez la main sur le coût de chaque cadeau",
        "Un client de plus par mois peut suffire à le rembourser",
      ],
      features: "Roue 100 % gagnante, QR code, chevalet et flyer à imprimer, codes validés en caisse, code envoyé par e-mail, suivi des parties.",
    },
    {
      id: "croissance",
      name: "Croissance",
      price: 49,
      badge: "Recommandé",
      tagline: "Idéal pour faire revenir vos clients plus souvent.",
      highlights: [
        "Remboursé dès 3 clients qui reviennent par mois",
        "Vos clients sont prévenus avant que leur cadeau expire",
        "Vos habitués font venir leurs amis grâce au parrainage",
        "Votre roue change avec les saisons, sans y penser",
        "Vous répondez à vos avis en un clic, sans y passer la soirée",
      ],
      features: "Tout l'Essentiel, rappel par e-mail, parrainage, roues saisonnières, réservation et réseaux sociaux après le jeu, statistiques par employé, 30 réponses aux avis par IA par mois, visio de configuration offerte.",
    },
    {
      id: "premium",
      name: "Premium",
      price: 89,
      tagline: "Idéal si vous voulez qu'on s'occupe de tout.",
      highlights: [
        "On refait votre roue à chaque saison, pour vous",
        "Vos heures creuses se remplissent avec des lots dédiés",
        "Vous voyez chaque mois ce que la roue vous rapporte",
        "Un point chaque mois et un audit de votre fiche Google",
        "Un chevalet offert et une réponse sous 24 h",
      ],
      features: "Tout Croissance, lots pour heures creuses, suivi de la rentabilité, réponses aux avis par IA illimitées, point mensuel de 15 minutes, audit de fiche Google, sans mention « Propulsé par Rouelia ».",
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
    { feature: "Mise en route en ligne par vous", values: ["Gratuite", "Gratuite", "Gratuite"] },
    { feature: "Visio de configuration de 30 minutes", values: [false, "Offerte", "Offerte"] },
    { feature: "Installation sur place (Paris et petite couronne)", values: ["49 € (79 € si déplacement dédié)", "49 € (79 € si déplacement dédié)", "49 € (79 € si déplacement dédié)"] },
    { feature: "Rapport hebdomadaire par e-mail, avec une action à faire", values: [true, true, true] },
    { feature: "Rappel par e-mail avant la date limite du cadeau", values: [false, true, true] },
    { feature: "Réponses aux avis en un clic", values: [false, "Quota mensuel", "Illimitées"] },
    { feature: "Roues saisonnières programmées, roue de parrainage", values: [false, true, true] },
    { feature: "Actions Instagram et Facebook, lien de réservation après le jeu", values: [false, true, true] },
    { feature: "Statistiques par employé (visibles par vous seul)", values: [false, true, true] },
    { feature: "Lots pour heures creuses, suivi de la rentabilité", values: [false, false, true] },
    { feature: "Point mensuel de 15 minutes, audit de la fiche Google", values: [false, false, true] },
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
  all: "Voir toutes les questions",
  items: [
    {
      q: "Comment fidéliser ses clients avec un jeu en boutique ?",
      a: "Offrez un cadeau à utiliser lors de la prochaine visite. Avec Rouelia, le client scanne un QR code, tourne la roue et repart avec une bonne raison de revenir.",
    },
    {
      q: "Mes clients vont-ils vraiment jouer ?",
      a: "Jouer prend quelques secondes, sans appli : un prénom, un numéro, et la roue tourne. Chaque case est un cadeau, votre client n'a rien à perdre. Le plus important est de le proposer : le QR code bien visible sur le comptoir, et un mot au moment de payer. Votre espace affiche chaque jour le nombre de parties, pour voir ce qui marche chez vous.",
    },
    {
      q: "Une roue à gagner est-elle autorisée ?",
      a: "Un jeu gratuit, sans obligation d'achat et avec un règlement accessible est en principe autorisé. Rouelia prévoit un règlement pour chaque commerce. Le détail est sur la page [utilisation responsable](/utilisation-responsable).",
    },
    {
      q: "Le cadeau dépend-il d'un avis Google ?",
      a: "Non, jamais. Le cadeau est remis quoi que fasse le client. Partager son avis lui est ensuite proposé, de façon facultative.",
    },
    {
      q: "Combien me coûtent les cadeaux ?",
      a: "Ce que vous décidez. Vous fixez chaque lot et sa chance, et Rouelia affiche en direct le coût moyen d'une partie.",
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

/** Message d'accueil des visiteurs venus de la roue d'un commerçant (lien « Propulsé par Rouelia », ?ref=roue). */
export const fromWheel = {
  title: "Vous venez de jouer ?",
  text: "La même roue peut tourner dans votre commerce : voici comment.",
  button: "Voir comment ça marche",
  href: "#fonctionnement",
  close: "Fermer ce message",
};

export const finalCta = {
  title: "Votre roue est à deux minutes d'ici.",
  text: "Réglez vos lots, testez, posez le QR code demain.",
  button: cta.primary,
  note: "14 jours gratuits, sans carte bancaire.",
};

export const footer = {
  tagline: "La roue à cadeaux des commerces de quartier.",
  groups: [
    {
      title: "Rouelia",
      links: [
        { href: "/#fonctionnement", label: "Comment ça marche" },
        { href: "/pour-qui", label: "Pour qui ?" },
        { href: "/tarifs", label: "Tarifs" },
        { href: "/creer-ma-roue", label: "Créer ma roue" },
        { href: "/a-propos", label: "À propos" },
        { href: "/comparatif", label: "Roue, carte ou appli ?" },
        { href: "/blog", label: "Blog" },
        { href: "/faq", label: "FAQ" },
      ],
    },
    {
      title: "Métiers",
      links: [
        { href: "/jeu-fidelisation-coiffeur", label: "Coiffeurs et barbiers" },
        { href: "/jeu-fidelisation-restaurant", label: "Restaurants" },
        { href: "/jeu-fidelisation-institut-beaute", label: "Instituts de beauté" },
        { href: "/jeu-fidelisation-boulangerie", label: "Boulangeries" },
      ],
    },
    {
      title: "Contact",
      links: [
        { href: "/rendez-vous", label: "Réserver un appel" },
        { href: brand.whatsapp, label: "WhatsApp" },
        { href: `mailto:${brand.email}`, label: brand.email },
      ],
    },
  ],
  links: [
    { href: "/utilisation-responsable", label: "Utilisation responsable" },
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/cgv", label: "CGV" },
    { href: "/confidentialite", label: "Confidentialité" },
    { href: "/cookies", label: "Cookies" },
  ],
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
  next: "nous validons votre inscription et vous envoyons votre accès par e-mail, en général en quelques minutes (24 h maximum). Vous créez votre mot de passe et votre roue est prête.",
  submitting: "Création en cours",
  success: {
    title: "C'est noté, merci.",
    text: (firstName: string) =>
      `${firstName}, votre demande est enregistrée avec votre roue. Nous la validons et vous envoyons votre accès par e-mail, en général en quelques minutes (24 h maximum). Vous créez votre mot de passe et votre roue est prête.`,
    close: "Revenir au site",
  },
  close: "Fermer",
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
          h: "Les appels et les demandes de création de roue",
          p: [
            "Quand vous réservez un appel (/rendez-vous) ou demandez qu'on crée votre roue (/creer-ma-roue), nous collectons les informations du formulaire : nom ou prénom, téléphone, e-mail, nom et adresse du commerce, lien ou nom de la fiche Google, lots souhaités, message et logo éventuel.",
            "Finalité : vous rappeler au créneau choisi, préparer votre roue et vous répondre. Base légale : votre consentement, donné en cochant la case du formulaire. Durée de conservation : 3 ans après le dernier contact si vous ne devenez pas client.",
          ],
        },
        {
          h: "Qui a accès à vos données",
          p: [
            `Seul ${company.owner} a accès à vos données. Elles ne sont ni vendues ni louées.`,
            `Hébergement : ${host.name} (États-Unis) héberge le site et la base des inscriptions. Ce transfert hors de l'Union européenne est encadré par le cadre de protection des données UE et États-Unis (Data Privacy Framework) et par les clauses contractuelles types de la Commission européenne.`,
            "Envoi des e-mails : Brevo (Sendinblue SAS, 106 boulevard Haussmann, 75008 Paris, France) envoie les e-mails du service : accusé de réception, accès à votre espace, fin d'essai, rapport hebdomadaire, et pour vos clients le code gagné et son rappel.",
            "Si le service Resend (Resend, Inc., États-Unis) est activé pour l'envoi des e-mails, il traite les mêmes données pour le seul envoi des messages. Ce transfert hors de l'Union européenne est encadré par les clauses contractuelles types de la Commission européenne.",
          ],
        },
        {
          h: "Les données de vos clients",
          p: [
            "Quand vos clients jouent, Rouelia agit comme sous-traitant pour votre compte. Ils ne sont recontactés que s'ils l'ont accepté, et chaque message contient un lien de désinscription.",
          ],
        },
        {
          h: "Cookies, stockage local et mesure d'audience",
          p: [
            "Le site public (rouelia.fr) ne dépose aucun cookie et aucun traceur publicitaire. Il garde seulement dans votre navigateur votre roue de démo et le cadeau de la roue d'offres, pour que vous les retrouviez : ces éléments servent au fonctionnement du site et ne demandent pas d'accord.",
            "Pour savoir quels boutons et quelles pages sont utiles, le site compte certaines actions : clic sur « Créer ma roue », sur WhatsApp ou sur les tarifs, envoi d'un formulaire, réservation d'un appel, profondeur de lecture de la page d'accueil, arrivée depuis la roue d'un commerçant. Chaque action ajoute seulement 1 à un compteur du jour. Aucune adresse IP, aucun identifiant et aucune information sur votre navigateur ne sont enregistrés : il est impossible de relier un compteur à une personne. Cette mesure ne lit et n'écrit rien sur votre appareil, elle ne demande donc pas d'accord.",
            "Le détail est sur notre page Cookies.",
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
    cookies: {
      title: "Cookies",
      description: "Le site Rouelia ne dépose aucun cookie de mesure ni de publicité. Ce qui est gardé dans votre navigateur et comment l'effacer.",
      sections: [
        {
          h: "En bref",
          p: [
            "Le site public rouelia.fr ne dépose aucun cookie : ni publicité, ni mesure d'audience, ni réseau social. C'est pourquoi aucun bandeau ne vous demande votre accord.",
          ],
        },
        {
          h: "Ce qui est gardé dans votre navigateur",
          p: [
            "La roue que vous réglez dans la démo et le cadeau de la roue d'offres (7 jours), gardés dans le stockage local de votre appareil pour que vous les retrouviez. Ils ne nous sont transmis que si vous créez un compte.",
            "Dans l'espace commerçant et l'espace admin seulement, un cookie de session sécurisé qui vous garde connecté.",
            "Ces éléments servent uniquement au fonctionnement du site et ne demandent pas d'accord, conformément aux lignes directrices de la CNIL.",
          ],
        },
        {
          h: "La mesure des visites, sans cookie",
          p: [
            "Pour améliorer le site, nous comptons certaines actions : clic sur « Créer ma roue », sur WhatsApp ou sur les tarifs, envoi d'un formulaire, réservation d'un appel, profondeur de lecture de la page d'accueil, arrivée depuis la roue d'un commerçant.",
            "Chaque action ajoute 1 à un compteur du jour, sur notre serveur. Rien n'est lu ni écrit sur votre appareil, et aucune adresse IP, aucun identifiant ni aucune information sur votre navigateur ne sont gardés. Ces compteurs ne permettent pas de vous reconnaître.",
          ],
        },
        {
          h: "Effacer ces données",
          p: [
            "Vous pouvez effacer à tout moment la démo et le cadeau gardés sur votre appareil, dans les réglages de votre navigateur (données du site rouelia.fr). Une question : contact@rouelia.fr.",
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
            "La roue est gagnante à chaque partie et le cadeau est remis quoi que fasse le client. L'invitation à partager un avis est proposée après le gain, identique pour tous, facultative et sans lien avec le cadeau ; aucun tri n'est fait selon la note. Le commerçant s'engage à ne pas modifier ce fonctionnement ni à présenter le cadeau comme une contrepartie d'un avis.",
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
