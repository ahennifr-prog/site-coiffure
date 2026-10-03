/**
 * Génère une page d'aperçu de tous les e-mails envoyés par Rouelia, avec des exemples.
 * Usage : npx tsx scripts/apercu-emails.ts sortie.html
 */
import { writeFileSync } from "node:fs";
import {
  clientCodeMail, clientReminderMail, merchantInviteMail, merchantResetMail, merchantTrialMail, merchantWeeklyMail,
  signupAlertMail, signupConfirmMail,
} from "../lib/mail-templates";
import type { Mail } from "../lib/mail";

const shop = { name: "Salon Martine", address: "12 rue des Lilas, 94500 Champigny-sur-Marne", color: "#E7B4A6", onColor: "#1D1A16", replyTo: "martine@salon.fr", gameUrl: "https://rouelia.fr/j/salon-martine" };
const play = { firstName: "Léa", prizeName: "Soin profond offert", prizeDetail: "Un soin offert avec votre prochaine coupe.", code: "SAL-7K4M2", validFrom: "2026-10-04", expiresOn: "2026-11-03" };

const mails: [string, string, Mail][] = [
  ["Client du commerce", "Juste après la partie, s'il a donné son e-mail", clientCodeMail(shop, play, "lea@exemple.fr", "2026-10-03")],
  ["Client du commerce", "3 jours avant la date limite, cadeau pas encore retiré (Croissance, Premium), une seule fois", clientReminderMail(shop, play, "lea@exemple.fr", "2026-10-31")],
  ["Commerçant", "Quand vous ouvrez son essai dans /admin", merchantInviteMail({ email: "martine@salon.fr", firstName: "Martine", shopName: "Salon Martine", link: "https://rouelia.fr/espace/invitation#exemple", trialEnd: "2026-10-17" })],
  ["Commerçant", "Mot de passe oublié", merchantResetMail({ email: "martine@salon.fr", firstName: "Martine", link: "https://rouelia.fr/espace/invitation#exemple" })],
  ["Commerçant", "3 jours avant la fin de l'essai", merchantTrialMail({ email: "martine@salon.fr", firstName: "Martine", shopName: "Salon Martine", daysLeft: 3, trialEnd: "2026-10-17", packName: "Croissance", price: 49 })],
  ["Commerçant", "Le jour de la fin de l'essai", merchantTrialMail({ email: "martine@salon.fr", firstName: "Martine", shopName: "Salon Martine", daysLeft: 0, trialEnd: "2026-10-17", packName: "Croissance", price: 49 })],
  ["Commerçant", "Chaque lundi matin", merchantWeeklyMail({ email: "martine@salon.fr", firstName: "Martine", shopName: "Salon Martine", numbers: { visites: 64, parties: 41, avisClics: 12, retraits: 9, enAttente: 23, expirentBientot: 5 } })],
  ["Commerçant qui s'inscrit", "Juste après l'inscription sur rouelia.fr", signupConfirmMail({ email: "martine@salon.fr", firstName: "Martine", shopName: "Salon Martine" })],
  ["Vous (contact@rouelia.fr)", "À chaque inscription", signupAlertMail({ firstName: "Martine", shopName: "Salon Martine", email: "martine@salon.fr", phone: "+33612345678", pack: "Croissance", offer: "Essai prolongé à 21 jours (à appliquer)" })],
];

