/** Modèles d'e-mails : HTML simple (styles en ligne, lisible partout) et version texte. */
import { brand } from "@/content";
import { formatDay } from "@/lib/dates";
import { formatEuro, formatEuroCents } from "@/lib/format";
import type { Mail } from "@/lib/mail";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

interface Layout {
  color: string;
  onColor: string;
  title: string;
  /** Paragraphes (texte brut, échappé). */
  paragraphs: string[];
  /** Encadré mis en avant, par exemple un code. */
  highlight?: { label: string; value: string };
  button?: { label: string; url: string };
  /** Chiffres mis en avant, deux par ligne. */
  stats?: { value: string; label: string }[];
  /** Lien discret sous le bouton. */
  link?: { label: string; url: string };
  footer: string;
}

/** Rend cliquable l'adresse du site dans un pied d'e-mail (pas l'adresse e-mail contact@...). */
const SITE_HOST = brand.url.replace("https://", "");
const siteLinked = (html: string) =>
  html.replace(new RegExp(`(^|[\\s,(])${SITE_HOST.replace(/\./g, "\\.")}\\b`), `$1<a href="${brand.url}" style="color:#5E564E">${SITE_HOST}</a>`);

function statsTable(stats: { value: string; label: string }[]): string {
  const cell = (x: { value: string; label: string }) =>
    `<td width="50%" style="padding:6px;vertical-align:top"><div style="background:#FBF6EE;border-radius:12px;padding:12px 14px"><div style="font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#1D1A16">${esc(x.value)}</div><div style="font-size:13px;line-height:1.35;color:#5E564E">${esc(x.label)}</div></div></td>`;
  const rows: string[] = [];
  for (let i = 0; i < stats.length; i += 2) rows.push(`<tr>${cell(stats[i])}${stats[i + 1] ? cell(stats[i + 1]) : "<td></td>"}</tr>`);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 -6px 12px">${rows.join("")}</table>`;
}

