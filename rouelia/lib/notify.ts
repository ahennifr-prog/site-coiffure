/** E-mails automatiques : qui reçoit quoi, et quand. */
import { brand, pricing } from "@/content";
import { addDays, parisClock, parisDay } from "@/lib/dates";
import { markReminded, periodNumbers, playsToRemind, type Play } from "@/lib/game";
import { sendMail } from "@/lib/mail";
import {
  clientCodeMail, clientReminderMail, merchantInviteMail, merchantResetMail, merchantTrialMail, merchantWeeklyMail,
} from "@/lib/mail-templates";
import { getShop, listShops, packFeatures, saveShop, shopTheme, withDefaults, type Shop } from "@/lib/shops";

export const inviteUrl = (token: string) => `${brand.url}/espace/invitation#${token}`;

function shopInfo(shop: Shop) {
  const s = withDefaults(shop.settings);
  const theme = shopTheme(s);
  return { name: s.name, address: s.address, color: theme.primary, onColor: theme.onPrimary, replyTo: shop.email, gameUrl: `${brand.url}/j/${shop.slug}` };
}

/** Code gagné, envoyé au client qui a donné son e-mail. */
export async function sendClientCode(shop: Shop, play: Play, now = new Date()) {
  if (!play.email) return { ok: false as const, skipped: true };
  return sendMail(clientCodeMail(shopInfo(shop), play, play.email, parisDay(now)));
}

export async function sendInvite(shop: Shop, token: string) {
  return sendMail(merchantInviteMail({ email: shop.email, firstName: shop.firstName, shopName: shop.settings.name, link: inviteUrl(token), trialEnd: parisDay(new Date(shop.trialEndsAt)) }));
}

export async function sendReset(shop: Shop, token: string) {
  return sendMail(merchantResetMail({ email: shop.email, firstName: shop.firstName, link: inviteUrl(token) }));
}

const REMIND_DAYS_BEFORE = 3;
const TRIAL_WARNING_DAYS = 3;

/**
 * Tâche quotidienne (le matin) :
 * rappel des cadeaux qui expirent dans 3 jours (Croissance et Premium),
 * fin d'essai proche ou atteinte, rapport hebdomadaire le lundi.
 */
export async function runDaily(now = new Date()) {
  const today = parisDay(now);
  const done = { rappels: 0, essais: 0, rapports: 0, erreurs: 0 };
  const shops = new Map<string, Shop>();
  const shopOf = async (id: string) => {
    if (!shops.has(id)) {
      const s = await getShop(id);
      if (s) shops.set(id, s);
    }
    return shops.get(id) ?? null;
  };

  // 1. Rappels clients
  for (const { shopId, play } of await playsToRemind(addDays(today, REMIND_DAYS_BEFORE))) {
    const shop = await shopOf(shopId);
    if (!shop || !play.email || !packFeatures(shop.pack).reminders) continue;
    const r = await sendMail(clientReminderMail(shopInfo(shop), play, play.email, today));
    if (r.ok) {
      await markReminded(shopId, play.code);
      done.rappels++;
    } else if (!("skipped" in r && r.skipped)) done.erreurs++;
  }

  const monday = parisClock(now).weekday === 1;
  for (const listed of await listShops()) {
    const { hasPassword: _h, ...shop } = listed;
    const mails = { ...(shop.mails ?? {}) };
    let changed = false;
    const pack = pricing.packs.find((p) => p.id === shop.pack) ?? pricing.packs[0];

    // 2. Fin d'essai : 3 jours avant, puis le jour où elle est atteinte
    if (shop.plan === "trial") {
      const end = parisDay(new Date(shop.trialEndsAt));
      const daysLeft = Math.round((Date.parse(end) - Date.parse(today)) / 86_400_000);
      const kind = daysLeft <= 0 ? "trialEnded" : daysLeft <= TRIAL_WARNING_DAYS ? "trialSoon" : null;
      if (kind && !mails[kind]) {
        const r = await sendMail(merchantTrialMail({ email: shop.email, firstName: shop.firstName, shopName: shop.settings.name, daysLeft, trialEnd: end, packName: pack.name, price: pack.price }));
        if (r.ok) {
          mails[kind] = today;
          changed = true;
          done.essais++;
        } else if (!("skipped" in r && r.skipped)) done.erreurs++;
      }
    }

    // 3. Rapport hebdomadaire du lundi, pour les commerces en activité
    if (monday && shop.plan !== "paused" && mails.weekly !== today) {
      const numbers = await periodNumbers(shop.id, addDays(today, -7), addDays(today, -1), today);
      const r = await sendMail(merchantWeeklyMail({ email: shop.email, firstName: shop.firstName, shopName: shop.settings.name, numbers }));
      if (r.ok) {
        mails.weekly = today;
        changed = true;
        done.rapports++;
      } else if (!("skipped" in r && r.skipped)) done.erreurs++;
    }

    if (changed) await saveShop({ ...shop, mails });
  }
  return done;
}
