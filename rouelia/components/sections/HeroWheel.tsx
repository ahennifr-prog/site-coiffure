"use client";

import { useRef, useState } from "react";
import { hero, ui, type PrizeIcon } from "@/content";
import { fr } from "@/lib/format";
import { pickWeighted, readableOn } from "@/lib/wheel";
import { Wheel, type WheelHandle } from "@/components/wheel/Wheel";

const COLORS = ["#C4401F", "#FBF6EE", "#F3B23C", "#2E6150"];
const ICONS: PrizeIcon[] = ["goutte", "cafe", "pourcent", "flacon", "dessert", "etoile", "croissant", "cadeau"];

const segments = hero.heroPrizes.map((label, i) => {
  const color = COLORS[i % COLORS.length];
  return { label, color, textColor: readableOn(color), icon: ICONS[i % ICONS.length] };
});

export function HeroWheel() {
  const wheel = useRef<WheelHandle>(null);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function spin() {
    if (busy || !wheel.current) return;
    setBusy(true);
    setResult(null);
    const idx = pickWeighted(segments.map(() => ({ percent: 1 })));
    await wheel.current.spin(idx);
    setResult(segments[idx].label);
    setBusy(false);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="group relative w-full max-w-[min(88vw,440px)]">
        <span aria-hidden className="absolute inset-x-[8%] top-[10%] bottom-[4%] rounded-full shadow-wheel" />
        <Wheel ref={wheel} segments={segments} idle={!busy && !result} label={hero.wheelLabel} monogram="R" className="w-full transition-transform duration-300 group-hover:scale-[1.015]" />
        {/* Bouton transparent posé sur la roue : son nom accessible ne dépend pas des libellés dessinés. */}
        <button
          type="button"
          onClick={spin}
          disabled={busy}
          aria-label={hero.spinHint}
          className="absolute inset-[4%] cursor-pointer rounded-full disabled:cursor-progress"
        />
      </div>
      <p aria-live="polite" className="mt-3 flex min-h-11 items-center justify-center text-center text-sm font-medium text-ink-soft">
        {result ? (
          <span className="pop-in inline-flex items-center gap-2 rounded-full bg-sauge px-4 py-2 font-semibold text-white">
            {fr(ui.won(result))}
          </span>
        ) : (
          fr(hero.spinHint)
        )}
      </p>
    </div>
  );
}