function layout(l: Layout): string {
  const p = (t: string) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#1D1A16">${esc(t)}</p>`;
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#FBF6EE;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF6EE;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E8DFD2">
<tr><td style="background:${l.color};color:${l.onColor};padding:22px 26px;font-size:24px;font-weight:bold;font-family:Georgia,serif">${esc(l.title)}</td></tr>
<tr><td style="padding:24px 26px 8px">
${l.paragraphs.slice(0, l.stats ? 2 : undefined).map(p).join("\n")}
${l.stats ? statsTable(l.stats) + "\n" + l.paragraphs.slice(2).map(p).join("\n") : ""}
${l.highlight ? `<div style="margin:6px 0 18px;padding:14px 16px;border:2px dashed #E8DFD2;border-radius:12px"><div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#5E564E">${esc(l.highlight.label)}</div><div style="font-family:'Courier New',monospace;font-size:26px;font-weight:bold;letter-spacing:2px;color:#1D1A16">${esc(l.highlight.value)}</div></div>` : ""}
${l.button ? `<p style="margin:6px 0 22px"><a href="${esc(l.button.url)}" style="display:inline-block;background:#1D1A16;color:#FFFFFF;text-decoration:none;font-weight:bold;padding:13px 22px;border-radius:999px">${esc(l.button.label)}</a></p>` : ""}
${l.link ? `<p style="margin:-8px 0 22px;font-size:14px"><a href="${esc(l.link.url)}" style="color:#5E564E">${esc(l.link.label)}</a></p>` : ""}
</td></tr>
<tr><td style="padding:14px 26px 22px;font-size:12px;line-height:1.5;color:#5E564E;border-top:1px solid #E8DFD2">${siteLinked(esc(l.footer))}</td></tr>
</table></td></tr></table></body></html>`;
}

const text = (lines: (string | false | undefined)[]) => lines.filter(Boolean).join("\n\n");
const TOMETTE = "#C4401F";

/* ------------------------------------------------------------------ */
/* Clients des commerçants                                             */
/* ------------------------------------------------------------------ */

interface ShopInfo {
  name: string;
  address: string;
  color: string;
  onColor: string;
  replyTo: string;
  gameUrl: string;
}

interface PlayInfo {
  firstName: string;
  prizeName: string;
  prizeDetail: string;
  code: string;
  validFrom: string;
  expiresOn: string;
}

const when = (p: PlayInfo, today: string) =>
  p.validFrom > today ? `À utiliser du ${formatDay(p.validFrom)} au ${formatDay(p.expiresOn)}.` : `À utiliser jusqu'au ${formatDay(p.expiresOn)}.`;

export function clientCodeMail(shop: ShopInfo, play: PlayInfo, email: string, today: string): Mail {
  const lines = [
    `Bonjour ${play.firstName},`,
    `Vous avez gagné : ${play.prizeName}.${play.prizeDetail ? ` ${play.prizeDetail}` : ""}`,
    `${when(play, today)} Montrez ce code en caisse lors de votre prochaine visite chez ${shop.name}.`,
  ];
  if (shop.address) lines.push(`Adresse : ${shop.address}.`);
  const footer = `Vous recevez cet e-mail parce que vous avez joué à la roue de ${shop.name} et indiqué votre adresse. Un seul rappel vous sera envoyé avant la date limite.`;
  return {
    to: { email, name: play.firstName },
    subject: `Votre cadeau chez ${shop.name} : ${play.prizeName}`,
    fromName: shop.name,
    replyTo: shop.replyTo,
    tags: ["code-client"],
    html: layout({ color: shop.color, onColor: shop.onColor, title: "Votre cadeau vous attend", paragraphs: lines, highlight: { label: "Votre code", value: play.code }, footer }),
    text: text([...lines, `Votre code : ${play.code}`, footer]),
  };
}

export function clientReminderMail(shop: ShopInfo, play: PlayInfo, email: string, today: string): Mail {
  const lines = [
    `Bonjour ${play.firstName},`,
    `Petit rappel : votre cadeau chez ${shop.name} (${play.prizeName}) est valable jusqu'au ${formatDay(play.expiresOn)}.`,
    `Montrez simplement ce code en caisse lors de votre visite.`,
  ];
  if (shop.address) lines.push(`Adresse : ${shop.address}.`);
  const footer = `C'est le seul rappel que vous recevrez pour ce cadeau. ${when(play, today)}`;
  return {
    to: { email, name: play.firstName },
    subject: `Votre cadeau chez ${shop.name} expire bientôt`,
    fromName: shop.name,
    replyTo: shop.replyTo,
    tags: ["rappel-client"],
    html: layout({ color: shop.color, onColor: shop.onColor, title: "Votre cadeau expire bientôt", paragraphs: lines, highlight: { label: "Votre code", value: play.code }, footer }),
    text: text([...lines, `Votre code : ${play.code}`, footer]),
  };
}

/* ------------------------------------------------------------------ */
/* Commerçants                                                         */
/* ------------------------------------------------------------------ */

const rouelia = (title: string, paragraphs: string[], button?: { label: string; url: string }, footer = `${brand.name}, ${brand.url.replace("https://", "")}. Une question ? Répondez simplement à cet e-mail.`) => ({
  html: layout({ color: TOMETTE, onColor: "#FFFFFF", title, paragraphs, button, footer }),
  text: text([...paragraphs, button && `${button.label} : ${button.url}`, footer]),
});

export function merchantInviteMail(p: { email: string; firstName: string; shopName: string; link: string; trialEnd: string }): Mail {
  return {
    to: { email: p.email, name: p.firstName },
    subject: "Votre roue Rouelia est prête",
    tags: ["invitation"],
    replyTo: brand.email,
    ...rouelia(
      "Votre roue est prête",
      [
        `Bonjour ${p.firstName},`,
        `La roue de ${p.shopName} est créée, avec les lots que vous avez choisis. Votre essai gratuit dure jusqu'au ${formatDay(p.trialEnd)}.`,
        "Choisissez votre mot de passe avec le bouton ci-dessous (lien valable 14 jours). Vous trouverez ensuite la caisse, le suivi, les réglages et votre QR code.",
      ],
      { label: "Choisir mon mot de passe", url: p.link },
    ),
  };
}

export function merchantResetMail(p: { email: string; firstName: string; link: string }): Mail {
  return {
    to: { email: p.email, name: p.firstName },
    subject: "Nouveau mot de passe Rouelia",
    tags: ["mot-de-passe"],
    replyTo: brand.email,
    ...rouelia(
      "Nouveau mot de passe",
      [
        `Bonjour ${p.firstName},`,
        "Vous avez demandé à changer votre mot de passe. Le lien ci-dessous est valable 14 jours et ne sert qu'une fois.",
        "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre mot de passe actuel reste valable.",
      ],
      { label: "Choisir un nouveau mot de passe", url: p.link },
    ),
  };
}

export interface TrialResults {
  parties: number;
  retraits: number;
  avisClics: number;
  enAttente: number;
}

export interface TrialMailInput {
  email: string;
  firstName: string;
  shopName: string;
  daysLeft: number;
  trialEnd: string;
  /** Jours d'essai déjà écoulés. */
  daysUsed: number;
  packName: string;
  price: number;
  results: TrialResults;
  /** Cadeau de la roue d'offres qui s'applique à l'abonnement (libellé), s'il y en a un. */
  offerLabel?: string | null;
  /** Page de paiement en ligne (Stripe branché) ; sinon le bouton ouvre une réponse préremplie. */
  payUrl?: string | null;
  /** Panier moyen (€) et part qui reste (0 à 1), si le commerçant les a réglés. */
  profit?: { basket: number; margin: number } | null;
}

const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;

/** Lien « répondre » prérempli : le commerçant n'a qu'à envoyer. */
function continueLink(p: TrialMailInput, packName = p.packName) {
  if (p.payUrl) return p.payUrl;
  const subject = `Je continue avec ${packName} (${p.shopName})`;
  const body = `Bonjour,\n\nJe souhaite continuer avec le pack ${packName} pour ${p.shopName}.\n\n${p.firstName}`;
  return `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Ce que coûte l'abonnement, comparé à ce que la roue a déjà rapporté quand on peut l'estimer. */
function priceLine(p: TrialMailInput): string {
  const perDay = formatEuroCents(Math.round(((p.price * 12) / 365) * 20) / 20);
  const b = p.profit;
  if (b && b.basket > 0 && b.margin > 0) {
    const perVisit = b.basket * b.margin;
    const needed = Math.ceil(p.price / perVisit);
    const earned = Math.round(p.results.retraits * perVisit);
    const base = `Le pack ${p.packName} coûte ${p.price} € par mois, soit ${perDay} par jour. Avec votre panier moyen de ${formatEuro(b.basket)}, ${plural(needed, "client qui revient", "clients qui reviennent")} dans le mois ${needed > 1 ? "suffisent" : "suffit"} à le rembourser.`;
    return p.results.retraits > 0 ? `${base} Pendant l'essai, les visites déjà revenues représentent environ ${formatEuro(earned)} de marge.` : base;
  }
  return `Le pack ${p.packName} coûte ${p.price} € par mois, soit ${perDay} par jour, sans engagement. Quelques clients qui reviennent dans le mois suffisent à le rembourser.`;
}

