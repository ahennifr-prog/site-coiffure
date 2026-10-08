import type { SeoPage } from "./types";

/**
 * Page /utilisation-responsable : règles Google, cadre légal français, conception de Rouelia.
 * Points juridiques vérifiés en octobre 2026 (recherches croisées et guide du cabinet Victoris Avocat du 30 septembre 2026) ;
 * les articles non vérifiables sont cités sans numéro.
 */
export const responsiblePage: SeoPage & { disclaimer: string; sources: { label: string; url: string }[] } = {
  path: "/utilisation-responsable",
  title: "Roue à cadeaux et avis Google : les règles à respecter",
  description:
    "Règles Google sur les avis, loi française, jeux promotionnels, RGPD : comment utiliser une roue à cadeaux en boutique en respectant vos clients et votre fiche.",
  eyebrow: "Conformité",
  h1: "Utiliser Rouelia de façon responsable",
  lead:
    "Une roue à cadeaux sert à faire revenir vos clients. Elle ne sert pas à acheter des avis. Cette page rassemble ce que disent les règles de Google et la loi française, explique comment Rouelia a été pensée pour les respecter, et liste les gestes simples qui vous protègent au quotidien.",
  sections: [
    {
      h2: "Que disent les règles de Google sur les avis ?",
      answer:
        "Google interdit les avis obtenus contre une contrepartie, la sollicitation réservée aux clients satisfaits et les faux avis. Une fiche qui enfreint ces règles s'expose à la suppression d'avis et à des restrictions.",
      p: [
        "Les règles de Google Maps sur les contenus publiés par les utilisateurs demandent que chaque avis reflète une expérience réelle. Un avis rédigé parce que l'établissement a offert de l'argent, une remise ou un cadeau en échange n'est pas accepté et peut être retiré.",
        "La sollicitation sélective est aussi visée : demander un avis uniquement aux clients contents, ou détourner les mécontents vers un formulaire privé, fausse l'image du commerce. Les faux avis, qu'ils soient écrits par le commerçant, ses proches ou un prestataire, sont évidemment interdits.",
        "En cas d'infraction, Google peut supprimer les avis concernés, y compris parfois des avis authentiques pris dans le même lot. Il peut aussi appliquer des restrictions à la fiche de l'établissement, par exemple bloquer temporairement les nouveaux avis ou afficher un avertissement aux internautes. Pour un commerce de quartier, une fiche marquée de cette façon coûte bien plus cher que quelques avis de moins.",
      ],
    },
    {
      h2: "Que dit la loi française sur les avis en ligne ?",
      answer:
        "La loi impose la transparence sur la gestion des avis et sanctionne les faux avis comme une pratique commerciale trompeuse.",
      p: [
        "L'article L111-7-2 du Code de la consommation, issu de la loi pour une République numérique de 2016, oblige toute personne qui collecte, modère ou diffuse des avis de consommateurs à expliquer de façon loyale, claire et transparente comment ces avis sont publiés et traités. Le décret n° 2017-1436 du 29 septembre 2017, en vigueur depuis le 1er janvier 2018, précise ces informations : existence ou non d'un contrôle, date de publication, raisons d'un refus.",
        "La directive européenne dite « Omnibus » (2019/2161) a renforcé ce cadre. Elle a été transposée en France par l'ordonnance n° 2021-1734 du 22 décembre 2021, applicable depuis le 28 mai 2022. Diffuser ou faire diffuser de faux avis de consommateurs, ou modifier des avis réels pour promouvoir un produit, fait désormais partie des pratiques commerciales trompeuses. La DGCCRF rappelle que ces pratiques peuvent être sanctionnées pénalement, jusqu'à deux ans d'emprisonnement et 300 000 € d'amende.",
        "Ces obligations vous concernent aussi si vous affichez vous-même des avis de clients, sur votre site ou vos réseaux : indiquez s'ils sont contrôlés avant publication, leur date, s'ils ont donné lieu à une contrepartie et pour quelles raisons un avis peut être refusé. Un manque de transparence peut être sanctionné par une amende administrative, en plus des sanctions pénales prévues pour les faux avis.",
      ],
    },
    {
      h2: "Une roue à cadeaux est-elle un jeu promotionnel encadré ?",
      answer:
        "En général oui : un jeu où le hasard désigne le lot s'apparente à une loterie publicitaire, que le Code de la consommation encadre. Le jeu doit rester gratuit, sans obligation d'achat, avec un règlement accessible.",
      p: [
        "Le Code de la consommation encadre les loteries publicitaires, c'est-à-dire les opérations qui font espérer un gain attribué par le hasard pour promouvoir un commerce. Elles sont admises lorsqu'elles n'imposent aux participants aucune contrepartie financière ni dépense, et lorsqu'elles ne sont pas déloyales envers le consommateur.",
        "Concrètement, personne ne doit avoir à acheter pour jouer, et les règles du jeu doivent être claires et consultables avant de participer. Si vous ajoutez des conditions à l'oral (« seulement pour les clients qui ont payé »), vous sortez de ce cadre.",
      ],
    },
    {
      h2: "Et les données personnelles de vos clients ?",
      answer:
        "Le RGPD s'applique dès que vous collectez un prénom, un numéro de téléphone ou un e-mail. Il faut informer le client, ne demander que le nécessaire et respecter ses droits.",
      p: [
        "Le règlement général sur la protection des données demande que chaque donnée ait un but précis, que la personne sache pourquoi elle la donne et qu'elle puisse demander à y accéder, à la corriger ou à la faire effacer. La CNIL publie, avec Bpifrance, un guide pratique destiné aux TPE et PME qui résume ces obligations.",
      ],
    },
    {
      h2: "Comment Rouelia est-elle conçue pour respecter ces règles ?",
      answer:
        "Le cadeau est gagné avant toute question d'avis, et rien dans Rouelia ne vérifie ni ne trie les avis.",
      list: [
        "Le cadeau est remis quoi que fasse le client : il est gagné dès que la roue s'arrête.",
        "Rouelia ne contrôle pas si un avis a été publié et ne lie aucun avantage à cette publication.",
        "L'invitation à partager son avis est la même pour tous, neutre et facultative, et n'apparaît qu'après le gain.",
        "Aucun filtrage selon la note : personne n'est orienté vers un formulaire privé parce qu'il serait mécontent.",
        "Chaque commerce dispose de son propre règlement du jeu, accessible au client.",
        "Le client coche un accord avant de jouer, et une page lui explique l'usage de ses données.",
        "Une seule participation par numéro de téléphone sur la période fixée par le commerçant.",
        "Seuls le prénom et le téléphone sont demandés, l'e-mail reste facultatif.",
      ],
    },
    {
      h2: "Quelles bonnes pratiques adopter en boutique ?",
      answer:
        "Présentez la roue comme un cadeau de fidélité, jamais comme un échange contre un avis, et appliquez la même règle à tous vos clients.",
      list: [
        "Ne dites jamais « un avis contre un cadeau », ni sur une affiche, ni à l'oral.",
        "Formez votre équipe à une phrase neutre, par exemple : « Scannez le QR code, vous gagnez un cadeau pour votre prochaine visite. »",
        "Proposez le jeu à tous les clients, sans choisir ceux qui ont l'air contents.",
        "Répondez à tous les avis, bons comme mauvais, avec le même soin. Nos [modèles de réponse aux avis négatifs](/blog/repondre-avis-negatif-modeles) peuvent vous aider.",
        "Gardez le règlement visible et accessible à tout moment.",
        "Choisissez des lots que vous pouvez réellement offrir, et honorez chaque code présenté dans les délais.",
      ],
      p: [
        "Pour aller plus loin, notre article sur les [avis Google conformes en 2026](/blog/avis-google-conformes-2026) détaille les formulations à privilégier.",
      ],
    },
    {
      h2: "Que faut-il éviter absolument ?",
      answer:
        "Tout ce qui fait dépendre un avantage d'un avis, ou qui fausse la note de votre fiche.",
      list: [
        "Promettre un lot plus intéressant à ceux qui laissent un avis.",
        "Demander à voir l'avis publié avant de remettre ou de valider le cadeau.",
        "Rédiger des avis vous-même, les faire écrire par des proches ou les acheter.",
        "Réserver l'invitation aux clients satisfaits ou proposer un recours privé aux seuls mécontents.",
        "Exiger un achat pour pouvoir jouer.",
        "Utiliser les numéros collectés pour autre chose que ce qui a été annoncé au client.",
      ],
      p: [
        "Une question précise sur votre situation ? Consultez notre [FAQ](/faq) ou écrivez-nous à contact@rouelia.fr.",
      ],
    },
  ],
  disclaimer:
    "Ce contenu est informatif et ne constitue pas un conseil juridique. En cas de doute, rapprochez-vous d'un professionnel du droit.",
  sources: [
    {
      label: "Google : règles relatives aux contenus publiés par les utilisateurs sur Google Maps",
      url: "https://support.google.com/contributionpolicy/answer/7422880?hl=fr",
    },
    {
      label: "DGCCRF : avis en ligne, attention aux faux commentaires",
      url: "https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques-et-les-faq/avis-en-ligne-attention-aux-faux-commentaires",
    },
    {
      label: "Légifrance : décret n° 2017-1436 du 29 septembre 2017 sur les avis en ligne de consommateurs",
      url: "https://www.legifrance.gouv.fr/eli/decret/2017/9/29/ECOC1716649D/jo/texte",
    },
    {
      label: "Légifrance : ordonnance n° 2021-1734 du 22 décembre 2021 (transposition de la directive Omnibus)",
      url: "https://www.legifrance.gouv.fr/eli/ordonnance/2021/12/22/ECOC2133152R/jo/texte",
    },
    {
      label: "CNIL et Bpifrance : guide pratique de sensibilisation au RGPD pour les TPE et PME",
      url: "https://www.cnil.fr/sites/default/files/atoms/files/bpi-cnil-rgpd_guide-tpe-pme.pdf",
    },
  ],
};
