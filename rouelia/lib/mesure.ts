import { addDays, parisDay } from "@/lib/dates";
import { database } from "@/lib/db";
import { SITE_EVENTS, type SiteEvent } from "@/lib/mesure-events";

/** Identifiant réservé dans la table stats : aucun commerce ne peut l'avoir (les identifiants sont des UUID). */
export const SITE_ID = "_site";

/** Ajoute 1 au compteur du jour. Ne bloque jamais la réponse : une mesure perdue vaut mieux qu'un envoi en échec. */
export async function countEvent(event: SiteEvent, now = new Date()): Promise<void> {
  try {
    const db = await database();
    await db
      .prepare("INSERT INTO stats (shop_id, day, field, n) VALUES (?, ?, ?, 1) ON CONFLICT (shop_id, day, field) DO UPDATE SET n = n + 1")
      .bind(SITE_ID, parisDay(now), event)
      .run();
  } catch (e) {
    console.error("[mesure] compteur indisponible", e);
  }
}

/** Totaux par événement sur les derniers jours, pour l'espace admin. */
export async function siteCounts(days = 30, now = new Date()) {
  const db = await database();
  const today = parisDay(now);
  const from = addDays(today, -(days - 1));
  const { results } = await db
    .prepare("SELECT day, field, n FROM stats WHERE shop_id = ? AND day >= ?")
    .bind(SITE_ID, from)
    .all<{ day: string; field: string; n: number }>();
  const total = (field: string, since = from) => results.filter((r) => r.field === field && r.day >= since).reduce((a, r) => a + Number(r.n), 0);
  const week = addDays(today, -6);
  return (Object.keys(SITE_EVENTS) as SiteEvent[]).map((id) => ({ id, label: SITE_EVENTS[id], last7: total(id, week), last30: total(id) }));
}