function resultStats(r: TrialResults) {
  return [
    { value: String(r.parties), label: r.parties > 1 ? "parties jouées" : "partie jouée" },
    { value: String(r.retraits), label: r.retraits > 1 ? "clients déjà revenus chercher leur cadeau" : "client déjà revenu chercher son cadeau" },
    { value: String(r.avisClics), label: r.avisClics > 1 ? "clics vers vos avis Google" : "clic vers vos avis Google" },
    { value: String(r.enAttente), label: r.enAttente > 1 ? "cadeaux en attente, autant de visites à venir" : "cadeau en attente, une visite à venir" },
  ];
}

export function merchantTrialMail(p: TrialMailInput): Mail {
  const ended = p.daysLeft <= 0;
  const played = p.results.parties > 0;
  const r = p.results;
  const offer = p.offerLabel ? `Et votre cadeau de la roue Rouelia vous attend : ${p.offerLabel}. Il s'applique dès que vous continuez.` : null;
  const freeFooter = `Sans réponse de votre part, la roue ${ended ? "reste" : "se mettra"} en pause et rien ne vous sera facturé. Les cadeaux déjà gagnés restent valables en caisse.`;
  const footer = `${freeFooter} ${brand.name}, ${brand.url.replace("https://", "")}.`;
  const results = { label: "Voir tous mes résultats", url: `${brand.url}/espace#suivi` };

  let subject: string;
  let title: string;
  let paragraphs: string[];
  let button: { label: string; url: string };
  let link: { label: string; url: string } | undefined = results;

  if (!ended && played) {
    subject = `${p.firstName}, ${plural(r.parties, "client a", "clients ont")} déjà joué chez ${p.shopName}`;
    title = "Votre roue tourne déjà";
    paragraphs = [
      `Bonjour ${p.firstName},`,
      `En ${plural(p.daysUsed, "jour", "jours")} d'essai, voici ce que la roue a fait pour ${p.shopName} :`,
      r.enAttente > 0
        ? `Ces ${plural(r.enAttente, "cadeau en attente, c'est un client qui a", "cadeaux en attente, ce sont autant de clients qui ont")} une bonne raison de repasser dans les semaines qui viennent. C'est exactement ce que la roue est faite pour produire, et elle ne fait que commencer.`
        : `C'est un bon début, et la roue prend tout son sens avec le temps : plus elle tourne, plus vos clients ont une raison de revenir.`,
      priceLine(p),
      `Votre essai se termine le ${formatDay(p.trialEnd)}. Pour que vos clients continuent de jouer sans interruption, ${p.payUrl ? "prenez votre abonnement en ligne en deux minutes : le premier paiement n'a lieu qu'à la fin de l'essai." : "cliquez ci-dessous et envoyez le message : on s'occupe du reste."} Sans engagement, vous arrêtez quand vous voulez.`,
    ];
    button = { label: `Je continue avec ${p.packName}`, url: continueLink(p) };
  } else if (!ended) {
    subject = `${p.firstName}, votre roue n'a pas encore tourné : on vous aide ?`;
    title = `Encore ${plural(p.daysLeft, "jour", "jours")} pour la lancer`;
    paragraphs = [
      `Bonjour ${p.firstName},`,
      `Votre essai se termine le ${formatDay(p.trialEnd)} et la roue de ${p.shopName} n'a pas encore été jouée. C'est presque toujours une question d'emplacement : le QR code doit se voir au moment où le client paie.`,
      `Trois gestes qui font la différence : posez le chevalet juste à côté de la caisse, proposez la roue à chaque client en lui rendant la monnaie, et jouez une fois vous-même pour pouvoir la montrer.`,
      `Répondez à cet e-mail : on vous appelle pendant 5 minutes pour la mettre en place avec vous, et on prolonge votre essai le temps de voir les premiers résultats.`,
    ];
    button = { label: "Imprimer mon chevalet", url: `${brand.url}/espace/flyer` };
    link = undefined;
  } else if (played) {
    subject = `La roue de ${p.shopName} est en pause`;
    title = "Votre roue est en pause";
    paragraphs = [
      `Bonjour ${p.firstName},`,
      `Votre essai est terminé. Depuis ce matin, les clients qui scannent votre QR code voient un message de pause : ils repartent sans cadeau, et sans raison particulière de revenir. Pendant l'essai, voici ce que la roue avait fait :`,
      `La bonne nouvelle : rien n'est perdu. Vos lots, vos réglages et le QR code déjà imprimé restent les mêmes. ${p.payUrl ? "Prenez votre abonnement en ligne en deux minutes, et la roue repart aussitôt." : "Un clic ci-dessous, vous envoyez le message, et la roue repart dans la journée."}`,
      priceLine(p),
    ];
    if (offer) paragraphs.push(offer);
    button = { label: "Relancer ma roue", url: continueLink(p) };
  } else {
    subject = `${p.firstName}, on prolonge votre essai ?`;
    title = "Votre essai n'a pas eu le temps de faire ses preuves";
    paragraphs = [
      `Bonjour ${p.firstName},`,
      `Votre essai est terminé, mais la roue de ${p.shopName} n'a pas encore été jouée : vous n'avez donc pas pu voir ce qu'elle vaut. Ce serait dommage d'en rester là.`,
      `Répondez à cet e-mail : on vous appelle pendant 5 minutes pour la mettre en place avec vous et on relance votre essai pour quelques jours, sans rien vous facturer.`,
    ];
    button = { label: "Je veux relancer mon essai", url: `mailto:${brand.email}?subject=${encodeURIComponent(`Relancer mon essai (${p.shopName})`)}` };
    link = undefined;
  }
  if (offer && !ended) paragraphs.push(offer);

  const stats = played ? resultStats(r) : undefined;
  return {
    to: { email: p.email, name: p.firstName },
    subject,
    tags: ["essai"],
    replyTo: brand.email,
    html: layout({ color: TOMETTE, onColor: "#FFFFFF", title, paragraphs, stats, button, link, footer }),
    text: text([
      ...paragraphs.slice(0, 2),
      stats && stats.map((x) => `${x.value} ${x.label}`).join("\n"),
      ...paragraphs.slice(2),
      `${button.label} : ${button.url.startsWith("mailto:") ? `répondez à cet e-mail` : button.url}`,
      link && `${link.label} : ${link.url}`,
      footer,
    ]),
  };
}

