/**
 * Page /comparatif : roue de fidélité, carte à tampons ou appli de fidélité.
 * Comparaison honnête, sans nom de marque concurrente, sans chiffre invérifiable, limites de Rouelia comprises.
 * Aucun lien entre le jeu et un avis.
 */
import type { SeoPage } from "./types";

export interface CompareRow {
  criterion: string;
  /** Dans l'ordre : carte à tampons, appli de fidélité, roue Rouelia. */
  values: [string, string, string];
}

export const comparePage: SeoPage & {
  table: { caption: string; columns: [string, string, string]; criterionLabel: string; rows: CompareRow[] };
  ctaTitle: string;
  ctaText: string;
} = {
  path: "/comparatif",
  title: "Roue de fidélité, carte à tampons ou appli : que choisir ?",
  description:
    "Carte à tampons, appli de fidélité ou roue à cadeaux : mise en place, coût, effort pour le client, limites. Un comparatif honnête pour choisir selon votre commerce.",
  eyebrow: "Comparatif",
  h1: "Roue de fidélité, carte à tampons ou appli de fidélité : que choisir ?",
  lead:
    "Trois façons de donner à vos clients une raison de revenir, avec chacune ses forces et ses limites. Voici de quoi choisir selon votre commerce, votre temps et vos clients, y compris les cas où la roue n'est pas la meilleure option.",
  sections: [
    {
      h2: "En bref : laquelle choisir ?",
      answer:
        "La carte à tampons récompense la régularité et coûte presque rien. L'appli de fidélité suit chaque client de près, mais demande un téléchargement. La roue à cadeaux donne une raison de revenir dès la première visite, sans appli, avec un coût que vous fixez.",
      p: [
        "Aucune de ces solutions n'est meilleure dans l'absolu. Le bon choix dépend de la fréquence de passage de vos clients, du temps que vous pouvez y consacrer, et de ce que vous voulez récompenser : la fidélité de long terme, ou le prochain passage.",
        "Elles peuvent aussi se compléter. Beaucoup de commerçants gardent leur carte à tampons pour les habitués et ajoutent un jeu pour donner envie aux nouveaux clients de revenir une deuxième fois.",
      ],
    },
    {
      h2: "La carte à tampons : simple et connue de tous",
      answer:
        "Un tampon par passage, un cadeau au bout de la carte. Tout le monde comprend le principe, et la mise en place se résume à imprimer des cartes.",
      p: [
        "C'est la solution la plus simple à lancer. Vous faites imprimer des cartes à votre nom, vous choisissez la récompense, et vous tamponnez à chaque passage. Le coût se limite à l'impression et au cadeau final.",
        "Ses limites sont connues. Les cartes s'oublient, se perdent ou restent au fond d'un portefeuille. Le cadeau n'arrive qu'après plusieurs visites, ce qui motive surtout les clients déjà réguliers. Et vous ne savez pas combien de cartes circulent, ni combien de clients reviennent grâce à elles.",
      ],
      list: [
        "Idéale si vos clients passent souvent : boulangerie, café, sandwicherie.",
        "Moins adaptée si les visites sont espacées de plusieurs semaines, car la carte est oubliée entre deux passages.",
      ],
    },
    {
      h2: "L'appli de fidélité : complète, mais à télécharger",
      answer:
        "Une appli suit les points de chaque client, envoie des offres et donne des statistiques détaillées. En contrepartie, chaque client doit l'installer et créer un compte.",
      p: [
        "L'appli de fidélité va plus loin que la carte : historique d'achats, points cumulés, offres ciblées, notifications. Pour une enseigne avec beaucoup de clients réguliers, c'est un outil puissant.",
        "Le frein principal est l'effort demandé au client. Télécharger une appli pour un seul commerce de quartier, créer un compte, accepter les notifications : beaucoup de clients refusent poliment. La mise en place prend aussi plus de temps, l'abonnement est souvent plus élevé, et il faut faire vivre l'appli pour qu'elle reste utile.",
      ],
      list: [
        "Adaptée aux commerces avec une clientèle très régulière et du temps pour animer un programme.",
        "Plus difficile à faire adopter dans un petit commerce où chaque client passe vite au comptoir.",
      ],
    },
    {
      h2: "La roue à cadeaux : une raison de revenir dès la première visite",
      answer:
        "Le client scanne un QR code, tourne une roue sur son téléphone et gagne à coup sûr un cadeau à utiliser lors de sa prochaine visite. Pas d'appli, pas de carte à garder.",
      p: [
        "La roue récompense tout de suite, y compris un client qui vient pour la première fois. Le cadeau est valable lors de la prochaine visite, avec une date limite : c'est ce qui donne une raison concrète de revenir. Le code du cadeau reste sur le téléphone du client et peut aussi lui être envoyé par e-mail : il ne s'oublie pas au fond d'un portefeuille comme une carte.",
        "Avec Rouelia, vous choisissez vos lots, leurs chances et leur coût, et l'outil affiche le coût moyen d'une partie. Vous voyez combien de parties sont jouées et combien de cadeaux sont retirés en caisse. Le détail du fonctionnement est sur la page d'[accueil](/#fonctionnement), et les exemples de lots par activité sur la page [Pour qui ?](/pour-qui).",
      ],
    },
    {
      h2: "Les limites de la roue, Rouelia comprise",
      answer:
        "La roue n'est pas magique : elle donne une raison de revenir, pas une garantie. Elle a aussi des limites qu'il vaut mieux connaître avant de choisir.",
      list: [
        "Il faut la proposer : un QR code caché derrière la caisse ne sera pas scanné. Un mot au moment de payer fait la différence.",
        "Chaque cadeau a un coût pour vous. Rouelia l'affiche, mais c'est à vous de choisir des lots raisonnables.",
        "Le client a besoin d'un téléphone avec un appareil photo et une connexion pour jouer.",
        "La roue récompense le prochain passage, pas la fidélité sur un an : pour récompenser vos meilleurs habitués, une carte ou un geste personnel reste utile.",
        "C'est un abonnement mensuel, sans engagement, alors qu'une carte à tampons ne coûte que son impression.",
      ],
    },
    {
      h2: "Comment choisir selon votre commerce",
      answer:
        "Regardez d'abord la fréquence de passage de vos clients, puis le temps dont vous disposez pour faire vivre votre programme.",
      sub: [
        {
          h3: "Vos clients passent plusieurs fois par semaine",
          p: [
            "Une carte à tampons fonctionne bien, et une roue peut s'y ajouter pour les nouveaux clients. Voir notre page pour les [boulangeries](/jeu-fidelisation-boulangerie).",
          ],
        },
        {
          h3: "Vos clients reviennent toutes les quelques semaines",
          p: [
            "La carte risque d'être oubliée entre deux visites. Un cadeau à utiliser avant une date limite donne une raison précise de reprendre rendez-vous. Voir nos pages pour les [coiffeurs](/jeu-fidelisation-coiffeur) et les [instituts de beauté](/jeu-fidelisation-institut-beaute).",
          ],
        },
        {
          h3: "Vous avez beaucoup de clients de passage",
          p: [
            "Une appli sera rarement téléchargée. Une roue sans appli, jouée en quelques secondes, a plus de chances d'être utilisée. Voir notre page pour les [restaurants](/jeu-fidelisation-restaurant).",
          ],
        },
        {
          h3: "Vous avez peu de temps",
          p: [
            "Choisissez la solution la plus simple à faire vivre. La carte demande seulement de tamponner. La roue se règle en quelques minutes, ou nous la préparons pour vous sur [Créer ma roue](/creer-ma-roue).",
          ],
        },
      ],
    },
  ],
  table: {
    caption: "Comparatif : carte à tampons, appli de fidélité et roue Rouelia",
    criterionLabel: "Critère",
    columns: ["Carte à tampons", "Appli de fidélité", "Roue Rouelia"],
    rows: [
      { criterion: "Mise en place", values: ["Faire imprimer des cartes", "Plus longue : configuration, puis faire installer l'appli aux clients", "Environ 5 minutes en ligne, ou préparée pour vous"] },
      { criterion: "Coût", values: ["Impression et cadeaux", "Abonnement, souvent plus élevé, et cadeaux", "De 29 à 89 € par mois sans engagement, et les cadeaux que vous fixez"] },
      { criterion: "Effort pour le client", values: ["Garder la carte et la présenter", "Télécharger l'appli et créer un compte", "Scanner un QR code et donner un prénom et un numéro"] },
      { criterion: "Première récompense", values: ["Après plusieurs passages", "Selon les points cumulés", "Dès la première partie, à utiliser à la visite suivante"] },
      { criterion: "Ce qui se perd", values: ["Les cartes oubliées ou perdues", "Les clients qui n'installent pas l'appli", "Les cadeaux non retirés avant leur date limite"] },
      { criterion: "Suivi pour vous", values: ["Aucun", "Détaillé", "Parties jouées et cadeaux retirés en caisse"] },
      { criterion: "Idéale pour", values: ["Passages très fréquents", "Clientèle très régulière, programme animé", "Faire revenir après une première ou une deuxième visite"] },
    ],
  },
  faq: [
    {
      q: "Puis-je garder ma carte à tampons et ajouter une roue ?",
      a: "Oui. Les deux se complètent : la carte récompense vos habitués sur la durée, la roue donne aux nouveaux clients une raison de revenir une deuxième fois.",
    },
    {
      q: "Mes clients doivent-ils télécharger une appli pour jouer ?",
      a: "Non. Le client scanne le QR code avec l'appareil photo de son téléphone, et la roue s'ouvre dans le navigateur. Aucune appli à installer, ni pour lui, ni pour vous.",
    },
    {
      q: "Combien coûtent les cadeaux de la roue ?",
      a: "Ce que vous décidez. Vous choisissez chaque lot et sa chance de sortir, et Rouelia affiche le coût moyen d'une partie avant que vous lanciez la roue. Le détail des abonnements est sur la page [Tarifs](/tarifs).",
    },
    {
      q: "Une roue à cadeaux est-elle légale dans un commerce ?",
      a: "Un jeu gratuit, sans obligation d'achat et avec un règlement accessible est en principe autorisé. Rouelia prévoit un règlement pour chaque commerce. Le détail est sur la page [utilisation responsable](/utilisation-responsable).",
    },
    {
      q: "Que se passe-t-il si un client ne revient jamais chercher son cadeau ?",
      a: "Le cadeau expire à sa date limite et ne vous coûte rien. Vous ne payez un cadeau que lorsqu'un client revient le retirer, c'est-à-dire lorsqu'il est revenu chez vous.",
    },
    {
      q: "Puis-je essayer avant de m'engager ?",
      a: "Oui. Chaque pack commence par 14 jours d'essai gratuit, sans carte bancaire, et l'abonnement est sans engagement. Vous pouvez aussi [réserver un appel de 5 minutes](/rendez-vous) pour poser vos questions.",
    },
  ],
  ctaTitle: "Essayez la roue dans votre commerce.",
  ctaText: "14 jours gratuits, sans carte bancaire. Vous gardez votre carte à tampons si elle vous convient.",
};
