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
  email: "bonjour@rouelia.fr",
  phone: "",
  founder: "Aymen",
  area: "Paris et petite couronne",
};

export const seo = {
  title: "Rouelia : la roue à cadeaux qui fait revenir vos clients",
  description:
    "Un QR code sur votre comptoir, une roue où chaque client gagne un cadeau à retirer à sa prochaine visite. Vous réglez les lots et leur coût. Essai gratuit de 14 jours.",
  ogTitle: "Vos clients gagnent un cadeau. Vous gagnez leur prochaine visite.",
  ogDescription:
    "La roue à cadeaux 100 % gagnante pour les coiffeurs, restaurants, instituts, boulangeries et bars. Créez la vôtre en 2 minutes.",
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
    { href: "#simulateur", label: "Rentabilité" },
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
  lead:
    "Un QR code sur votre comptoir. Le client tourne la roue en quelques secondes, gagne à tous les coups, et revient retirer son cadeau. Vous choisissez les lots et vous savez ce que ça coûte.",
  reassurance: [
    "14 jours d'essai, sans carte bancaire",
    "Chaque segment est un cadeau",
    "Vous fixez le coût de chaque lot",
  ],
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
/* Le problème                                                         */
/* ------------------------------------------------------------------ */

export const problem = {
  eyebrow: "Ce qu'on voit derrière le comptoir",
  title: "Vos clients sont contents. Ça ne se voit nulle part.",
  pains: [
    {
      title: "Le voisin a plus d'avis que vous",
      text:
        "Avant de pousser une porte, on regarde les étoiles et le nombre d'avis sur Google. Le salon d'en face n'est pas forcément meilleur. Il a juste pensé à demander.",
    },
    {
      title: "Des habitués qui oublient de revenir",
      text:
        "Un client satisfait ne revient pas toujours. Pas par déception : il a une vie, un autre commerce sur son trajet, et rien qui lui rappelle votre adresse.",
    },
    {
      title: "Des promos dont on ignore le résultat",
      text:
        "Flyers, remises, cartes à tamponner. Vous dépensez, mais impossible de dire qui est revenu grâce à quoi, ni combien ça vous a coûté.",
    },
  ],
  transition: "Le plus simple, c'est de voir la roue avec vos propres lots.",
};

/* ------------------------------------------------------------------ */
/* Démo interactive                                                    */
/* ------------------------------------------------------------------ */

export const demo = {
  eyebrow: "Démo gratuite, sans inscription",
  title: "Réglez votre roue. Tournez-la comme un client.",
  lead:
    "Rien n'est envoyé tant que vous ne créez pas de compte. Votre roue est gardée pour l'essai.",

  steps: {
    identity: "Votre commerce",
    look: "Couleurs et logo",
    prizes: "Vos lots",
  },

  fields: {
    name: { label: "Nom du commerce", placeholder: "Chez Martine", help: "Il s'affiche sur la roue et sur l'écran de gain." },
    trade: { label: "Votre métier", help: "On charge des lots adaptés. Vous pourrez tout changer." },
    logo: {
      label: "Logo",
      upload: "Choisir une image",
      replace: "Changer",
      remove: "Retirer le logo",
      none: "Je n'ai pas de logo",
      noneHelp: "On crée un visuel à partir du nom de votre commerce.",
      privacy: "Votre image reste sur votre téléphone. Elle n'est envoyée que si vous créez un compte.",
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
    totalHint: "Toujours 100 %. Quand vous changez un lot, les autres s'ajustent.",
    noLoser: "Aucune case perdante : chaque segment est un cadeau.",
    lock: (name: string) => `Bloquer la chance de ${name}`,
    unlock: (name: string) => `Débloquer la chance de ${name}`,
  },

  cost: {
    label: "Coût moyen par partie",
    explain:
      "C'est ce que vous coûte un joueur en moyenne : le coût de chaque lot multiplié par sa chance de sortir.",
    ok: "Raisonnable pour un cadeau qui fait revenir un client.",
    warning: (threshold: string) =>
      `Au-dessus de ${threshold} par partie. C'est possible, mais baissez la chance des gros lots si vous voulez garder la main.`,
  },

  preview: {
    phoneLabel: "Aperçu de la roue sur le téléphone d'un client",
    tagline: "Tentez votre chance : chaque case est un cadeau.",
    test: "Tester comme un client",
    testHint: "Vous verrez exactement ce que voit un client après avoir scanné le QR code.",
    liveHint: "La roue se met à jour pendant que vous la réglez.",
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
    kept: "Votre roue sera déjà configurée à l'ouverture de votre compte.",
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
  eyebrow: "Côté client, 20 secondes",
  title: "Ce qui se passe entre le comptoir et la prochaine visite",
  steps: [
    {
      title: "Il scanne",
      text: "Un chevalet sur le comptoir, un QR code. Pas d'application à installer.",
    },
    {
      title: "On l'invite à donner son avis",
      text: "Une fenêtre neutre, facultative, qu'il ferme d'un geste. La roue tourne dans tous les cas.",
    },
    {
      title: "Il tourne et il gagne",
      text: "Tous les segments sont des cadeaux. Il reçoit un code et une date limite.",
    },
    {
      title: "Il revient le retirer",
      text: "Il montre son code, vous le validez en caisse. Vous savez qui est revenu et quand.",
    },
  ],
  transition: "Et pendant ce temps, Rouelia travaille pour vous.",
};

/* ------------------------------------------------------------------ */
/* Ce que Rouelia fait de plus                                         */
/* ------------------------------------------------------------------ */

export const features = {
  eyebrow: "Au-delà de la roue",
  title: "Le travail que vous n'avez pas le temps de faire",
  items: [
    {
      title: "Les relances, sans y penser",
      text: "Un client n'a pas retiré son cadeau ? Il reçoit un rappel avant la date limite.",
      packs: "Croissance et Premium",
    },
    {
      title: "Validation en caisse",
      text: "Le client montre son code, vous le validez en un geste. Pas de ticket à garder, et chaque code ne sert qu'une fois.",
      packs: "Tous les packs",
    },
    {
      title: "Répondre aux avis en un clic",
      text: "Une réponse polie et personnalisée vous est proposée. Vous relisez, vous publiez.",
      packs: "Croissance et Premium",
    },
    {
      title: "Un rapport chaque semaine",
      text: "Parties jouées, cadeaux retirés, avis reçus. Et une action simple à faire la semaine suivante.",
      packs: "Tous les packs",
    },
    {
      title: "Un œil sur les voisins",
      text: "La note et le nombre d'avis de trois concurrents proches, suivis chaque semaine.",
      packs: "Premium",
    },
    {
      title: "En route en 2 minutes",
      text: "Donnez votre métier, on vous propose des lots et des chances raisonnables. Vous ajustez.",
      packs: "Tous les packs",
    },
    {
      title: "Installation chez vous",
      text: "À Paris et en petite couronne, on vient poser le QR code et former l'équipe.",
      packs: "En option",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Simulateur de rentabilité                                           */
/* Valeurs par défaut prudentes. Ce ne sont PAS des moyennes observées.*/
/* À remplacer par des chiffres mesurés dès que des pilotes existent.  */
/* ------------------------------------------------------------------ */

export const simulator = {
  eyebrow: "Vos chiffres, pas les nôtres",
  title: "Est-ce que ça se rembourse chez vous ?",
  lead:
    "Réglez selon votre commerce. Les hypothèses sont prudentes et toutes modifiables.",
  defaults: {
    /** Jours d'ouverture par mois. */
    openDaysPerMonth: 26,
    /** Part des clients qui jouent. */
    playRate: 0.2,
    /** Part des gagnants qui reviennent retirer leur cadeau. */
    redeemRate: 0.3,
    /** Part des retours qui sont de vraies visites en plus. */
    incrementalRate: 0.4,
  },
  inputs: {
    trade: "Votre métier",
    clientsPerDay: "Clients par jour",
    averageBasket: "Panier moyen",
    playRate: "Clients qui jouent",
    redeemRate: "Gagnants qui reviennent retirer leur cadeau",
    pack: "Pack",
  },
  advanced: {
    toggle: "Voir et modifier toutes les hypothèses",
    openDaysPerMonth: "Jours d'ouverture par mois",
    incrementalRate: "Retours qui sont de vraies visites en plus",
    incrementalHelp:
      "Certains clients seraient revenus de toute façon. On ne compte que les visites que la roue a provoquées.",
    grossMargin: "Ce qui vous reste sur un panier",
    grossMarginHelp: "Après le coût des produits, hors loyer et salaires.",
    lotCost: "Coût moyen d'un cadeau retiré",
    lotCostHelp: "Repris de votre roue si vous l'avez réglée dans la démo.",
  },
  outputs: {
    plays: "Parties par mois",
    returns: "Clients qui reviennent",
    extraRevenue: "Chiffre d'affaires en plus",
    extraMargin: "Dont marge",
    lotsCost: "Coût des cadeaux",
    packCost: "Coût du pack",
    balance: "Solde estimé par mois",
    positive: "Ça se rembourse avec vos réglages.",
    negative: "Avec ces réglages, ça ne se rembourse pas encore. Essayez des lots moins chers ou un autre pack.",
    perMonth: "par mois",
  },
  disclaimer: "Estimation indicative basée sur vos réglages, non garantie.",
  loading: "Chargement du simulateur",
  method:
    "Calcul : clients par jour, fois jours d'ouverture, fois part qui joue, donne les parties. Parties fois part qui revient donne les retours. On ne garde que les vraies visites en plus, multipliées par votre panier et votre marge. On retire le coût des cadeaux retirés et le prix du pack.",
};

/* ------------------------------------------------------------------ */
/* Preuve sociale                                                      */
/* ------------------------------------------------------------------ */

export const founder = {
  eyebrow: "Qui est derrière Rouelia",
  // À relire et personnaliser par Aymen : ce texte doit rester le sien.
  title: "Je viens installer la roue moi-même.",
  text: [
    "Je m'appelle Aymen. Je passe mes journées chez des commerçants, et j'entends toujours la même chose : les clients sont contents, mais ils ne le disent pas, et ils ne reviennent pas assez souvent.",
    "J'ai créé Rouelia pour que ce soit simple : un QR code, un cadeau que vous choisissez, et des chiffres clairs sur ce que ça vous rapporte.",
    "À Paris et en petite couronne, je viens le poser moi-même et je forme votre équipe.",
  ],
  signature: "Aymen, fondateur de Rouelia",
  photoAlt: "Aymen, fondateur de Rouelia",
  /** Chemin de la photo dans /public. Vide tant qu'elle n'est pas fournie. */
  photo: "",
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
  lead: "Tous les packs commencent par 14 jours d'essai gratuit, sans carte bancaire.",
  perMonth: "par mois",
  perDay: (amount: string) => `soit environ ${amount} par jour`,
  cover: (visits: number, basket: string, trade: string) =>
    `Avec un panier moyen de ${basket} (${trade.toLowerCase()}), environ ${visits} ${visits > 1 ? "visites" : "visite"} en plus par mois suffisent à le couvrir.`,
  coverNote: "Calcul sur la marge prudente du simulateur. Réglez vos propres chiffres plus bas.",
  choose: (name: string) => `Essayer ${name}`,
  packs: [
    {
      id: "essentiel",
      name: "Essentiel",
      price: 29,
      tagline: "La roue, le QR code et les cadeaux à retirer.",
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
      tagline: "Pour faire revenir, et répondre aux avis sans y passer la soirée.",
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
      tagline: "On s'occupe de tout, et on surveille les voisins.",
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
      "14 jours d'essai gratuit, sans carte bancaire.",
      "Vous arrêtez en un clic, sans appeler personne.",
      "Si vous mettez votre compte en pause, les cadeaux déjà gagnés restent valables pour vos clients.",
    ],
  },
  printNote: "Chevalets et flyers imprimés disponibles à part, sur demande.",
  tableToggle: { open: "Comparer tous les détails", close: "Masquer le comparatif" },
  tableCaption: "Comparatif complet des packs Rouelia",
  /** Contenu du tableau complet. true = inclus, false = non inclus, texte = précision. */
  table: [
    { feature: "Roue 100 % gagnante, QR code, flyer PDF, personnalisation, lots et chances", values: [true, true, true] },
    { feature: "Cadeaux à retirer avec date limite, validation en caisse par code", values: [true, true, true] },
    { feature: "Code du cadeau envoyé", values: ["Par e-mail", "Par e-mail", "Par e-mail"] },
    { feature: "Modèles par métier, calculateur de coût des lots", values: [true, true, true] },
    { feature: "Mise en route en 2 minutes par IA", values: [true, true, true] },
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
/* Accompagnement                                                      */
/* ------------------------------------------------------------------ */

export const support = {
  eyebrow: "Accompagnement",
  title: "Seul, avec nous en visio, ou avec nous au comptoir",
  options: [
    {
      title: "En ligne, par vous",
      price: "Gratuit",
      text: "Deux minutes pour créer la roue, imprimer le QR code et le poser. Un guide pas à pas vous accompagne.",
      packs: "Tous les packs",
    },
    {
      title: "En visio",
      price: "Offerte",
      text: "30 minutes avec nous pour régler les lots, les chances et les relances selon votre commerce.",
      packs: "Croissance et Premium",
    },
    {
      title: "Sur place",
      price: "49 €",
      priceNote: "79 € si le déplacement est fait uniquement pour vous",
      text: "On vient chez vous, on pose le QR code au bon endroit et on montre à l'équipe comment valider un cadeau.",
      packs: "Paris et petite couronne",
    },
  ],
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
      a: "Oui. Chaque segment est un cadeau que vous avez choisi. Il n'existe pas de case « perdu ». Vous réglez les chances de chaque lot, et le total fait toujours 100 %.",
    },
    {
      q: "Comment le client retire-t-il son cadeau ?",
      a: "Il reçoit un code unique et une date limite, à l'écran et par e-mail. À sa prochaine visite, il montre le code et vous le validez en caisse depuis votre téléphone. Un code ne sert qu'une fois.",
    },
    {
      q: "Le cadeau est-il donné en échange d'un avis ?",
      a: "Non. La roue tourne dans tous les cas. L'invitation à laisser un avis Google est facultative, le client peut la fermer d'un geste, et le lien est le même pour tout le monde. C'est ce que demandent les règles de Google, et c'est aussi plus honnête.",
    },
    {
      q: "Combien coûtent les cadeaux et comment je garde la main ?",
      a: "Vous fixez chaque lot, son coût et sa chance de sortir. Rouelia calcule en direct ce que vous coûte une partie en moyenne. Pour un café à 40 centimes qui sort une fois sur trois, c'est quelques centimes par joueur. Vous pouvez tout modifier à tout moment.",
    },
    {
      q: "Et si un client laisse un mauvais avis ?",
      a: "Ça peut arriver, et c'est normal : le lien est le même pour tous, on ne trie personne. C'est pour ça qu'il y a l'alerte avis négatif en Premium et les réponses en un clic en Croissance et Premium. Un avis négatif bien répondu rassure souvent plus qu'il ne fait fuir.",
    },
    {
      q: "Comment se passe l'essai de 14 jours et que se passe-t-il à la fin ?",
      a: "Vous créez votre compte sans carte bancaire et vous utilisez tout le pack choisi pendant 14 jours. Avant la fin, on vous prévient. Si vous continuez, vous ajoutez un moyen de paiement. Sinon, rien n'est prélevé et les cadeaux déjà gagnés restent valables.",
    },
    {
      q: "Faut-il du matériel ou une installation ?",
      a: "Non. Un QR code imprimé suffit, sur un chevalet, la vitrine ou le ticket de caisse. Vos clients jouent sur leur téléphone, sans application. Vous validez les cadeaux sur le vôtre.",
    },
    {
      q: "Que devient la liste de mes clients ?",
      a: "Elle vous appartient. Les clients ne sont contactés que s'ils l'ont accepté, et chaque message contient un lien de désinscription. Les données sont hébergées en Europe et ne sont jamais revendues. Vous pouvez les exporter ou les supprimer quand vous voulez.",
    },
    {
      q: "Puis-je changer de pack ou arrêter quand je veux ?",
      a: "Oui. Le changement de pack prend effet tout de suite. L'arrêt se fait en un clic dans votre espace, sans préavis ni frais.",
    },
    {
      q: "Comment se passe l'installation sur place ?",
      a: "À Paris et en petite couronne, on fixe un créneau hors de votre rush. On vient avec le QR code, on choisit avec vous le meilleur emplacement et on montre à l'équipe comment valider un cadeau. Comptez 30 minutes. C'est 49 €, ou 79 € si le déplacement est fait uniquement pour vous.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Appel final et pied de page                                         */
/* ------------------------------------------------------------------ */

export const finalCta = {
  title: "Votre roue est à deux minutes d'ici.",
  text: "Réglez vos lots, testez-la comme un client, et posez le QR code dès demain.",
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
    "J'accepte que Rouelia utilise ces informations pour créer mon compte d'essai et me contacter à ce sujet. Je peux retirer mon accord à tout moment en écrivant à bonjour@rouelia.fr.",
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
  draftNotice:
    "Texte provisoire, à faire valider par un professionnel du droit avant publication.",
  back: "Retour à l'accueil",
  updated: "Dernière mise à jour : à compléter lors de la publication.",
  pages: {
    mentions: {
      title: "Mentions légales",
      description: "Éditeur, hébergeur et contact du site Rouelia.",
      sections: [
        {
          h: "Éditeur du site",
          p: [
            "Rouelia, [forme juridique et capital à compléter], immatriculée sous le numéro [SIREN à compléter], dont le siège est situé [adresse à compléter].",
            "Directeur de la publication : Aymen [nom à compléter].",
            "Contact : bonjour@rouelia.fr.",
          ],
        },
        {
          h: "Hébergement",
          p: ["Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. vercel.com."],
        },
        {
          h: "Propriété intellectuelle",
          p: [
            "Les textes, visuels et le logotype Rouelia sont protégés. Toute reproduction sans accord écrit est interdite.",
          ],
        },
      ],
    },
    confidentialite: {
      title: "Politique de confidentialité",
      description: "Comment Rouelia collecte et protège vos données.",
      sections: [
        {
          h: "Qui est responsable de vos données",
          p: ["Rouelia, joignable à bonjour@rouelia.fr, est responsable des traitements décrits ici."],
        },
        {
          h: "La démo du site",
          p: [
            "La démo fonctionne entièrement dans votre navigateur. Le nom, les lots et le logo que vous saisissez restent sur votre appareil, dans le stockage local, pour que vous retrouviez votre roue. Rien n'est envoyé tant que vous ne créez pas de compte.",
          ],
        },
        {
          h: "L'inscription à l'essai",
          p: [
            "Nous collectons votre prénom, votre e-mail, votre téléphone, le nom de votre établissement, le pack choisi, la configuration de votre roue et la page d'où vous venez.",
            "Finalité : créer votre compte d'essai et vous accompagner. Base légale : votre consentement, puis l'exécution du contrat si vous devenez client.",
            "Durée de conservation : 3 ans après le dernier contact si vous ne devenez pas client [durée à valider].",
          ],
        },
        {
          h: "Les données de vos clients",
          p: [
            "Quand vos clients jouent, Rouelia agit comme sous-traitant pour votre compte. Ils ne sont recontactés que s'ils l'ont accepté, et chaque message contient un lien de désinscription.",
          ],
        },
        {
          h: "Cookies et mesure d'audience",
          p: [
            "Aucun traceur publicitaire. Une mesure d'audience ne peut être activée qu'après votre accord, et vous pouvez changer d'avis via le lien « Gérer les cookies » en bas de page.",
          ],
        },
        {
          h: "Vos droits",
          p: [
            "Vous pouvez accéder à vos données, les rectifier, les supprimer, vous opposer à leur traitement ou retirer votre consentement en écrivant à bonjour@rouelia.fr. Vous pouvez aussi saisir la CNIL (cnil.fr).",
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
          p: ["Les présentes conditions encadrent l'abonnement au service Rouelia par un professionnel."],
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
            "Les prix sont indiqués hors taxes [à confirmer], par mois, sans engagement. Essentiel : 29 €. Croissance : 49 €. Premium : 89 €. L'installation sur place est facturée 49 €, ou 79 € pour un déplacement dédié, à Paris et en petite couronne.",
          ],
        },
        {
          h: "Résiliation et pause",
          p: [
            "Vous pouvez arrêter à tout moment depuis votre espace, sans frais. Le mois commencé reste dû [à valider]. Les cadeaux déjà gagnés par vos clients restent utilisables jusqu'à leur date limite.",
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
  tryDemo: "Essayer la démo",
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