/** Dernière relance, quelques jours après la fin de l'essai, pour qui n'a pas répondu. */
export function merchantTrialLastMail(p: TrialMailInput): Mail {
  const r = p.results;
  const played = r.parties > 0;
  const footer = `C'est notre dernier message à ce sujet. Vos réglages restent gardés si vous changez d'avis. ${brand.name}, ${brand.url.replace("https://", "")}.`;
  let subject: string;
  let title: string;
  let paragraphs: string[];
  let button: { label: string; url: string };
  if (played) {
    const perWeek = Math.max(1, Math.round((r.parties / Math.max(1, p.daysUsed)) * 7));
    subject = r.enAttente > 0 ? `${p.firstName}, ${plural(r.enAttente, "client a", "clients ont")} encore un cadeau à venir chercher` : `${p.firstName}, votre roue vous attend`;
    title = "Vos clients reviennent encore";
    paragraphs = [
      `Bonjour ${p.firstName},`,
      r.enAttente > 0
        ? `La roue de ${p.shopName} est en pause depuis quelques jours, mais elle travaille encore pour vous : ${plural(r.enAttente, "client a", "clients ont")} toujours un cadeau à venir chercher. C'est l'effet de la roue, et il va s'éteindre avec ces derniers cadeaux.`
        : `La roue de ${p.shopName} est en pause depuis quelques jours.`,
      `Les nouveaux clients, eux, ne peuvent plus jouer. Pendant votre essai, la roue tournait environ ${plural(perWeek, "fois", "fois")} par semaine : autant de raisons de revenir qui ne sont plus données.`,
      priceLine(p),
    ];
    if (p.offerLabel) paragraphs.push(`Votre cadeau de la roue Rouelia tient toujours : ${p.offerLabel}.`);
    button = { label: "Relancer ma roue", url: continueLink(p) };
  } else {
    subject = `${p.firstName}, on relance votre essai ?`;
    title = "On relance votre essai ?";
    paragraphs = [
      `Bonjour ${p.firstName},`,
      `Votre essai s'est terminé avant que la roue de ${p.shopName} ait pu tourner. C'est dommage : vous n'avez pas vu ce qu'elle peut faire pour vous.`,
      `Nous vous proposons de relancer votre essai gratuitement, avec un appel de 5 minutes pour la mettre en place ensemble. Il suffit de répondre à cet e-mail.`,
    ];
    button = { label: "Je veux relancer mon essai", url: `mailto:${brand.email}?subject=${encodeURIComponent(`Relancer mon essai (${p.shopName})`)}` };
  }
  return {
    to: { email: p.email, name: p.firstName },
    subject,
    tags: ["essai"],
    replyTo: brand.email,
    html: layout({ color: TOMETTE, onColor: "#FFFFFF", title, paragraphs, button, footer }),
    text: text([...paragraphs, `${button.label} : ${button.url.startsWith("mailto:") ? "répondez à cet e-mail" : button.url}`, footer]),
  };
}

