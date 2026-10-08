/**
 * Formes des textes des pages de contenu (référencement Google et moteurs IA).
 * Dans les chaînes, un lien interne s'écrit [texte du lien](/chemin) : il devient un vrai lien.
 * Mêmes règles de rédaction que content.ts : vouvoiement, aucun tiret de ponctuation, aucun emoji,
 * aucun chiffre inventé, aucune promesse d'avis.
 */
import type { TradeId } from "@/content";

export interface Faq {
  q: string;
  a: string;
}

/** Une section : un H2, une réponse courte et directe (citable par les IA), puis le détail. */
export interface Block {
  h2: string;
  /** Une ou deux phrases qui répondent tout de suite à la question du titre. */
  answer?: string;
  p?: string[];
  list?: string[];
  sub?: { h3: string; p: string[]; list?: string[] }[];
}

export interface SeoPage {
  /** Chemin de la page, par exemple « /jeu-fidelisation-coiffeur ». */
  path: string;
  /** Balise title (60 caractères environ, sans « | Rouelia », ajouté automatiquement). */
  title: string;
  /** Meta description, 150 à 160 caractères. */
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  sections: Block[];
  faq?: Faq[];
}

export interface TradePage extends SeoPage {
  trade: TradeId;
  /** Libellé court pour les menus et les cartes (« Coiffeurs et barbiers »). */
  label: string;
  /** Exemples de lots adaptés, avec une courte explication. */
  prizes: { name: string; note: string }[];
  /** Phrase du bloc d'appel final. */
  cta: string;
}

export interface Article extends SeoPage {
  slug: string;
  /** Date de publication, AAAA-MM-JJ. */
  date: string;
  /** Date de mise à jour, AAAA-MM-JJ. */
  updated: string;
  author: string;
  readingMinutes: number;
  /** Résumé pour la liste du blog, deux phrases. */
  excerpt: string;
}
