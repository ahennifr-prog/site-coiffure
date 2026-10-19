import { addDays, parisDay } from "@/lib/dates";
import { database } from "@/lib/db";
import type { Shop } from "@/lib/shop-config";

/**
 * Durées de conservation, en jours. Ce sont celles annoncées sur le site :
 * règlement du jeu (joueurs) et politique de confidentialité (commerçants, appels, demandes).
 */
export const RETENTION = {
  /** Parties des joueurs : 1 an après la date limite du cadeau. */
  playsAfterExpiry: 365,
  /** Prospects (essai jamais payé, demande, appel) : 3 ans. */
  prospects: 3 * 365,
  /** Anciens clients : 5 ans après la fin de la dernière période payée. */
  formerClients: 5 * 365,
  /** Compteurs anti-abus (clés liées à une adresse IP) : 2 jours. */
  rates: 2,
};

const DAY = 86_400_000;
const before = (now: Date, days: number) => new Date(now.getTime() - days * DAY).toISOString();

/** Date de fin d'un commerce pour la conservation, ou null s'il est toujours en cours (client actif ou essai non terminé). */
export function shopEnd(shop: Pick<Shop, "plan" | "trialEndsAt" | "stripe">): { day: string; client: boolean } | null {
  if (shop.plan === "active") return null;
  // Déjà payé une fois : on compte à partir de la fin de la dernière période payée.
  if (shop.stripe?.periodEnd) return { day: shop.stripe.periodEnd, client: true };
  if (shop.stripe?.subscriptionId) return null; // abonnement sans date connue : on garde, par prudence
  return { day: parisDay(new Date(shop.trialEndsAt)), client: false };
}

export type PurgeReport = { parties: number; verrous: number; antiAbus: number; appels: number; demandes: number; inscriptions: number; commerces: number };

/**
 * Ménage quotidien (tâche planifiée de 6 h, voir lib/notify.ts) : supprime ce qui a dépassé sa durée de conservation.
 * Rien de ce qui sert encore n'est touché : cadeau encore valable, essai en cours, client actif.
 * Le compte rendu ne contient que des nombres, jamais de nom ni de numéro.
 */
export async function purgeExpired(now = new Date()): Promise<PurgeReport> {
  const db = await database();
  const today = parisDay(now);
  const changes = async (sql: string, ...args: unknown[]) => ((await db.prepare(sql).bind(...args).run()) as { meta?: { changes?: number } }).meta?.changes ?? 0;
  const r: PurgeReport = { parties: 0, verrous: 0, antiAbus: 0, appels: 0, demandes: 0, inscriptions: 0, commerces: 0 };

  // 1. Joueurs : parties dont le cadeau a expiré depuis plus d'un an, et verrous « une partie par période » échus.
  r.parties = await changes("DELETE FROM plays WHERE expires_on < ?", addDays(today, -RETENTION.playsAfterExpiry));
  r.verrous = await changes("DELETE FROM play_locks WHERE until < ?", now.toISOString());

  // 2. Compteurs anti-abus (fenêtres d'une heure, au format AAAA-MM-JJTHH).
  r.antiAbus = await changes("DELETE FROM rates WHERE win < ?", before(now, RETENTION.rates).slice(0, 13));

  // 3. Appels réservés et demandes « Créez-la pour moi » ou « Autre activité » de plus de 3 ans.
  r.appels = await changes("DELETE FROM bookings WHERE slot < ?", before(now, RETENTION.prospects).slice(0, 16));
  r.demandes = await changes("DELETE FROM wheel_requests WHERE created_at < ?", before(now, RETENTION.prospects));

  // 4. Commerces arrêtés : 3 ans après la fin d'un essai jamais payé, 5 ans après la fin de la dernière période payée.
  const { results: shops } = await db.prepare("SELECT id, data FROM shops").all<{ id: string; data: string }>();
  const kept = new Set<string>();
  for (const row of shops) {
    const shop = JSON.parse(row.data) as Shop;
    const end = shopEnd(shop);
    const limit = end ? addDays(end.day, end.client ? RETENTION.formerClients : RETENTION.prospects) : null;
    if (!limit || limit >= today) {
      if (shop.signupId) kept.add(shop.signupId);
      continue;
    }
    for (const sql of [
      "DELETE FROM plays WHERE shop_id = ?",
      "DELETE FROM play_locks WHERE shop_id = ?",
      "DELETE FROM shop_logos WHERE shop_id = ?",
      "DELETE FROM stats WHERE shop_id = ?",
    ])
      await changes(sql, row.id);
    r.commerces += await changes("DELETE FROM shops WHERE id = ?", row.id);
  }

  // 5. Inscriptions de plus de 3 ans sans commerce encore gardé (prospects, ou commerce supprimé ci-dessus).
  const { results: old } = await db.prepare("SELECT id FROM signups WHERE created_at < ?").bind(before(now, RETENTION.prospects)).all<{ id: string }>();
  for (const { id } of old) {
    if (kept.has(id)) continue;
    await changes("DELETE FROM signup_logos WHERE signup_id = ?", id);
    r.inscriptions += await changes("DELETE FROM signups WHERE id = ?", id);
  }
  return r;
}
