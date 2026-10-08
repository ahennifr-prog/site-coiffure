/**
 * Page « À propos » : l'histoire de Rouelia racontée par Enzo, ses engagements et des preuves vérifiables.
 */
import type { Faq, SeoPage } from "./types";

export const aboutPage: Omit<SeoPage, "sections" | "faq"> & {
  story: { h2: string; p: string[] };
  commitments: { h2: string; items: { title: string; text: string }[] };
  how: { h2: string; steps: { title: string; text: string }[] };
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
    "Rouelia n'est pas sortie d'un bureau loin du terrain. Elle vient de quelqu'un qui a passé du temps derrière un comptoir et qui a vu ce qu'un client fidèle change pour un commerce de quartier.",
  story: {
    h2: "Pourquoi j'ai créé Rouelia",
    p: [
      "Je m'appelle Enzo et je vis à Paris. Avant Rouelia, j'ai travaillé dans des commerces. J'ai vu le métier de l'intérieur, côté comptoir, avec ses journées pleines et ses imprévus. Ce sont des métiers où l'on court toute la journée, et où l'on n'a presque jamais une minute pour prendre du recul.",
      "Dans ces commerces, j'ai compris une chose très simple : un client qui revient change tout. Il connaît la maison, il fait confiance, il en parle autour de lui. Une boutique qui a ses habitués tient mieux les mois calmes. Une boutique qui doit sans cesse trouver de nouveaux clients s'épuise.",
      "Et pourtant, personne autour de moi n'avait le temps de s'occuper de la fidélité. Pas par manque d'envie : entre les commandes, le personnel, les clients du jour et la comptabilité, la fidélisation passait toujours après. Les cartes à tampons se perdaient au fond des portefeuilles, et les outils plus élaborés semblaient trop lourds pour un commerce de quartier.",
      "Alors j'ai imaginé un système pour moi-même. Une petite roue que le client fait tourner avec son téléphone, en scannant un QR code sur le comptoir. Il gagne à chaque fois un cadeau, et ce cadeau l'attend pour sa prochaine visite. Rien à installer pour lui, presque rien à gérer pour moi.",
      "En l'utilisant, j'ai remarqué que c'était un avantage énorme. Le moment du jeu fait sourire, il crée une petite conversation au comptoir, et surtout il donne au client une vraie raison de repasser. Ce n'est pas de la magie : c'est simplement un rendez-vous que l'on propose au client, au bon moment.",
      "De cette idée est née Rouelia. J'ai voulu la rendre accessible à tous les commerçants qui, comme moi à l'époque, n'ont ni le temps ni l'envie de se battre avec un logiciel compliqué. Une roue prête en quelques minutes, un prix fixe, et quelqu'un de joignable quand vous avez une question : c'est ce que j'aurais aimé avoir.",
    ],
  },
  commitments: {
    h2: "Ce à quoi je m'engage",
    items: [
      {
        title: "Simple",
        text:
          "Votre roue doit être prête en 5 minutes, sans formation. Vos clients jouent sans application, et vous validez les cadeaux en caisse en un geste. Si quelque chose vous semble compliqué, dites-le moi : c'est que je dois l'améliorer.",
      },
      {
        title: "Humain",
        text:
          "Vous ne parlez pas à un robot. Vous pouvez m'écrire à contact@rouelia.fr, m'envoyer un message sur WhatsApp ou réserver un appel gratuit de 5 minutes. À Paris et en petite couronne, je peux aussi venir installer la roue avec vous.",
      },
      {
        title: "Des résultats mesurables",
        text:
          "Je ne vous promets pas de miracle. Je vous donne de quoi juger par vous-même : dans votre espace, vous voyez le nombre de parties, les cadeaux gagnés et les cadeaux réellement retirés en caisse. Vous savez donc combien de clients sont revenus grâce à la roue.",
      },
    ],
  },
  how: {
    h2: "Comment fonctionne Rouelia, en trois étapes",
    steps: [
      {
        title: "Le client scanne le QR code",
        text:
          "Un chevalet ou un flyer posé sur votre comptoir invite à jouer. Le client scanne le QR code avec son téléphone, sans rien télécharger, puis indique son prénom et son numéro.",
      },
      {
        title: "Il fait tourner la roue",
        text:
          "La roue est à vos couleurs, avec votre logo. Chaque case est un cadeau que vous avez choisi : le client gagne à tous les coups. Le jeu est gratuit et sans obligation d'achat.",
      },
      {
        title: "Il gagne un cadeau pour sa prochaine visite",
        text:
          "Il reçoit un code avec une date limite. Lors de sa prochaine venue, il le montre en caisse et vous le validez dans votre espace. C'est ce retour qui compte pour votre commerce.",
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
        "Le plus simple est de [créer votre roue](/creer-ma-roue) : l'essai gratuit de 14 jours démarre sans carte bancaire. Si vous manquez de temps, le service « Créez-la pour moi » existe : vous m'envoyez vos informations et je vous renvoie votre QR code sous 24 à 48 h.",
    },
  ],
  cta: {
    title: "Essayons ensemble, sans engagement",
    text:
      "Créez votre roue en 5 minutes et testez-la pendant 14 jours, sans carte bancaire. Si vous avez une question avant de vous lancer, je suis joignable.",
  },
};
