/** Modèles d'e-mails : HTML simple (styles en ligne, lisible partout) et version texte. */
import { brand } from "@/content";
import { formatDay } from "@/lib/dates";
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
  footer: string;
}

function layout(l: Layout): string {
  const p = (t: string) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.5;color:#1D1A16">${esc(t)}</p>`;
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#FBF6EE;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF6EE;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E8DFD2">
<tr><td style="background:${l.color};color:${l.onColor};padding:22px 26px;font-size:24px;font-weight:bold;font-family:Georgia,serif">${esc(l.title)}</td></tr>
<tr><td style="padding:24px 26px 8px">
${l.paragraphs.map(p).join("\n")}
${l.highlight ? `<div style="margin:6px 0 18px;padding:14px 16px;border:2px dashed #E8DFD2;border-radius:12px"><div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#5E564E">${esc(l.highlight.label)}</div><div style="font-family:'Courier New',monospace;font-size:26px;font-weight:bold;letter-spacing:2px;color:#1D1A16">${esc(l.highlight.value)}</div></div>` : ""}
${l.button ? `<p style="margin:6px 0 22px"><a href="${esc(l.button.url)}" style="display:inline-block;background:#1D1A16;color:#FFFFFF;text-decoration:none;font-weight:bold;padding:13px 22px;border-radius:999px">${esc(l.button.label)}</a></p>` : ""}
</td></tr>
<tr><td style="padding:14px 26px 22px;font-size:12px;line-height:1.5;color:#5E564E;border-top:1px solid #E8DFD2">${esc(l.footer)}</td></tr>
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

export function merchantTrialMail(p: { email: string; firstName: string; shopName: string; daysLeft: number; trialEnd: string; packName: string; price: number }): Mail {
  const ended = p.daysLeft <= 0;
  return {
    to: { email: p.email, name: p.firstName },
    subject: ended ? "Votre essai Rouelia est terminé" : `Votre essai Rouelia se termine dans ${p.daysLeft} jours`,
    tags: ["essai"],
    replyTo: brand.email,
    ...rouelia(
      ended ? "Votre essai est terminé" : "Votre essai se termine bientôt",
      ended
        ? [
            `Bonjour ${p.firstName},`,
            `L'essai gratuit de ${p.shopName} est terminé : la roue affiche maintenant un message de pause à vos clients. Les cadeaux déjà gagnés restent valables en caisse.`,
            `Pour continuer avec le pack ${p.packName} (${p.price} € par mois, sans engagement), répondez simplement à cet e-mail.`,
          ]
        : [
            `Bonjour ${p.firstName},`,
            `L'essai gratuit de ${p.shopName} se termine le ${formatDay(p.trialEnd)}.`,
            `Pour continuer avec le pack ${p.packName} (${p.price} € par mois, sans engagement), répondez simplement à cet e-mail. Sinon, la roue se mettra en pause et rien ne vous sera facturé.`,
          ],
      { label: "Ouvrir mon espace", url: `${brand.url}/espace` },
    ),
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
      "On vous écrit très vite pour ouvrir votre accès. Une question d'ici là ? Répondez simplement à cet e-mail.",
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
