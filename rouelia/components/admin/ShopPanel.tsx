"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, KeyRound, LoaderCircle, MessageCircle, Store } from "lucide-react";
import { pricing, type PackId } from "@/content";
import { formatDay, parisDay } from "@/lib/dates";
import type { ShopPlan } from "@/lib/shop-config";
import type { SignupRecord } from "@/lib/signup";

/** Résumé d'un commerce tel que renvoyé par /api/admin/shops. */
export interface AdminShop {
  id: string;
  slug: string;
  name: string;
  signupId: string | null;
  plan: ShopPlan;
  pack: PackId;
  trialEndsAt: string;
  hasPassword: boolean;
  active: boolean;
}

const PLAN_LABEL: Record<ShopPlan, string> = { trial: "Essai gratuit", active: "Client (payant)", paused: "En pause" };

/** Ouverture de l'essai, lien d'invitation et offre du commerce, sur la fiche d'une inscription. */
export function ShopPanel({ signup, shop, onChange }: { signup: SignupRecord; shop?: AdminShop; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inviteUrl = (token: string) => `${window.location.origin}/espace/invitation#${token}`;

  async function call(url: string, init: RequestInit) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } });
      const d = await res.json();
      if (!d.ok) throw new Error(d.error);
      return d;
    } catch {
      setError("L'opération a échoué. Réessayez.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function open() {
    const d = await call("/api/admin/shops", { method: "POST", body: JSON.stringify({ signupId: signup.id }) });
    if (d) {
      setLink(inviteUrl(d.token));
      onChange();
    }
  }

  async function newLink() {
    if (!shop) return;
    const d = await call(`/api/admin/shops/${shop.id}`, { method: "POST" });
    if (d) setLink(inviteUrl(d.token));
  }

  async function patch(body: object) {
    if (!shop) return;
    if (await call(`/api/admin/shops/${shop.id}`, { method: "PATCH", body: JSON.stringify(body) })) onChange();
  }

  const message = link
    ? `Bonjour ${signup.firstName}, votre roue Rouelia est prête. Choisissez votre mot de passe ici : ${link} (lien valable 14 jours). Vous y trouverez la caisse, le suivi, les réglages et votre QR code.`
    : "";
  const waPhone = signup.phone.replace("+", "");

  return (
    <div className="mt-3 rounded-lg bg-cream p-3 text-sm ring-1 ring-line">
      {!shop ? (
        <button type="button" disabled={busy} onClick={open} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sauge px-4 font-semibold text-white disabled:opacity-60">
          {busy ? <LoaderCircle aria-hidden size={16} className="animate-spin" /> : <Store aria-hidden size={16} />} Ouvrir l&apos;essai
        </button>
      ) : (
        <div className="space-y-2">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-semibold">Roue : /j/{shop.slug}</span>
            <a href={`/j/${shop.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 font-semibold text-tomette-deep underline underline-offset-2">
              <ExternalLink aria-hidden size={14} /> Voir
            </a>
            <span className="text-ink-soft">
              {shop.hasPassword ? "Compte activé" : "Mot de passe pas encore choisi"}
              {shop.plan === "trial" ? ` · Essai jusqu'au ${formatDay(parisDay(new Date(shop.trialEndsAt)))}` : ""}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor={`plan-${shop.id}`}>Offre du commerce</label>
            <select id={`plan-${shop.id}`} value={shop.plan} disabled={busy} onChange={(e) => patch({ plan: e.target.value })} className="min-h-10 rounded-full bg-paper px-3 font-semibold ring-1 ring-line">
              {(Object.keys(PLAN_LABEL) as ShopPlan[]).map((p) => (
                <option key={p} value={p}>{PLAN_LABEL[p]}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor={`pack-${shop.id}`}>Pack du commerce</label>
            <select id={`pack-${shop.id}`} value={shop.pack} disabled={busy} onChange={(e) => patch({ pack: e.target.value })} className="min-h-10 rounded-full bg-paper px-3 font-semibold ring-1 ring-line">
              {pricing.packs.map((p) => (
                <option key={p.id} value={p.id}>Pack {p.name}</option>
              ))}
            </select>
            {shop.plan === "trial" ? (
              <button type="button" disabled={busy} onClick={() => patch({ extendDays: 7 })} className="inline-flex min-h-10 items-center rounded-full bg-paper px-3 font-semibold ring-1 ring-line">
                Prolonger de 7 jours
              </button>
            ) : null}
            <button type="button" disabled={busy} onClick={newLink} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-paper px-3 font-semibold ring-1 ring-line">
              <KeyRound aria-hidden size={14} /> {shop.hasPassword ? "Lien nouveau mot de passe" : "Nouveau lien d'invitation"}
            </button>
          </div>
        </div>
      )}

      {link ? (
        <div className="mt-3 rounded-lg bg-paper p-3 ring-1 ring-sauge">
          <p className="font-semibold">Lien à envoyer à {signup.firstName} (valable 14 jours, une seule utilisation)</p>
          <p className="mt-1 font-mono text-xs break-all">{link}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(message).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              })}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 font-semibold text-white"
            >
              {copied ? <Check aria-hidden size={14} /> : <Copy aria-hidden size={14} />} {copied ? "Message copié" : "Copier le message"}
            </button>
            <a href={`https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-sauge px-4 font-semibold text-white">
              <MessageCircle aria-hidden size={14} /> WhatsApp
            </a>
            <a href={`sms:${signup.phone}?body=${encodeURIComponent(message)}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-paper px-4 font-semibold ring-1 ring-line">
              SMS
            </a>
            <a href={`mailto:${signup.email}?subject=${encodeURIComponent("Votre roue Rouelia est prête")}&body=${encodeURIComponent(message)}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-paper px-4 font-semibold ring-1 ring-line">
              E-mail
            </a>
          </div>
        </div>
      ) : null}
      {error ? <p role="alert" className="mt-2 font-semibold text-danger">{error}</p> : null}
    </div>
  );
}