export interface WeeklyNumbers {
  visites: number;
  parties: number;
  avisClics: number;
  retraits: number;
  enAttente: number;
  expirentBientot: number;
}

/** L'action simple à faire la semaine suivante, choisie d'après les chiffres. */
export function weeklyAction(n: WeeklyNumbers): string {
  if (n.visites === 0) return "Personne n'a scanné le QR code cette semaine : posez-le bien en vue, près de la caisse, et proposez à chaque client de jouer.";
  if (n.parties < n.visites / 3) return "Beaucoup de scans mais peu de parties : vérifiez que le QR code mène bien à la roue et invitez les clients à aller jusqu'au bout.";
  if (n.expirentBientot > 0)
    return `${n.expirentBientot} ${n.expirentBientot > 1 ? "cadeaux expirent" : "cadeau expire"} dans les 7 jours : rappelez-le aux habitués que vous voyez passer.`;
  if (n.parties > 0 && n.retraits === 0) return "Aucun cadeau retiré cette semaine : pensez à demander en caisse « Vous avez gagné un cadeau à la roue ? ».";
  return "Tout roule : continuez à proposer la roue à chaque client, c'est ce qui fait la différence.";
}

export function merchantWeeklyMail(p: { email: string; firstName: string; shopName: string; numbers: WeeklyNumbers }): Mail {
  const n = p.numbers;
  const lines = [
    `Bonjour ${p.firstName},`,
    `Voici la semaine de ${p.shopName} :`,
    `Scans du QR code : ${n.visites}. Parties jouées : ${n.parties}. Clics vers les avis Google : ${n.avisClics}. Cadeaux retirés : ${n.retraits}. Cadeaux en attente : ${n.enAttente}.`,
    `L'action de la semaine : ${weeklyAction(n)}`,
  ];
  return {
    to: { email: p.email, name: p.firstName },
    subject: `Votre semaine Rouelia : ${n.parties} ${n.parties > 1 ? "parties" : "partie"}, ${n.retraits} ${n.retraits > 1 ? "cadeaux retirés" : "cadeau retiré"}`,
    tags: ["rapport"],
    replyTo: brand.email,
    ...rouelia("Votre semaine", lines, { label: "Voir le suivi", url: `${brand.url}/espace#suivi` }),
  };
}

