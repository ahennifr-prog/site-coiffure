"use client";

import { useId, useRef, useState } from "react";
import { Check, ImagePlus, Lock, LockOpen, Plus, Trash2, TriangleAlert } from "lucide-react";
import { demo as t } from "@/content";
import { formatEuroCents, formatPercent, fr } from "@/lib/format";
import { maxPercentFor, sumPercents } from "@/lib/wheel";
import { prizeIconIds, prizeIcons } from "@/components/wheel/icons";
import { useAppState } from "@/components/AppState";
import { readImage } from "./readImage";

function PrizeRow({ index }: { index: number }) {
  const app = useAppState();
  const prize = app.demo.prizes[index];
  const color = app.colors[index];
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [costText, setCostText] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const max = maxPercentFor(app.demo.prizes, index);
  const Icon = prizeIcons[prize.icon]?.Icon;
  const name = prize.name || t.prizes.newPrizeName;
  const canRemove = app.demo.prizes.length > t.minPrizes;

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    const res = await readImage(file, t.maxLogoSizeMb);
    if ("error" in res) setError(res.error === "type" ? t.fields.logo.errorType : t.fields.logo.errorSize);
    else {
      setError(null);
      app.updatePrize(index, { image: res.dataUrl });
      setPickerOpen(false);
    }
  }

  return (
    <li className="rounded-2xl bg-cream/70 p-4 ring-1 ring-line/70 transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setPickerOpen((o) => !o)}
          aria-expanded={pickerOpen}
          aria-controls={`${uid}-picker`}
          aria-label={t.prizes.iconChoose(name)}
          className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-black/10"
          style={{ background: color, color: app.segmentTextColors[index] }}
        >
          {prize.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={prize.image} alt="" className="h-full w-full object-cover" />
          ) : Icon ? (
            <Icon aria-hidden size={20} />
          ) : null}
        </button>
        <label className="sr-only" htmlFor={`${uid}-name`}>
          {t.prizes.name}
        </label>
        <input
          id={`${uid}-name`}
          value={prize.name}
          maxLength={32}
          placeholder={t.prizes.namePlaceholder}
          onChange={(e) => app.updatePrize(index, { name: e.target.value })}
          className="min-h-11 min-w-0 flex-1 rounded-lg bg-paper px-3 font-semibold ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette"
        />
        <button
          type="button"
          onClick={() => canRemove && app.removePrizeAt(index)}
          aria-disabled={!canRemove}
          aria-label={t.prizes.remove(name)}
          title={canRemove ? undefined : t.prizes.removeDisabled}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-paper hover:text-danger aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
        >
          <Trash2 aria-hidden size={18} />
        </button>
      </div>

      {pickerOpen ? (
        <div id={`${uid}-picker`} className="mt-3 rounded-lg bg-paper p-3 ring-1 ring-line">
          <p className="mb-2 text-sm font-medium" id={`${uid}-picker-label`}>
            {t.prizes.iconPanel}
          </p>
          <div role="radiogroup" aria-labelledby={`${uid}-picker-label`} className="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
            {prizeIconIds.map((id) => {
              const I = prizeIcons[id].Icon;
              const selected = !prize.image && prize.icon === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={prizeIcons[id].label}
                  onClick={() => {
                    app.updatePrize(index, { icon: id, image: undefined });
                    setPickerOpen(false);
                  }}
                  className={`inline-flex h-11 items-center justify-center rounded-md ${selected ? "bg-tomette text-white" : "bg-cream hover:bg-tomette-soft"}`}
                >
                  <I aria-hidden size={20} />
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" id={`${uid}-photo`} onChange={(e) => onPhoto(e.target.files?.[0])} />
            <label htmlFor={`${uid}-photo`} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-semibold text-tomette-deep ring-1 ring-line hover:bg-cream">
              <ImagePlus aria-hidden size={18} /> {t.prizes.iconUpload}
            </label>
            {prize.image ? (
              <button type="button" onClick={() => app.updatePrize(index, { image: undefined })} className="min-h-11 px-2 text-sm font-medium text-ink-soft underline underline-offset-4">
                {t.prizes.iconRemovePhoto}
              </button>
            ) : null}
          </div>
          {error ? (
            <p role="alert" className="mt-2 text-sm font-medium text-danger">
              {fr(error)}
            </p>
          ) : null}
        </div>
      ) : null}

      {error && !pickerOpen ? (
        <p role="alert" className="mt-2 text-sm font-medium text-danger">
          {fr(error)}
        </p>
      ) : null}

      <div className="mt-3 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 sm:grid-cols-[auto_1fr_auto]">
        <div>
          <label htmlFor={`${uid}-cost`} className="block text-xs font-semibold text-ink-soft">
            {t.prizes.cost}
          </label>
          <div className="relative mt-1">
            <input
              id={`${uid}-cost`}
              inputMode="decimal"
              value={costText ?? String(prize.cost).replace(".", ",")}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d,.]/g, "");
                setCostText(raw);
                const v = parseFloat(raw.replace(",", "."));
                app.updatePrize(index, { cost: Number.isFinite(v) ? Math.min(999, Math.max(0, v)) : 0 });
              }}
              onBlur={() => setCostText(null)}
              className="tabular h-11 w-24 rounded-lg bg-paper pr-7 pl-3 font-semibold ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette"
            />
            <span aria-hidden className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft">
              {t.prizes.costSuffix}
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between">
            <label htmlFor={`${uid}-pct`} className="text-xs font-semibold text-ink-soft">
              {t.prizes.percent}
            </label>
            <span className="tabular text-sm font-bold" aria-hidden>
              {formatPercent(prize.percent)}
            </span>
          </div>
          <input
            id={`${uid}-pct`}
            type="range"
            className="range"
            min={1}
            max={Math.max(1, max)}
            step={1}
            value={prize.percent}
            disabled={prize.locked}
            aria-label={t.prizes.percentSlider(name)}
            aria-valuetext={formatPercent(prize.percent)}
            style={{ ["--fill" as string]: `${((prize.percent - 1) / Math.max(1, max - 1)) * 100}%` }}
            onChange={(e) => app.setPrizePercent(index, Number(e.target.value))}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            const freeOthers = app.demo.prizes.filter((p, k) => k !== index && !p.locked).length;
            if (!prize.locked && freeOthers < 2) return setError(t.prizes.lockLimit);
            setError(null);
            app.togglePrizeLock(index);
          }}
          aria-pressed={!!prize.locked}
          aria-label={prize.locked ? t.prizes.unlock(name) : t.prizes.lock(name)}
          className={`col-span-2 inline-flex min-h-11 items-center justify-center gap-1.5 justify-self-start rounded-full px-3 text-xs font-semibold sm:col-span-1 sm:justify-self-auto ${
            prize.locked ? "bg-ink text-white" : "text-ink-soft ring-1 ring-line hover:bg-paper"
          }`}
        >
          {prize.locked ? <Lock aria-hidden size={14} /> : <LockOpen aria-hidden size={14} />}
          {prize.locked ? t.prizes.locked : <span className="sm:sr-only">{t.prizes.lockShort}</span>}
        </button>
      </div>
    </li>
  );
}

