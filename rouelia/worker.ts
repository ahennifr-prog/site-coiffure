/**
 * Entrée du Worker Cloudflare : le site Next.js (OpenNext) tel quel,
 * plus une tâche planifiée chaque matin (rappels, fins d'essai, rapport du lundi).
 */
// @ts-expect-error Fichier généré par `opennextjs-cloudflare build`.
import handler from "./.open-next/worker.js";

interface Env {
  SESSION_SECRET?: string;
  [key: string]: unknown;
}

interface Ctx {
  waitUntil(p: Promise<unknown>): void;
}

export default {
  fetch: handler.fetch,
  async scheduled(_event: unknown, env: Env, ctx: Ctx) {
    // Appel interne à la route /api/cron : la requête ne sort jamais du Worker.
    const req = new Request("https://rouelia.fr/api/cron", { method: "POST", headers: { "x-cron-secret": env.SESSION_SECRET ?? "" } });
    ctx.waitUntil(handler.fetch(req, env, ctx));
  },
};

// @ts-expect-error Fichier généré par `opennextjs-cloudflare build`.
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";