/* ------------------------------------------------------------------ */
/* Inscriptions sur le site                                            */
/* ------------------------------------------------------------------ */

export function signupConfirmMail(p: { email: string; firstName: string; shopName: string }): Mail {
  return {
    to: { email: p.email, name: p.firstName },
    subject: "Votre demande d'essai Rouelia est bien reçue",
    tags: ["inscription"],
    replyTo: brand.email,
    ...rouelia("C'est noté, merci", [
      `Bonjour ${p.firstName},`,
      `Votre demande d'essai pour ${p.shopName} est enregistrée, avec la roue que vous avez réglée.`,
      "Nous validons votre inscription et vous envoyons votre accès par e-mail, en général en quelques minutes (24 h maximum). Vous créerez alors votre mot de passe, et votre roue sera prête.",
      "Une question d'ici là ? Répondez simplement à cet e-mail.",
    ]),
  };
}

export function signupAlertMail(p: { firstName: string; shopName: string; email: string; phone: string; pack: string; offer: string | null }): Mail {
  const lines = [
    `Nouvelle inscription : ${p.shopName} (${p.firstName}).`,
    `Pack ${p.pack}. Téléphone : ${p.phone}. E-mail : ${p.email}.`,
    p.offer ? `Cadeau de la roue d'offres : ${p.offer}.` : "Pas de cadeau de la roue d'offres.",
  ];
  return {
    to: { email: brand.email, name: brand.name },
    subject: `Nouvelle inscription : ${p.shopName}`,
    tags: ["alerte"],
    replyTo: p.email,
    ...rouelia("Nouvelle inscription", lines, { label: "Ouvrir l'admin", url: `${brand.url}/admin` }, "Alerte interne Rouelia."),
  };
}

/* Appels de découverte et demandes « Créez-la pour moi » ------------------------------------------ */

export function bookingAlertMail(p: { name: string; phone: string; email: string; shop: string; when: string }): Mail {
  return {
    to: { email: brand.email, name: brand.name },
    subject: `Appel réservé : ${p.when}`,
    tags: ["rendez-vous"],
    replyTo: p.email,
    ...rouelia("Nouvel appel réservé", [
      `Créneau : ${p.when} (heure de Paris), 5 minutes.`,
      `Nom : ${p.name}. Téléphone : ${p.phone}. E-mail : ${p.email}.`,
      `Commerce : ${p.shop || "non précisé"}.`,
    ], undefined, "Alerte interne Rouelia."),
  };
}

