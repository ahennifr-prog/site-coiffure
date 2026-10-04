"use client";

import { useState } from "react";
import { ArrowLeft, Check, CreditCard, Gift, LoaderCircle, ShieldCheck } from "lucide-react";
import { brand, pricing, type OfferId, type PackId } from "@/content";
import { formatDay } from "@/lib/dates";
import { formatPrice } from "@/lib/format";
import { quotePack } from "@/lib/billing";

export interface AbonnementProps {
  firstName: string;
  shopName: string;
  pack: PackId;
  plan: "trial" | "active" | "paused";
  trialEnd: string;
  daysLeft: number;
  /** Cadeau gagné sur la roue d'offres (identifiant tiré), s'il y en a un. */
  wonOffer: OfferId | null;
  /** Abonnement Stripe en cours. */
  subscription: { status: "active" | "past_due" | "canceling"; renewsOn: string | null } | null;
  /** Paiement en ligne branché (clés Stripe posées). */
  stripeReady: boolean;
  /** Retour de la page de paiement. */
  returned?: "ok" | "annule" | null;
}

export function Abonnement(p: AbonnementProps) {
  const [chosen, setChosen] = useState<PackId>(p.pack);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ended = p.plan !== "active" && p.daysLeft <= 0;

  async function go(path: string, body?: object) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });
      const data = (await res.json()) as { url?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(`Le paiement n'a pas pu s'ouvrir. Réessayez dans un instant ou écrivez-nous à ${brand.email}.`);
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    }
    setBusy(false);
  }

  const mailto = (packName: string) =>
    `mailto:${brand.email}?subject=${encodeURIComponent(`Je continue avec ${packName} (${p.shopName})`)}`;

  return (
    <div className="min-h-svh bg-cream">
      <main className="mx-auto max-w-5xl px-5 py-6">
        <a href="/espace" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold">
          <ArrowLeft aria-hidden size={16} /> Retour à l&apos;espace
        </a>

        {p.returned === "ok" ? (
          <p role="status" className="mt-3 flex gap-2 rounded-lg bg-sauge/10 p-3 text-sm font-semibold ring-1 ring-sauge/40">
            <Check aria-hidden size={18} className="mt-0.5 shrink-0 text-sauge" />
            Merci {p.firstName}, votre abonnement est enregistré. La roue tourne de nouveau pour vos clients.
          </p>
        ) : null}

        {p.returned === "annule" ? (
          <p role="status" className="mt-3 rounded-lg bg-paper p-3 text-sm ring-1 ring-line">Paiement non terminé : rien n&apos;a été prélevé. Vous pouvez reprendre quand vous voulez.</p>
        ) : null}

        {!p.subscription && p.plan === "active" ? (
          <section className="mt-3">
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">Votre abonnement</h1>
            <p className="mt-4 max-w-2xl rounded-2xl bg-paper p-5 text-lg ring-1 ring-line">
              Votre abonnement au pack {pricing.packs.find((x) => x.id === p.pack)?.name} est actif et géré directement avec nous. Pour toute modification, écrivez-nous à{" "}
              <a href={`mailto:${brand.email}`} className="font-semibold underline underline-offset-2">{brand.email}</a>.
            </p>
          </section>
        ) : p.subscription ? (
          <section className="mt-3">
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">Votre abonnement</h1>
            <div className="mt-5 rounded-2xl bg-paper p-5 ring-1 ring-line sm:p-6">
              <p className="text-sm font-bold tracking-[0.1em] text-tomette-deep uppercase">Pack {pricing.packs.find((x) => x.id === p.pack)?.name}</p>
              <p className="mt-2 text-lg">
                {p.subscription.status === "canceling"
                  ? `Arrêt demandé : la roue reste active jusqu'au ${p.subscription.renewsOn ? formatDay(p.subscription.renewsOn) : "terme du mois payé"}.`
                  : p.subscription.status === "past_due"
                    ? "Le dernier paiement n'est pas passé. Mettez à jour votre carte pour que la roue continue de tourner."
                    : `Actif. Prochain paiement le ${p.subscription.renewsOn ? formatDay(p.subscription.renewsOn) : "mois prochain"}.`}
              </p>
              <button type="button" disabled={busy} onClick={() => go("/api/espace/abonnement/portail")} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-semibold text-white disabled:opacity-60">
                {busy ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : <CreditCard aria-hidden size={18} />}
                Gérer mon abonnement
              </button>
              <p className="mt-3 text-sm text-ink-soft">Changer de carte ou de pack, télécharger vos factures, ou arrêter en un clic.</p>
              {error ? <p role="alert" className="mt-3 text-sm font-semibold text-danger">{error}</p> : null}
            </div>
          </section>
        ) : (
          <section className="mt-3">
            <h1 className="font-display text-3xl font-semibold text-balance sm:text-4xl">
              {ended ? "Relancez votre roue" : `${p.firstName}, gardez votre roue après l'essai`}
            </h1>
            <p className="mt-2 max-w-2xl text-ink-soft">
              {ended
                ? "Vos lots, vos réglages et votre QR code imprimé sont gardés. Dès le paiement validé, la roue repart pour vos clients."
                : `Votre essai gratuit se termine le ${formatDay(p.trialEnd)}. En prenant votre abonnement maintenant, vos clients continuent de jouer sans interruption.${p.daysLeft > 2 ? " Le premier paiement n'a lieu qu'à la fin de l'essai." : ""}`}
            </p>

            <div role="radiogroup" aria-label="Choix du pack" className="mt-6 grid gap-4 md:grid-cols-3">
              {pricing.packs.map((pack) => {
                const q = quotePack(pack.id, p.wonOffer);
                const on = chosen === pack.id;
                return (
                  <button
                    key={pack.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setChosen(pack.id)}
                    className={`relative flex flex-col rounded-2xl bg-paper p-5 text-left ring-1 transition ${on ? "ring-2 ring-tomette shadow-lg" : "ring-line hover:ring-ink/30"}`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-display text-xl font-semibold">{pack.name}</span>
                      <span aria-hidden className={`inline-flex h-6 w-6 items-center justify-center rounded-full ring-2 ${on ? "bg-tomette text-white ring-tomette" : "ring-line"}`}>
                        {on ? <Check size={14} strokeWidth={3} /> : null}
                      </span>
                    </span>
                    {pack.id === p.pack ? <span className="mt-1 text-xs font-bold tracking-wide text-ink-soft uppercase">Votre pack d&apos;essai</span> : null}
                    <span className="mt-3">
                      <span className="font-display text-3xl font-semibold">{formatPrice(pack.price)}</span>
                      <span className="text-sm text-ink-soft"> par mois</span>
                    </span>
                    {q.firstMonth !== null ? (
                      <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-tomette-soft px-3 py-1 text-sm font-semibold text-tomette-deep">
                        <Gift aria-hidden size={14} /> 1er mois : {formatPrice(q.firstMonth)}
                      </span>
                    ) : q.offerLabel ? (
                      <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-tomette-soft px-3 py-1 text-sm font-semibold text-tomette-deep">
                        <Gift aria-hidden size={14} /> {q.offerLabel}
                      </span>
                    ) : null}
                    <span className="mt-3 text-sm text-ink-soft">{pack.tagline}</span>
                    <ul className="mt-3 space-y-1.5 text-sm">
                      {pack.highlights.slice(0, 4).map((h) => (
                        <li key={h} className="flex gap-2">
                          <Check aria-hidden size={16} className="mt-0.5 shrink-0 text-sauge" /> {h}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col items-start gap-3">
              {p.stripeReady ? (
                <button type="button" disabled={busy} onClick={() => go("/api/espace/abonnement", { pack: chosen })} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-tomette px-6 text-lg font-semibold text-white hover:bg-tomette-deep disabled:opacity-60">
                  {busy ? <LoaderCircle aria-hidden size={20} className="animate-spin" /> : <CreditCard aria-hidden size={20} />}
                  Continuer avec {pricing.packs.find((x) => x.id === chosen)?.name}
                </button>
              ) : (
                <a href={mailto(pricing.packs.find((x) => x.id === chosen)?.name ?? "")} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-tomette px-6 text-lg font-semibold text-white hover:bg-tomette-deep">
                  <CreditCard aria-hidden size={20} /> Continuer avec {pricing.packs.find((x) => x.id === chosen)?.name}
                </a>
              )}
              {error ? <p role="alert" className="text-sm font-semibold text-danger">{error}</p> : null}
              <p className="flex items-center gap-2 text-sm text-ink-soft">
                <ShieldCheck aria-hidden size={16} className="shrink-0 text-sauge" />
                {p.stripeReady ? "Paiement sécurisé par Stripe. Sans engagement : vous arrêtez en un clic, depuis cette page." : "Nous vous répondons dans la journée pour activer votre abonnement. Sans engagement."}
              </p>
              <p className="text-xs text-ink-soft">{pricing.vatNote}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
