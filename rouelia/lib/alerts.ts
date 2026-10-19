import { pricing } from "@/content";
import { database, getSignup, updateSignup } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { adminAlertMail } from "@/lib/mail-templates";
import type { Shop } from "@/lib/shops";

/**
 * Alertes immédiates à contact@rouelia.fr sur la vie des commerces (en plus des alertes d'inscription,
 * de demande « Créez-la pour moi », d'appel réservé et d'« Autre activité »).
 * Une alerte qui ne part pas ne bloque jamais l'action du commerçant ou du client.
 */
const name = (shop: Shop) => shop.settings.name || shop.slug;
const packName = (shop: Shop) => pricing.packs.find((p) => p.id === shop.pack)?.name ?? shop.pack;

async function send(subject: string, title: string, lines: string[], replyTo?: string) {
  try {
    await sendMail(adminAlertMail({ subject, title, lines, replyTo }));
  } catch (e) {
    console.error("[alerte]", subject, e);
  }
}

/** Le commerçant a choisi son mot de passe : il est entré dans son espace. */
export const alertActivated = (shop: Shop) =>
  send(`Accès activé : ${name(shop)}`, "Un commerçant vient d'entrer dans son espace", [
    `${shop.firstName} (${name(shop)}) a choisi son mot de passe et a ouvert son espace.`,
    `Pack ${packName(shop)}. Téléphone : ${shop.phone}. E-mail : ${shop.email}.`,
    "C'est un bon moment pour l'appeler et l'aider à poser son QR code.",
  ], shop.email);

/** Première partie jouée sur la roue d'un commerce : le QR code est en place. Renvoie true si l'alerte est partie. */
export async function alertIfFirstPlay(shop: Shop, now = new Date()): Promise<boolean> {
  try {
    const db = await database();
    const row = await db.prepare("SELECT COUNT(*) AS n FROM plays WHERE shop_id = ?").bind(shop.id).first<{ n: number }>();
    if ((row?.n ?? 0) !== 1) return false;
    const signup = shop.signupId ? await getSignup(shop.signupId) : null;
    if (signup && !signup.firstPlayAt) await updateSignup({ ...signup, firstPlayAt: now.toISOString() });
  } catch (e) {
    console.error("[alerte] première partie", e);
    return false;
  }
  await send(`Première partie : ${name(shop)}`, "Une roue vient de tourner pour la première fois", [
    `Un premier client vient de jouer chez ${name(shop)}. Le QR code est en place.`,
    `Contact : ${shop.firstName}, ${shop.phone}, ${shop.email}.`,
  ], shop.email);
  return true;
}

/** Changement d'abonnement : nouveau client payant, ou abonnement arrêté. */
export async function alertSubscription(before: Shop, after: Shop) {
  if (after.plan === "active" && before.plan !== "active")
    await send(`Nouveau client : ${name(after)}`, "Un commerçant vient de s'abonner", [
      `${after.firstName} (${name(after)}) a payé son abonnement, pack ${packName(after)}.`,
      `Téléphone : ${after.phone}. E-mail : ${after.email}.`,
    ], after.email);
  else if (before.plan === "active" && after.plan !== "active")
    await send(`Abonnement arrêté : ${name(after)}`, "Un abonnement vient de s'arrêter", [
      `L'abonnement de ${name(after)} (${after.firstName}) est arrêté ou impayé.`,
      `Téléphone : ${after.phone}. E-mail : ${after.email}. Un appel peut aider à comprendre pourquoi.`,
    ], after.email);
}
