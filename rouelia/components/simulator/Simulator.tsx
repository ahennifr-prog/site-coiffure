"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown, Info, TrendingUp, TriangleAlert } from "lucide-react";
import { pricing, simulator as t, trades, type PackId, type TradeId } from "@/content";
import { formatEuro, formatEuroCents, formatInt, formatPercent, fr } from "@/lib/format";
import { simulate } from "@/lib/simulator";
import { averageCost } from "@/lib/wheel";
import { useAppState } from "@/components/AppState";
import { Button } from "@/components/ui/Button";

interface FieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: (v: number) => string;
  suffix?: string;
  /** Multiplie la valeur affichée dans le champ (0.2 devient 20). */
  scale?: number;
  help?: string;
}

function SliderField({ label, value, min, max, step, onChange, display, suffix, scale = 1, help }: FieldProps) {
  const id = useId();
  const [text, setText] = useState<string | null>(null);
  const shown = Math.round(value * scale * 100) / 100;
  const fill = ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={`${id}-range`} className="text-sm font-semibold">
          {fr(label)}
        </label>
        <div className="relative shrink-0">
          <label htmlFor={`${id}-num`} className="sr-only">
            {fr(label)}
          </label>
          <input
            id={`${id}-num`}
            inputMode="decimal"
            value={text ?? String(shown).replace(".", ",")}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d,.]/g, "");
              setText(raw);
              const v = parseFloat(raw.replace(",", "."));
              if (Number.isFinite(v)) onChange(Math.min(max, Math.max(min, v / scale)));
            }}
            onBlur={() => setText(null)}
            className={`tabular h-11 w-24 rounded-lg bg-cream pl-3 text-right font-bold ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette ${suffix ? "pr-8" : "pr-3"}`}
          />
          {suffix ? (
            <span aria-hidden className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft">
              {suffix}
            </span>
          ) : null}
        </div>
      </div>
      <input
        id={`${id}-range`}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        aria-valuetext={display(value)}
        style={{ ["--fill" as string]: `${fill}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {help ? <p className="-mt-1 text-xs text-ink-soft">{fr(help)}</p> : null}
    </div>
  );
}

export function Simulator() {
  const app = useAppState();
  const [trade, setTrade] = useState<TradeId>(app.demo.trade);
  const [followDemo, setFollowDemo] = useState(true);
  const tr = trades.find((x) => x.id === trade) ?? trades[0];
  const [clients, setClients] = useState(tr.simulator.clientsPerDay);
  const [basket, setBasket] = useState(tr.simulator.averageBasket);
  const [margin, setMargin] = useState(tr.simulator.grossMargin);
  const [playRate, setPlayRate] = useState(t.defaults.playRate);
  const [redeemRate, setRedeemRate] = useState(t.defaults.redeemRate);
  const [incremental, setIncremental] = useState(t.defaults.incrementalRate);
  const [openDays, setOpenDays] = useState(t.defaults.openDaysPerMonth);
  const [lotOverride, setLotOverride] = useState<number | null>(null);
  const [pack, setPack] = useState<PackId>("croissance");
  const uid = useId();

  function applyTrade(id: TradeId) {
    const x = trades.find((y) => y.id === id) ?? trades[0];
    setTrade(id);
    setClients(x.simulator.clientsPerDay);
    setBasket(x.simulator.averageBasket);
    setMargin(x.simulator.grossMargin);
    setLotOverride(null);
  }

  // Tant que le visiteur n'a pas choisi un autre métier ici, on suit celui de la démo.
  useEffect(() => {
    if (followDemo && app.demo.trade !== trade) applyTrade(app.demo.trade);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.demo.trade, followDemo]);

  const fromWheel = trade === app.demo.trade;
  const lotCost = lotOverride ?? (fromWheel ? app.avgCost : averageCost(tr.prizes));
  const packPrice = pricing.packs.find((p) => p.id === pack)?.price ?? 49;

  const r = simulate({
    clientsPerDay: clients,
    openDaysPerMonth: openDays,
    playRate,
    redeemRate,
    incrementalRate: incremental,
    averageBasket: basket,
    grossMargin: margin,
    lotCost,
    packPrice,
  });
  const positive = r.balance >= 0;
  const costs = r.lotsCost + r.packCost;
  const scaleMax = Math.max(r.extraMargin, costs, 1);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-5 rounded-xl bg-paper p-5 shadow-sm ring-1 ring-line sm:p-7">
        <div>
          <label htmlFor={`${uid}-trade`} className="text-sm font-semibold">
            {t.inputs.trade}
          </label>
          <div className="relative mt-2">
            <select
              id={`${uid}-trade`}
              value={trade}
              onChange={(e) => {
                setFollowDemo(false);
                applyTrade(e.target.value as TradeId);
              }}
              className="min-h-12 w-full appearance-none rounded-lg bg-cream px-4 pr-10 font-semibold ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette"
            >
              {trades.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden size={18} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
          </div>
        </div>

        <SliderField label={t.inputs.clientsPerDay} value={clients} min={1} max={400} step={1} onChange={setClients} display={formatInt} />
        <SliderField label={t.inputs.averageBasket} value={basket} min={2} max={150} step={1} onChange={setBasket} display={formatEuro} suffix="€" />
        <SliderField label={t.inputs.playRate} value={playRate} min={0.05} max={0.8} step={0.01} scale={100} onChange={setPlayRate} display={(v) => formatPercent(v * 100)} suffix="%" />
        <SliderField label={t.inputs.redeemRate} value={redeemRate} min={0.05} max={0.8} step={0.01} scale={100} onChange={setRedeemRate} display={(v) => formatPercent(v * 100)} suffix="%" />

        <div>
          <p id={`${uid}-pack`} className="text-sm font-semibold">
            {t.inputs.pack}
          </p>
          <div role="radiogroup" aria-labelledby={`${uid}-pack`} className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-cream p-1 ring-1 ring-line">
            {pricing.packs.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={pack === p.id}
                onClick={() => setPack(p.id)}
                className={`min-h-11 rounded-full px-2 text-sm font-semibold transition-colors ${pack === p.id ? "bg-ink text-white" : "text-ink hover:bg-paper"}`}
              >
                {p.name} <span className={pack === p.id ? "text-white/85" : "text-ink-soft"}>{formatEuro(p.price)}</span>
              </button>
            ))}
          </div>
        </div>

        <details className="group rounded-lg bg-cream ring-1 ring-line">
          <summary className="flex min-h-12 items-center justify-between px-4 text-sm font-semibold text-tomette-deep">
            {t.advanced.toggle}
            <ChevronDown aria-hidden size={18} className="chevron" />
          </summary>
          <div className="space-y-5 px-4 pb-5">
            <SliderField label={t.advanced.openDaysPerMonth} value={openDays} min={10} max={31} step={1} onChange={setOpenDays} display={formatInt} />
            <SliderField
              label={t.advanced.incrementalRate}
              value={incremental}
              min={0}
              max={1}
              step={0.01}
              scale={100}
              onChange={setIncremental}
              display={(v) => formatPercent(v * 100)}
              suffix="%"
              help={t.advanced.incrementalHelp}
            />
            <SliderField
              label={t.advanced.grossMargin}
              value={margin}
              min={0.1}
              max={0.95}
              step={0.01}
              scale={100}
              onChange={setMargin}
              display={(v) => formatPercent(v * 100)}
              suffix="%"
              help={t.advanced.grossMarginHelp}
            />
            <SliderField
              label={t.advanced.lotCost}
              value={lotCost}
              min={0}
              max={15}
              step={0.05}
              onChange={(v) => setLotOverride(v)}
              display={formatEuroCents}
              suffix="€"
              help={fromWheel && lotOverride === null ? t.advanced.lotCostHelp : undefined}
            />
          </div>
        </details>
      </div>

      <div className="lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start">
        <div className="rounded-xl bg-night p-6 text-cream shadow-lg sm:p-8">
          <p className="text-sm font-semibold text-cream/85">{t.outputs.balance}</p>
          <p className={`tabular mt-1 font-display text-5xl font-semibold sm:text-6xl ${positive ? "text-sauge-light" : "text-safran"}`}>
            {positive ? "+" : ""}
            {formatEuro(r.balance)}
          </p>
          <p aria-live="polite" className="mt-2 flex items-start gap-2 text-sm font-medium text-white">
            {positive ? <TrendingUp aria-hidden size={18} className="mt-0.5 shrink-0 text-sauge-light" /> : <TriangleAlert aria-hidden size={18} className="mt-0.5 shrink-0 text-safran" />}
            {fr(positive ? t.outputs.positive : t.outputs.negative)}
          </p>

          <div className="mt-6 space-y-3" aria-hidden>
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span>{t.outputs.extraMargin}</span>
                <span className="tabular">{formatEuro(r.extraMargin)}</span>
              </div>
              <div className="mt-1 h-3 rounded-full bg-night-soft">
                <div className="h-full rounded-full bg-sauge-light transition-[width] duration-500" style={{ width: `${(r.extraMargin / scaleMax) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span>
                  {t.outputs.lotsCost} + {t.outputs.packCost.toLowerCase()}
                </span>
                <span className="tabular">{formatEuro(costs)}</span>
              </div>
              <div className="mt-1 h-3 rounded-full bg-night-soft">
                <div className="h-full rounded-full bg-tomette transition-[width] duration-500" style={{ width: `${(costs / scaleMax) * 100}%` }} />
              </div>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-white/15 pt-6">
            {[
              [t.outputs.plays, formatInt(r.plays)],
              [t.outputs.returns, formatInt(r.returns)],
              [t.outputs.extraRevenue, formatEuro(r.extraRevenue)],
              [t.outputs.extraMargin, formatEuro(r.extraMargin)],
              [t.outputs.lotsCost, formatEuro(r.lotsCost)],
              [t.outputs.packCost, formatEuro(r.packCost)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-cream/85">{fr(k)}</dt>
                <dd className="tabular text-xl font-bold text-white">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-cream/85">{t.outputs.perMonth}</p>

          <Button size="lg" className="mt-6 w-full" onClick={() => app.openSignup(pack)}>
            {pricing.choose(pricing.packs.find((p) => p.id === pack)?.name ?? "")}
          </Button>
        </div>

        <p className="mt-4 flex gap-2 text-sm font-semibold">
          <Info aria-hidden size={18} className="mt-0.5 shrink-0 text-tomette-deep" />
          {fr(t.disclaimer)}
        </p>
        <p className="mt-2 text-xs text-ink-soft">{fr(t.method)}</p>
      </div>
    </div>
  );
}
