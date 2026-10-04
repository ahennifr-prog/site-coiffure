"use client";

import { useRef, useState } from "react";
import { Gift } from "lucide-react";
import { offerWheel } from "@/content";
import { formatDate, fr } from "@/lib/format";
import { offerById, suggestedPack, type WonOffer } from "@/lib/offers";
import { readableOn } from "@/lib/wheel";
import { useAppState } from "@/components/AppState";
import { Wheel, type WheelHandle } from "@/components/wheel/Wheel";

const COLORS = ["#C4401F", "#FBF6EE", "#F3B23C", "#2E6150"];

const segments = offerWheel.offers.map((o, i) => {
  const color = COLORS[i % COLORS.length];
  return { label: o.short, color, textColor: readableOn(color), icon: o.icon };
});

/** Roue d'offres Rouelia : un tirage fait par le serveur, un cadeau gardé 7 jours. */
export function OfferWheel() {
  const { offer, setOffer, openSignup } = useAppState();
  const wheel = useRef<WheelHandle>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function spin() {
    if (busy || offer || !wheel.current) return;
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/offre", { method: "POST" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { offer: WonOffer };
      const idx = offerWheel.offers.findIndex((o) => o.id === data.offer.id);
      await wheel.current.spin(Math.max(0, idx));
      setOffer(data.offer);
    } catch {
      setError(true);
    }
    setBusy(false);
  }

  const won = offer ? offerById(offer.id) : null;

  return (
    <div className="flex flex-col items-center">
      <div className="group relative w-full max-w-[min(88vw,440px)]">
        <span aria-hidden className="absolute inset-x-[8%] top-[10%] bottom-[4%] rounded-full shadow-wheel" />
        <Wheel ref={wheel} segments={segments} idle={!busy && !offer} label={offerWheel.wheelLabel} monogram="R" className="w-full transition-transform duration-300 group-hover:scale-[1.015]" />
        {!offer ? (
          <button
            type="button"
            onClick={spin}
            disabled={busy}
            aria-label={busy ? offerWheel.spinning : offerWheel.spinHint}
            className="absolute inset-[4%] cursor-pointer rounded-full disabled:cursor-progress"
          />
        ) : null}
      </div>

      <div aria-live="polite" className="mt-4 w-full max-w-[440px]">
        {offer && won ? (
          <div className="pop-in rounded-xl bg-paper p-5 text-ink shadow-lg">
            <p className="flex items-center gap-2 text-sm font-bold tracking-[0.08em] text-tomette-deep uppercase">
              <Gift aria-hidden size={18} /> {offerWheel.won}
            </p>
            <p className="mt-1 font-display text-2xl leading-tight font-semibold">{fr(won.label)}</p>
            <p className="mt-3 text-sm text-ink-soft">
              {offerWheel.codeLabel} :{" "}
              <span className="rounded bg-cream px-2 py-0.5 font-mono text-base font-bold tracking-wider text-ink">{offer.code}</span>
            </p>
            <p className="mt-3 font-semibold">{fr(offerWheel.activate)}</p>
            <p className="mt-1 text-sm text-ink-soft">{fr(offerWheel.validUntil(formatDate(new Date(offer.expiresAt))))}</p>
            <button
              type="button"
              onClick={() => openSignup(suggestedPack(offer.id))}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-tomette px-6 text-lg font-semibold text-white shadow-md hover:bg-tomette-deep"
            >
              {offerWheel.cta}
            </button>
          </div>
        ) : (
          <p className="flex min-h-11 items-center justify-center text-center text-sm font-medium text-white">
            {error ? fr(offerWheel.error) : busy ? offerWheel.spinning : fr(offerWheel.spinHint)}
          </p>
        )}
      </div>

      <p className="mt-3 max-w-[440px] text-center text-xs text-white/85">{fr(offerWheel.rules)}</p>
    </div>
  );
}