function TotalBar() {
  const { demo, colors } = useAppState();
  const total = sumPercents(demo.prizes);
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>{t.prizes.total}</span>
        <span className="tabular inline-flex items-center gap-1.5 text-sauge">
          <Check aria-hidden size={16} strokeWidth={3} /> {formatPercent(total)}
        </span>
      </div>
      <div aria-hidden className="mt-2 flex h-3 overflow-hidden rounded-full ring-1 ring-line">
        {demo.prizes.map((p, i) => (
          <span key={p.id} className="h-full transition-[width] duration-300" style={{ width: `${p.percent}%`, background: colors[i] }} />
        ))}
      </div>
      <p className="mt-2 text-xs text-ink-soft">{fr(t.prizes.totalHint)}</p>
    </div>
  );
}

export function CostCard() {
  const { avgCost } = useAppState();
  const over = avgCost > t.costWarningThreshold;
  return (
    <div className={`rounded-xl p-5 ${over ? "bg-safran-soft ring-1 ring-safran" : "bg-sauge-soft"}`}>
      <p className="text-sm font-semibold">{t.cost.label}</p>
      <p className="tabular mt-1 font-display text-4xl font-semibold">{formatEuroCents(avgCost)}</p>
      <p className="mt-2 text-sm text-ink-soft">{fr(t.cost.explain)}</p>
      <p aria-live="polite" className={`mt-3 flex gap-2 text-sm font-semibold ${over ? "text-ink" : "text-sauge"}`}>
        {over ? <TriangleAlert aria-hidden size={18} className="shrink-0" /> : <Check aria-hidden size={18} strokeWidth={3} className="shrink-0" />}
        {fr(over ? t.cost.warning(formatEuroCents(t.costWarningThreshold)) : t.cost.ok)}
      </p>
    </div>
  );
}

export function PrizeEditor() {
  const app = useAppState();
  const n = app.demo.prizes.length;
  const canAdd = n < t.maxPrizes;
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-soft">{t.prizes.count(n)}</p>
        <p className="text-xs font-medium text-sauge">{fr(t.prizes.noLoser)}</p>
      </div>
      <ul className="mt-4 space-y-4">
        {app.demo.prizes.map((p, i) => (
          <PrizeRow key={p.id} index={i} />
        ))}
      </ul>
      <button
        type="button"
        onClick={() => canAdd && app.addNewPrize(t.prizes.newPrizeName)}
        aria-disabled={!canAdd}
        className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line font-semibold transition-colors text-tomette-deep hover:border-tomette hover:bg-paper aria-disabled:cursor-not-allowed aria-disabled:text-ink-soft aria-disabled:hover:border-line"
      >
        <Plus aria-hidden size={18} /> {t.prizes.add}
      </button>
      {!canAdd ? <p className="mt-2 text-xs text-ink-soft">{fr(t.prizes.addDisabled)}</p> : null}
      {n <= t.minPrizes ? <p className="mt-2 text-xs text-ink-soft">{fr(t.prizes.minReached)}</p> : null}
      <TotalBar />
    </div>
  );
}
