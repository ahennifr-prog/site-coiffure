import { getSignupLogo, updateSignup } from "@/lib/db";
import { sendInvite } from "@/lib/notify";
import { createInvite, insertShop, setLogo, shopFromSignup, slugify, uniqueSlug, type Shop } from "@/lib/shops";
import type { SignupRecord } from "@/lib/signup";

/**
 * Ouvre l'essai d'une inscription : crée le commerce et sa roue, passe l'inscription en « essai en cours ».
 * Avec `invite` (par défaut), crée aussi le lien pour choisir le mot de passe et l'envoie par e-mail.
 * Utilisé à l'inscription sur le site (ouverture automatique) et depuis l'admin.
 */
export async function openTrial(signup: SignupRecord, now = new Date(), { invite = true } = {}): Promise<{ shop: Shop; token: string | null; emailed: boolean }> {
  const shop = shopFromSignup(signup, crypto.randomUUID(), await uniqueSlug(slugify(signup.wheelConfig?.shopName || signup.shopName)), now);
  await insertShop(shop);
  // Logo envoyé avec « Créez-la pour moi » : il est posé directement sur la roue.
  const logo = signup.request?.hasLogo ? await getSignupLogo(signup.id) : null;
  if (logo) await setLogo(shop, logo, now);
  await updateSignup({ ...signup, shopId: shop.id, status: "essai_en_cours", trialStartedAt: now.toISOString() });
  if (!invite) return { shop, token: null, emailed: false };
  const token = await createInvite(shop.id, now);
  // Le lien part aussi par e-mail au commerçant quand l'envoi d'e-mails est branché.
  const emailed = (await sendInvite(shop, token)).ok;
  return { shop, token, emailed };
}
