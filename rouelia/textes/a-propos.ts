/**
 * Page « À propos » : l'histoire de Rouelia racontée par Enzo, ses engagements et des preuves vérifiables.
 */
import type { Faq, SeoPage } from "./types";

export const aboutPage: Omit<SeoPage, "sections" | "faq"> & {
  story: { h2: string; p: string[] };
  commitments: { h2: string; items: { title: string; text: string }[] };
  proofs: { h2: string; intro: string; items: { title: string; text: string }[] };
  faq: Faq[];
  cta: { title: string; text: string };
} = {
  path: "/a-propos",
  title: "À propos de Rouelia : l'histoire d'Enzo, son fondateur",
  description:
    "Rouelia est née de l'expérience d'Enzo, ancien du commerce basé à Paris : une roue à cadeaux simple pour faire revenir vos clients, sans engagement.",
  eyebrow: "À propos",
  h1: "Rouelia, l'idée d'un ancien du commerce",
  lead:
    "Rouelia n'a pas été pensée dans un bureau. Elle vient du comptoir, là où l'on voit chaque jour ce qu'un client fidèle change pour un commerce de quartier.",
  story: {
    h2: "Pourquoi j'ai créé Rouelia",
    p: [
      "Avant Rouelia, j'ai travaillé dans des commerces, côté comptoir. J'y ai appris une chose simple : un client qui revient change tout. Il fait confiance, il parle de vous autour de lui, et il aide la boutique à tenir les mois calmes.",
      "Pourtant, personne n'avait le temps de s'en occuper. Les cartes à tampons se perdaient au fond des portefeuilles, et les logiciels de fidélité étaient trop lourds pour un commerce de quartier.",
      "Alors j'ai imaginé une petite roue. Le client scanne un QR code, gagne un cadeau à tous les coups, et ce cadeau l'attend pour sa prochaine visite. Le jeu fait sourire, il lance la conversation au comptoir, et surtout il donne une vraie raison de repasser.",
      "Rouelia, c'est l'outil que j'aurais aimé avoir : prêt en 5 minutes, un prix fixe, et quelqu'un qui répond quand vous avez une question.",
    ],
  },
  commitments: {
    h2: "Ce à quoi je m'engage",
    items: [
      {
        title: "Simple",
        text:
          "Votre roue est prête en 5 minutes, sans formation. Vos clients jouent sans appli, vous validez les cadeaux en un geste. Si quelque chose vous semble compliqué, dites-le-moi : je le simplifie.",
      },
      {
        title: "Humain",
        text:
          "Vous parlez à une vraie personne : par e-mail, sur WhatsApp ou lors d'un appel gratuit de 5 minutes. À Paris et en petite couronne, je peux aussi venir installer la roue avec vous.",
      },
      {
        title: "Des résultats mesurables",
        text:
          "Pas de promesse en l'air. Votre espace affiche les parties jouées, les cadeaux gagnés et ceux retirés en caisse : vous voyez vous-même combien de clients sont revenus.",
      },
    ],
  },
  proofs: {
    h2: "Ce que vous pouvez vérifier vous-même",
    intro:
      "Je préfère vous donner des éléments concrets, que vous pouvez contrôler, plutôt que des chiffres impossibles à vérifier. Voici ce qui est écrit noir sur blanc et ce que vous constaterez en utilisant Rouelia.",
    items: [
      {
        title: "Des prix publics",
        text:
          "Les trois packs sont affichés sur la page [tarifs](/tarifs), avec leur contenu détaillé. Pas de devis caché, pas de frais surprise.",
      },
      {
        title: "Un essai sans carte bancaire",
        text:
          "Vous testez Rouelia pendant 14 jours sans donner votre carte. Si la roue ne vous convient pas, vous n'avez rien à résilier.",
      },
      {
        title: "Sans engagement",
        text:
          "L'abonnement se paie au mois. Vous pouvez arrêter quand vous voulez : il prend fin à la fin du mois déjà payé.",
      },
      {
        title: "Un règlement pour chaque commerce",
        text:
          "Chaque roue a son propre règlement et sa page sur les données personnelles, accessibles à vos clients. Le cadre est expliqué sur la page [utilisation responsable](/utilisation-responsable).",
      },
      {
        title: "Un cadeau jamais lié à un avis",
        text:
          "Le cadeau est gagné avant toute autre étape. Le client peut ensuite, s'il le souhaite, partager son avis sur Google, mais rien ne dépend de ce choix et aucun tri n'est fait selon la note.",
      },
      {
        title: "Une installation sur place possible",
        text:
          "À Paris et en petite couronne, je peux venir mettre la roue en place dans votre commerce. Ailleurs, la mise en route se fait en ligne, gratuitement.",
      },
      {
        title: "Vos chiffres visibles dans votre espace",
        text:
          "Nombre de parties, cadeaux gagnés, cadeaux retirés en caisse : tout est affiché dans votre espace. Ce sont vos chiffres, pas une moyenne annoncée par moi.",
      },
    ],
  },
  faq: [
    {
      q: "Qui êtes-vous ?",
      a:
        "Je suis Enzo, le fondateur de Rouelia, basé à Paris. J'ai travaillé dans des commerces avant de créer cette roue à cadeaux, d'abord pour mon propre usage, puis pour tous les commerces de quartier.",
    },
    {
      q: "Où intervenez-vous ?",
      a:
        "Rouelia fonctionne partout en France, puisque tout se règle en ligne. Pour une installation sur place, je me déplace à Paris et en petite couronne.",
    },
    {
      q: "Pourquoi une roue plutôt qu'une carte de fidélité ?",
      a:
        "Parce qu'une roue se joue tout de suite, avec le téléphone du client, et qu'elle donne un cadeau dès la première visite. Ce cadeau l'attend pour la suivante : c'est une raison concrète de revenir, sans carte à garder dans le portefeuille. J'en parle aussi dans cet article sur le [jeu en boutique](/blog/fideliser-clients-jeu-en-boutique).",
    },
    {
      q: "Est-ce sérieux, et qui contacter en cas de question ?",
      a:
        "Oui. Chaque commerce a son règlement de jeu et sa page données, les prix sont publics et l'abonnement est sans engagement. Pour toute question, écrivez à contact@rouelia.fr, passez par WhatsApp ou réservez un [appel gratuit de 5 minutes](/rendez-vous). C'est moi qui vous réponds.",
    },
    {
      q: "Venez-vous sur place pour installer la roue ?",
      a:
        "Oui, à Paris et en petite couronne. L'installation sur place coûte 49 €, ou 79 € si le déplacement est fait uniquement pour vous. Si vous préférez, la mise en route en ligne est gratuite.",
    },
    {
      q: "Comment démarrer avec Rouelia ?",
      a:
        "Le plus simple est de [créer votre roue](/creer-ma-roue) : l'essai gratuit de 14 jours démarre sans carte bancaire. Si vous manquez de temps, le service « Créez-la pour moi » est inclus à partir du pack Croissance : vous m'envoyez vos informations et je vous renvoie votre QR code en quelques heures. Avec l'Essentiel, vous créez votre roue vous-même en 5 minutes.",
    },
  ],
  cta: {
    title: "Essayons ensemble, sans engagement",
    text:
      "Créez votre roue en 5 minutes et testez-la pendant 14 jours, sans carte bancaire. Si vous avez une question avant de vous lancer, je suis joignable.",
  },
};
