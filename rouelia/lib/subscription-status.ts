import { formatDay } from "@/lib/dates";

/** Ce que l'admin doit savoir de l'abonnement Stripe d'un commerce (sans rien importer du serveur). */
export interface SubscriptionInfo {
  status: string;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  /** Jour où le commerçant a demandé la résiliation (AAAA-MM-JJ). */
  cancelRequestedOn?: string | null;
  /** Jour où l'abonnement s'est arrêté (AAAA-MM-JJ). */
  endedOn?: string | null;
}

export type SubscriptionTone = "ok" | "alerte" | "arret";

/** Résumé court de l'abonnement pour l'admin, ou null si le commerce ne s'est jamais abonné. */
export function subscriptionNote(sub: SubscriptionInfo | null | undefined): { label: string; tone: SubscriptionTone } | null {
  if (!sub) return null;
  const end = sub.periodEnd ? formatDay(sub.periodEnd) : null;
  if (["canceled", "unpaid", "incomplete_expired"].includes(sub.status))
    return { label: sub.endedOn ? `Abonnement arrêté le ${formatDay(sub.endedOn)}` : "Abonnement arrêté", tone: "arret" };
  if (sub.cancelAtPeriodEnd)
    return {
      label: `Résiliation demandée${sub.cancelRequestedOn ? ` le ${formatDay(sub.cancelRequestedOn)}` : ""}${end ? `, fin le ${end}` : ""}`,
      tone: "alerte",
    };
  if (sub.status === "past_due") return { label: "Paiement en retard", tone: "alerte" };
  if (sub.status === "trialing") return { label: `Abonné, premier paiement le ${end ?? "?"}`, tone: "ok" };
  if (sub.status === "active") return { label: `Abonné${end ? `, prochain paiement le ${end}` : ""}`, tone: "ok" };
  return null;
}

export const SUBSCRIPTION_STYLE: Record<SubscriptionTone, string> = {
  ok: "bg-sauge-soft text-ink",
  alerte: "bg-safran-soft text-ink",
  arret: "bg-line text-ink-soft",
};