const sms: [string, string, string][] = [
  ["Client", "Juste après la partie, si pas d'e-mail (au lieu de l'e-mail)", "Salon Martine : bravo Léa, vous avez gagné Soin profond offert. Code SAL-7K4M2, à montrer en caisse jusqu'au 03/11."],
  ["Client", "3 jours avant la date limite (cadeau pas retiré)", "Salon Martine : Léa, votre Soin profond offert expire le 03/11. Code SAL-7K4M2. On vous attend !"],
  ["Client qui a accepté les offres", "Le jour de son anniversaire (si date donnée en jouant)", "Salon Martine vous souhaite un joyeux anniversaire Léa ! -10 % sur votre prochaine visite ce mois-ci. STOP au 36xxx"],
  ["Client qui a accepté les offres", "Campagne de retour : pas revenu depuis 60 jours", "Salon Martine : Léa, cela fait un moment ! Un nouveau tour de roue vous attend en boutique. STOP au 36xxx"],
  ["Commerçant (Croissance, Premium)", "Chaque lundi, à la place ou en plus de l'e-mail", "Rouelia, votre semaine : 41 parties, 9 cadeaux retirés, 5 expirent sous 7 jours. Action : rappelez-le aux habitués. rouelia.fr/espace"],
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const smsLen = (t: string) => `${t.length} caractères`;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aperçu des messages Rouelia</title>
<style>
body{margin:0;background:#FBF6EE;font-family:Arial,Helvetica,sans-serif;color:#1D1A16}
main{max-width:720px;margin:0 auto;padding:24px 16px 60px}
h1{font-family:Georgia,serif;font-size:30px;margin:0 0 6px}
h2{font-family:Georgia,serif;font-size:24px;margin:40px 0 10px}
.lead{color:#5E564E;margin:0 0 10px;line-height:1.5}
.card{background:#fff;border:1px solid #E8DFD2;border-radius:14px;margin:18px 0;overflow:hidden}
.meta{padding:12px 16px;border-bottom:1px solid #E8DFD2;font-size:14px;line-height:1.5}
.meta b{display:block;font-size:16px}
.tag{display:inline-block;background:#F6D9CE;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:bold;margin-right:6px}
iframe{width:100%;height:560px;border:0;display:block}
.sms{padding:14px 16px}
.bubble{background:#E9E9EB;border-radius:18px;padding:10px 14px;max-width:320px;font-size:15px;line-height:1.4}
.small{color:#5E564E;font-size:12px;margin-top:6px}
.note{background:#FCEBC8;border:1px solid #F3B23C;border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.5}
</style></head><body><main>
<h1>Aperçu des messages Rouelia</h1>
<p class="lead">Exemples avec un commerce fictif, Salon Martine, et une cliente, Léa. Les e-mails sont générés par le vrai code du site. Les SMS sont des propositions à valider : ils ne sont pas encore codés (groupe 3).</p>
<h2>E-mails (codés, partent dès que la clé Brevo est en place)</h2>
${mails.map(([who, when, m]) => `<div class="card"><div class="meta"><span class="tag">${esc(who)}</span>${esc(when)}<b>Objet : ${esc(m.subject)}</b>Expéditeur : ${esc(m.fromName ?? "Rouelia")} &lt;contact@rouelia.fr&gt;${m.replyTo ? `, réponses vers ${esc(m.replyTo)}` : ""}</div><div class="mail">${m.html.replace(/^[\s\S]*?<body[^>]*>/, "").replace(/<\/body>[\s\S]*$/, "")}</div></div>`).join("\n")}
<h2>SMS (propositions, pas encore codés)</h2>
<p class="note">Un SMS fait 160 caractères. Les lettres comme « ê », « ç » ou « ô » le font passer à 70 caractères et doublent le prix : je les évite autant que possible. Les SMS publicitaires (anniversaire, campagne de retour) ne partent qu'aux clients qui ont coché « recevoir des offres », jamais le dimanche ni la nuit, avec la mention STOP obligatoire (le numéro exact sera celui donné par Brevo).</p>
${sms.map(([who, when, t]) => `<div class="card"><div class="meta"><span class="tag">${esc(who)}</span>${esc(when)}</div><div class="sms"><div class="bubble">${esc(t)}</div><div class="small">${smsLen(t)}</div></div></div>`).join("\n")}
</main></body></html>`;

writeFileSync(process.argv[2] ?? "apercu-emails.html", html);
console.log("ok");
