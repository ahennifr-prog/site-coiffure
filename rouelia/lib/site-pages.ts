/** Liste des pages publiques indexables : sitemap.xml, llms.txt et maillage. */
import { articles } from "@/textes/blog";
import { tradePages } from "@/textes/metiers";
import { faqPage } from "@/textes/faq";
import { pricingPage } from "@/textes/tarifs";
import { aboutPage } from "@/textes/a-propos";
import { responsiblePage } from "@/textes/utilisation-responsable";
import { booking, createWheel } from "@/textes/formulaires";

export interface SitePage {
  path: string;
  title: string;
  description: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  lastModified?: string;
}

export const sitePages: SitePage[] = [
  { path: "/", title: "Rouelia : la roue à cadeaux qui fait revenir vos clients", description: "Accueil : l'offre en bref, comment ça marche, tarifs, contact.", priority: 1, changeFrequency: "weekly" },
  { path: pricingPage.path, title: pricingPage.h1, description: pricingPage.description, priority: 0.9, changeFrequency: "monthly" },
  { path: createWheel.path, title: createWheel.title, description: createWheel.description, priority: 0.9, changeFrequency: "monthly" },
  ...tradePages.map((t) => ({ path: t.path, title: t.h1, description: t.description, priority: 0.8, changeFrequency: "monthly" as const })),
  { path: faqPage.path, title: faqPage.h1, description: faqPage.description, priority: 0.7, changeFrequency: "monthly" },
  { path: aboutPage.path, title: aboutPage.h1, description: aboutPage.description, priority: 0.6, changeFrequency: "monthly" },
  { path: booking.path, title: booking.title, description: booking.description, priority: 0.6, changeFrequency: "monthly" },
  { path: responsiblePage.path, title: responsiblePage.h1, description: responsiblePage.description, priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", title: "Blog Rouelia", description: "Conseils pour fidéliser ses clients en commerce de quartier.", priority: 0.6, changeFrequency: "weekly" },
  ...articles.map((a) => ({ path: a.path, title: a.h1, description: a.description, priority: 0.6, changeFrequency: "monthly" as const, lastModified: a.updated })),
  { path: "/mentions-legales", title: "Mentions légales", description: "Éditeur, hébergeur et contact.", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cgv", title: "Conditions générales de vente", description: "Conditions de l'abonnement.", priority: 0.2, changeFrequency: "yearly" },
  { path: "/confidentialite", title: "Politique de confidentialité", description: "Données personnelles.", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", title: "Cookies", description: "Cookies et stockage local.", priority: 0.2, changeFrequency: "yearly" },
];
