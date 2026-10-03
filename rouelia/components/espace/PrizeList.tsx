"use client";

import { Crown, Plus, Trash2 } from "lucide-react";
import type { PrizeIcon } from "@/content";
import { formatEuroCents } from "@/lib/format";
import { MAX_PRIZES, MIN_PRIZES, type ShopPrize } from "@/lib/shop-config";
import { averageCost, maxPercentFor, removePrize, setPercent, type WheelPrize } from "@/lib/wheel";
import { prizeIconIds, prizeIcons } from "@/components/wheel/icons";

const asWheel = (p: ShopPrize[]) => p as unknown as WheelPrize[];
const asPrizes = (p: WheelPrize[]) => p as unknown as ShopPrize[];

/** Liste de lots modifiable : nom, précision, gros ou petit, icône, coût et chance (total toujours 100 %). */
export function PrizeList({ prizes, onChange, colors, idPrefix = "" }: { prizes: ShopPrize[]; onChange: (p: ShopPrize[]) => void; colors: string[]; idPrefix?: string }) {
  const update = (i: number, patch: Partial<ShopPrize>) => onChange(prizes.map((p, k) => (k === i ? { ...p, ...patch } : p)));
  const avg = averageCost(prizes);
  return (
    <>
          <ul className="mt-4 space-y-3">
            {prizes.map((p, i) => {
              const max = maxPercentFor(asWheel(prizes), i);
              return (
                <li key={p.id} className="rounded-lg bg-cream p-3 ring-1 ring-line sm:p-4">
                  <div className="flex items-center gap-2">
                    <span aria-hidden className="h-9 w-2 shrink-0 rounded-full" style={{ background: colors[i] }} />
                    <label className="sr-only" htmlFor={`${idPrefix}nom-${p.id}`}>Nom du cadeau</label>
                    <input id={`${idPrefix}nom-${p.id}`} value={p.name} maxLength={30} onChange={(e) => update(i, { name: e.target.value })} className="min-h-11 min-w-0 flex-1 rounded-lg bg-paper px-3 font-semibold ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette" />
                    <button
                      type="button"
                      aria-label={`Supprimer ${p.name}`}
                      disabled={prizes.length <= MIN_PRIZES}
                      onClick={() => onChange(asPrizes(removePrize(asWheel(prizes), i)))}
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:text-danger disabled:opacity-30"
                    >
                      <Trash2 aria-hidden size={18} />
                    </button>
                  </div>
                  <label className="sr-only" htmlFor={`${idPrefix}detail-${p.id}`}>Précision affichée au client</label>
                  <input
                    id={`${idPrefix}detail-${p.id}`}
                    value={p.detail}
                    maxLength={140}
                    placeholder="Précision affichée au client (facultatif)"
                    onChange={(e) => update(i, { detail: e.target.value })}
                    className="mt-2 min-h-11 w-full rounded-lg bg-paper px-3 text-sm ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette"
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div role="radiogroup" aria-label={`Type de ${p.name}`} className="inline-flex rounded-full bg-paper p-1 ring-1 ring-line">
                      {([false, true] as const).map((big) => (
                        <button
                          key={String(big)}
                          type="button"
                          role="radio"
                          aria-checked={p.big === big}
                          onClick={() => update(i, { big })}
                          className={`inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold ${p.big === big ? (big ? "bg-tomette text-white" : "bg-ink text-white") : "text-ink-soft"}`}
                        >
                          {big ? <Crown aria-hidden size={12} /> : null}
                          {big ? "Gros" : "Petit"}
                        </button>
                      ))}
                    </div>
                    <label className="sr-only" htmlFor={`${idPrefix}icone-${p.id}`}>Icône</label>
                    <select id={`${idPrefix}icone-${p.id}`} value={p.icon} onChange={(e) => update(i, { icon: e.target.value as PrizeIcon })} className="min-h-11 rounded-full bg-paper px-3 text-sm ring-1 ring-line">
                      {prizeIconIds.map((ic) => (
                        <option key={ic} value={ic}>{prizeIcons[ic].label}</option>
                      ))}
                    </select>
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft">
                      Coût pour vous
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step={0.1}
                        value={p.cost}
                        onChange={(e) => update(i, { cost: Math.max(0, Number(e.target.value) || 0) })}
                        className="tabular min-h-11 w-20 rounded-lg bg-paper px-2 text-sm text-ink ring-1 ring-line"
                      />
                      €
                    </label>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <label htmlFor={`${idPrefix}chance-${p.id}`} className="w-14 shrink-0 text-xs font-semibold text-ink-soft">Chance</label>
                    <input
                      id={`${idPrefix}chance-${p.id}`}
                      type="range"
                      className="range"
                      min={1}
                      max={Math.max(1, max)}
                      value={p.percent}
                      aria-valuetext={`${p.percent} %`}
                      style={{ ["--fill" as string]: `${((p.percent - 1) / Math.max(1, max - 1)) * 100}%` }}
                      onChange={(e) => onChange(asPrizes(setPercent(asWheel(prizes), i, Number(e.target.value))))}
                    />
                    <span className="tabular w-12 shrink-0 text-right font-semibold">{p.percent} %</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            disabled={prizes.length >= MAX_PRIZES}
            onClick={() => {
              const fair = Math.max(1, Math.round(100 / (prizes.length + 1)));
              const next: ShopPrize[] = [...prizes, { id: `lot-${Date.now().toString(36)}`, name: "Nouveau cadeau", detail: "", icon: "cadeau", big: false, cost: 0, percent: fair }];
              onChange(asPrizes(setPercent(asWheel(next), next.length - 1, fair)));
            }}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line font-semibold text-tomette-deep disabled:opacity-40"
          >
            <Plus aria-hidden size={18} /> Ajouter un cadeau
          </button>
          <p className="mt-2 text-xs text-ink-soft">De {MIN_PRIZES} à {MAX_PRIZES} cadeaux. Au-delà, la roue devient difficile à lire sur téléphone.</p>
          <p className="mt-3 rounded-lg bg-cream p-3 text-sm">
            <span className="font-semibold">Coût moyen par partie : {formatEuroCents(avg)}</span>
            <span className="text-ink-soft"> (coût de chaque lot multiplié par sa chance de sortir)</span>
          </p>
    </>
  );
}
