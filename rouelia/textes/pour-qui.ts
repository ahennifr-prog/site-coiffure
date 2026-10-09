/** Page /pour-qui : les commerces concernés, des exemples de cadeaux, et un formulaire pour les autres activités. */
import type { PrizeIcon, TradeId } from "@/content";
import type { Faq } from "./types";

export interface WhoCard {
  trade: TradeId;
  icon: PrizeIcon;
  title: string;
  text: string;
  /** Page métier dédiée, si elle existe. */
  href?: string;
}

export const whoPage = {
  path: "/pour-qui",
  title: "Pour qui ? Une roue à cadeaux pour chaque commerce",
  description:
    "Coiffeurs, restaurants, instituts, boulangeries, bars, boutiques et indépendants : des exemples de cadeaux adaptés à chaque activité pour faire revenir vos clients.",
  eyebrow: "Pour qui ?",
  h1: "Pour tous les commerces qui vivent de leurs habitués.",
  lead:
    "Rouelia s'adresse à tous les commerçants et indépendants qui ont besoin de fidéliser leurs clients. Le principe reste le même partout : le client scanne, joue, et gagne un cadeau à utiliser lors de sa prochaine visite. Seuls les cadeaux changent, et c'est vous qui les choisissez.",
  answer:
    "Rouelia convient à tout commerce de proximité où un client peut revenir : salon, restaurant, institut, boulangerie, bar, boutique ou activité indépendante.",
  giftsLabel: "Exemples de cadeaux",
  more: (label: string) => `Tout savoir pour les ${label.toLowerCase()}`,
  cards: [
    { trade: "coiffeur", icon: "ciseaux", title: "Coiffeurs et barbiers", text: "Entre deux coupes, il se passe des semaines. Un soin ou un brushing offert à la prochaine visite donne une raison de ne pas aller voir ailleurs.", href: "/jeu-fidelisation-coiffeur" },
    { trade: "restaurant", icon: "assiette", title: "Restaurants et pizzerias", text: "Le client a bien mangé, il repart avec un café ou un dessert offert pour son prochain repas chez vous.", href: "/jeu-fidelisation-restaurant" },
    { trade: "institut", icon: "vernis", title: "Instituts de beauté", text: "Une pose de vernis ou un massage des mains offert au prochain rendez-vous, et la cliente reprend date plus vite.", href: "/jeu-fidelisation-institut-beaute" },
    { trade: "boulangerie", icon: "croissant", title: "Boulangeries et pâtisseries", text: "Des passages fréquents et des petits cadeaux qui coûtent peu : un croissant offert ramène au comptoir dès le lendemain.", href: "/jeu-fidelisation-boulangerie" },
    { trade: "bar", icon: "verre", title: "Bars et cafés", text: "Un café, un soft ou une planche à partager lors de la prochaine visite : de quoi transformer un passage en habitude." },
    { trade: "autre", icon: "cadeau", title: "Boutiques", text: "Fleuriste, caviste, épicerie fine, prêt-à-porter : une réduction ou un petit cadeau surprise pour le prochain achat." },
  ] as WhoCard[],
  other: {
    title: "Autre activité ou indépendant",
    text: "Toiletteur, cordonnier, studio de sport, praticien, artisan : si vos clients peuvent revenir, la roue peut les y aider. Décrivez-nous votre activité, on vous propose une roue adaptée.",
    form: {
      title: "Parlez-nous de votre activité",
      name: "Nom du commerce ou de l'activité",
      description: "Votre activité",
      descriptionHelp: "En une ou deux phrases : ce que vous proposez et à qui.",
      prizes: "Cadeaux souhaités dans la roue",
      prizesHelp: "Facultatif. Si vous ne savez pas encore, on vous fera des propositions.",
      phone: "Téléphone",
      email: "E-mail",
      submit: "Envoyer",
      next: "vous recevez un e-mail de confirmation. Nous étudions votre activité et vous répondons avec une proposition de roue, en général en quelques heures.",
      submitting: "Envoi en cours",
      errors: {
        name: "Indiquez le nom de votre commerce ou de votre activité.",
        description: "Décrivez votre activité en quelques mots.",
        phone: "Ce numéro ne ressemble pas à un numéro français. Exemple : 06 12 34 56 78.",
        email: "Cet e-mail semble incomplet. Vérifiez le @ et le point.",
        consent: "Cochez la case pour qu'on puisse vous répondre.",
        summary: "Il manque quelques informations, elles sont indiquées en rouge.",
        server: "L'envoi n'a pas fonctionné. Réessayez, ou écrivez-nous sur WhatsApp.",
        rate: "Trop de demandes depuis cette connexion. Réessayez dans un moment.",
      },
      success: {
        title: "Merci, c'est bien reçu.",
        text: "Un e-mail de confirmation vient de partir. Nous étudions votre activité et vous répondons avec une proposition de roue, en général en quelques heures.",
      },
    },
  },
  faq: [
    {
      q: "Mon commerce n'est pas dans la liste, Rouelia peut-elle marcher pour moi ?",
      a: "Oui, si vos clients peuvent revenir. La roue fonctionne de la même façon pour toutes les activités : seuls les cadeaux changent. Décrivez votre activité dans le formulaire ci-dessus, on vous propose des lots adaptés.",
    },
    {
      q: "Quels cadeaux choisir pour mon activité ?",
      a: "Des cadeaux utiles lors de la prochaine visite et peu coûteux pour vous : un service rapide, un produit offert, une petite réduction. Rouelia affiche le coût moyen d'une partie pour que vous gardiez la main. Plus de conseils dans notre article [fidéliser ses clients avec un jeu en boutique](/blog/fideliser-clients-jeu-en-boutique).",
    },
    {
      q: "Vaut-il mieux une roue, une carte à tampons ou une appli de fidélité ?",
      a: "Cela dépend de la fréquence de passage de vos clients et du temps dont vous disposez. Les trois peuvent aussi se compléter. Nous avons écrit un [comparatif honnête des trois solutions](/comparatif), limites de la roue comprises.",
    },
    {
      q: "Faut-il une boutique physique ?",
      a: "Le QR code se pose sur un comptoir, mais il peut aussi être remis sur une carte, une facture ou un flyer. Il suffit que le client puisse revenir vers vous pour utiliser son cadeau.",
    },
    {
      q: "Combien de temps pour démarrer ?",
      a: "Environ 5 minutes pour régler votre roue vous-même sur [Créer ma roue](/creer-ma-roue), ou quelques heures si vous préférez qu'on la prépare pour vous, à partir du pack Croissance.",
    },
  ] as Faq[],
  ctaTitle: "Votre commerce a des habitués à faire revenir ?",
};

/** Bloc compact de la page d'accueil, sous les avis des commerçants. */
export const whoTeaser = {
  title: "Coiffeur, restaurant, institut, boulangerie, bar, boutique ou indépendant ?",
  text: "La roue s'adapte à votre activité : vous choisissez des cadeaux qui ont du sens pour vos clients.",
  link: "Voir tous les commerces concernés",
};