export function bookingConfirmMail(p: { name: string; email: string; phone: string; when: string; ics: string }): Mail {
  return {
    to: { email: p.email, name: p.name },
    subject: `Votre appel Rouelia : ${p.when}`,
    tags: ["rendez-vous"],
    replyTo: brand.email,
    attachments: [{ filename: "appel-rouelia.ics", content: p.ics }],
    ...rouelia("Votre appel est réservé", [
      `Bonjour ${p.name},`,
      `Nous vous appelons ${p.when} (heure de Paris) au ${p.phone}. Cinq minutes pour répondre à vos questions sur Rouelia, sans engagement.`,
      "L'invitation pour votre agenda est jointe à cet e-mail. Besoin de décaler ? Répondez simplement à ce message.",
    ]),
  };
}

export interface WheelRequestMail {
  shopName: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  google: string;
  prizes: string;
  message: string;
  logoName: string | null;
  /** Nom du pack choisi pour l'essai (Croissance ou Premium). */
  pack: string;
}

export function wheelRequestAlertMail(p: WheelRequestMail, logo: { filename: string; content: string; base64: true } | null): Mail {
  return {
    to: { email: brand.email, name: brand.name },
    subject: `Roue à créer : ${p.shopName}`,
    tags: ["roue-a-creer"],
    replyTo: p.email,
    ...(logo ? { attachments: [logo] } : {}),
    ...rouelia("Demande « Créez-la pour moi »", [
      `Commerce : ${p.shopName}. Contact : ${p.name || "non précisé"}.`,
      `Pack de l'essai : ${p.pack}.`,
      `Téléphone : ${p.phone}. E-mail : ${p.email}.`,
      `Adresse : ${p.address}.`,
      `Fiche Google : ${p.google}.`,
      `Lots souhaités : ${p.prizes || "à proposer"}.`,
      `Message : ${p.message || "aucun"}.`,
      p.logoName ? `Logo joint : ${p.logoName}.` : "Pas de logo envoyé.",
    ], undefined, "Alerte interne Rouelia. Envoyer le QR code en quelques heures."),
  };
}

export function wheelRequestConfirmMail(p: { email: string; name: string; shopName: string; pack: string }): Mail {
  return {
    to: { email: p.email, name: p.name || p.shopName },
    subject: "Votre roue Rouelia est en préparation",
    tags: ["roue-a-creer"],
    replyTo: brand.email,
    ...rouelia("C'est parti", [
      `Bonjour${p.name ? ` ${p.name}` : ""},`,
      `Nous préparons la roue de ${p.shopName}. Vous recevrez votre QR code par e-mail en quelques heures, avec votre essai gratuit de 14 jours sur le pack ${p.pack}.`,
      "Une précision à ajouter ? Répondez simplement à cet e-mail.",
    ]),
  };
}

/* Demandes « Autre activité » (page /pour-qui) ------------------------------------------------- */

export function otherActivityAlertMail(p: { name: string; description: string; prizes: string; phone: string; email: string }): Mail {
  return {
    to: { email: brand.email, name: brand.name },
    subject: `Autre activité : ${p.name}`,
    tags: ["autre-activite"],
    replyTo: p.email,
    ...rouelia("Demande « Autre activité »", [
      `Commerce ou activité : ${p.name}.`,
      `Activité : ${p.description}`,
      `Cadeaux souhaités : ${p.prizes || "à proposer"}.`,
      `Téléphone : ${p.phone}. E-mail : ${p.email}.`,
    ], undefined, "Alerte interne Rouelia, depuis la page Pour qui."),
  };
}

export function otherActivityConfirmMail(p: { email: string; name: string }): Mail {
  return {
    to: { email: p.email, name: p.name },
    subject: "Votre demande Rouelia est bien reçue",
    tags: ["autre-activite"],
    replyTo: brand.email,
    ...rouelia("C'est bien reçu", [
      "Bonjour,",
      `Merci pour votre message au sujet de ${p.name}. Nous étudions votre activité et vous répondons avec une proposition de roue et de cadeaux adaptés, en général en quelques heures.`,
      "Une précision à ajouter ? Répondez simplement à cet e-mail.",
    ]),
  };
}
