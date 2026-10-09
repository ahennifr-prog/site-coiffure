/** Contenu de /llms.txt (résumé) et /llms-full.txt (texte complet), générés depuis les textes du site. */
import { brand, company, cta, doneForYou, faq, howItWorks, pricing } from "@/content";
import { BOOKING } from "@/config";
import { articles } from "@/textes/blog";
import { faqPage } from "@/textes/faq";
import { tradePages } from "@/textes/metiers";
import { pricingPage } from "@/textes/tarifs";
import { aboutPage } from "@/textes/a-propos";
import { responsiblePage } from "@/textes/utilisation-responsable";
import { whoPage } from "@/textes/pour-qui";
import { comparePage } from "@/textes/comparatif";
import type { Block, Faq } from "@/textes/types";
import { sitePages } from "@/lib/site-pages";

const url = (path: string) => (path === "/" ? brand.url : `${brand.url}${path}`);
/** Liens [texte](/chemin) en liens Markdown absolus. */
const md = (t: string) => t.replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, (_, a, b) => `[${a}](${url(b)})`);

export function llmsTxt(): string {
  const lines = [
    `# ${brand.name}`,
    "",
    `> ${brand.name} est une roue à cadeaux 100 % gagnante pour les commerces de quartier (coiffeurs, restaurants, instituts de beauté, boulangeries, bars, boutiques). Le client scanne un QR code posé sur le comptoir, tourne la roue sur son téléphone sans application, et gagne un cadeau à utiliser lors de sa prochaine visite. Objectif : faire revenir les clients.`,
    "",
    "## L'essentiel",
    `- Fonctionnement : ${howItWorks.answer}`,
    "- Le commerçant choisit ses lots, leurs chances et leur coût ; le coût moyen d'une partie est affiché.",
    "- Le cadeau ne dépend jamais d'un avis Google. Partager son avis est proposé après le gain, à tous, de façon facultative, sans tri selon la note.",
    "- Essai gratuit de 14 jours, sans carte bancaire, sans engagement. Prête en 5 minutes.",
    `- Zone d'intervention sur place : ${brand.area}.`,
    "",
    "## Offres (prix par mois, sans engagement)",
    ...pricing.packs.map((p) => `- ${p.name} : ${p.price} € par mois. ${p.tagline} ${p.features}`),
    `- ${company.vatMention}.`,
    `- Rentabilité, exemple de calcul et non promesse : ${pricing.profit} ${pricing.profitNote}`,
    "",
    "## Pages clés",
    ...sitePages.filter((p) => p.priority >= 0.5).map((p) => `- [${p.title}](${url(p.path)}) : ${p.description}`),
    "",
    "## Contact",
    `- E-mail : ${brand.email}`,
    `- WhatsApp : ${brand.whatsapp}`,
    `- ${cta.call} : ${url(cta.callHref)} (du lundi au vendredi, ${Object.values(BOOKING.hours)[0]?.map(([a, b]) => `${a} à ${b}`).join(" et ")}, heure de Paris)`,
    `- Créer sa roue soi-même (tous les packs) ou la faire créer (${doneForYou.rule}) : ${url(cta.href)}`,
    "",
    "## Optionnel",
    `- [Texte complet du site](${url("/llms-full.txt")})`,
    `- [Plan du site](${url("/sitemap.xml")})`,
    "",
  ];
  return lines.join("\n");
}

function blocks(sections: Block[]): string[] {
  const out: string[] = [];
  for (const b of sections) {
    out.push(`### ${b.h2}`, "");
    if (b.answer) out.push(md(b.answer), "");
    for (const p of b.p ?? []) out.push(md(p), "");
    if (b.list) out.push(...b.list.map((l) => `- ${md(l)}`), "");
    for (const s of b.sub ?? []) {
      out.push(`#### ${s.h3}`, "", ...s.p.map((p) => `${md(p)}\n`));
      if (s.list) out.push(...s.list.map((l) => `- ${md(l)}`), "");
    }
  }
  return out;
}
const faqs = (items: Faq[]) => items.flatMap((f) => [`**${f.q}**`, md(f.a), ""]);

export function llmsFullTxt(): string {
  const out: string[] = [llmsTxt(), "---", "", "## Questions fréquentes (accueil)", "", ...faqs(faq.items)];
  out.push(`## ${pricingPage.h1}`, `Source : ${url(pricingPage.path)}`, "", md(pricingPage.lead), "", ...blocks(pricingPage.sections), ...faqs(pricingPage.faq ?? []));
  out.push(`## ${whoPage.h1}`, `Source : ${url(whoPage.path)}`, "", md(whoPage.lead), "", ...whoPage.cards.map((c) => `- ${c.title} : ${c.text}`), `- ${whoPage.other.title} : ${whoPage.other.text}`, "", ...faqs(whoPage.faq));
  out.push(
    `## ${comparePage.h1}`,
    `Source : ${url(comparePage.path)}`,
    "",
    md(comparePage.lead),
    "",
    ...blocks(comparePage.sections),
    `| ${comparePage.table.criterionLabel} | ${comparePage.table.columns.join(" | ")} |`,
    "| --- | --- | --- | --- |",
    ...comparePage.table.rows.map((r) => `| ${r.criterion} | ${r.values.join(" | ")} |`),
    "",
    ...faqs(comparePage.faq ?? []),
  );
  for (const t of tradePages) {
    out.push(`## ${t.h1}`, `Source : ${url(t.path)}`, "", md(t.lead), "", ...blocks(t.sections), "### Exemples de lots", ...t.prizes.map((p) => `- ${p.name} : ${p.note}`), "", ...faqs(t.faq ?? []));
  }
  out.push(`## ${faqPage.h1}`, `Source : ${url(faqPage.path)}`, "");
  for (const g of faqPage.groups) out.push(`### ${g.title}`, "", ...faqs(g.items));
  out.push(`## ${responsiblePage.h1}`, `Source : ${url(responsiblePage.path)}`, "", md(responsiblePage.lead), "", ...blocks(responsiblePage.sections), responsiblePage.disclaimer, "");
  out.push(`## ${aboutPage.h1}`, `Source : ${url(aboutPage.path)}`, "", ...aboutPage.story.p, "", ...faqs(aboutPage.faq));
  for (const a of articles) {
    out.push(`## ${a.h1}`, `Source : ${url(a.path)} (par ${a.author}, ${a.updated})`, "", md(a.lead), "", ...blocks(a.sections), ...faqs(a.faq ?? []));
  }
  return out.join("\n");
}
