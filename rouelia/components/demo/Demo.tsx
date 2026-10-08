"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, ImagePlus, X } from "lucide-react";
import { demo as t, palettes, trades } from "@/content";
import { formatEuroCents, formatPercent, fr } from "@/lib/format";
import { useAppState } from "@/components/AppState";
import { PhoneScreen, Monogram } from "./PhoneScreen";
import { CostCard, PrizeEditor } from "./PrizeEditor";
import { readImage } from "./readImage";

function useIsDesktop() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setV(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return v;
}

function Card({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="rounded-[24px] bg-paper p-6 shadow-sm ring-1 ring-line/70 sm:p-8">
      <h3 id={id} className="flex items-center gap-3 text-lg font-bold">
        <span aria-hidden className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-tomette text-sm text-white">
          {step}
        </span>
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Identity() {
  const app = useAppState();
  const uid = useId();
  return (
    <Card step={1} title={t.steps.identity}>
      <label htmlFor={`${uid}-name`} className="block text-sm font-semibold">
        {t.fields.name.label}
      </label>
      <input
        id={`${uid}-name`}
        value={app.demo.shopName}
        onChange={(e) => app.setShopName(e.target.value)}
        placeholder={t.fields.name.placeholder}
        maxLength={40}
        autoComplete="organization"
        className="mt-2 min-h-12 w-full rounded-lg bg-cream px-4 text-lg font-semibold ring-1 ring-line outline-none placeholder:font-normal placeholder:text-ink-soft focus:ring-2 focus:ring-tomette"
      />

      <p id={`${uid}-trade`} className="mt-5 text-sm font-semibold">
        {t.fields.trade.label}
      </p>
      <div role="radiogroup" aria-labelledby={`${uid}-trade`} className="mt-2 flex flex-wrap gap-2">
        {trades.map((tr) => {
          const on = app.demo.trade === tr.id;
          return (
            <button
              key={tr.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => !on && app.setTrade(tr.id)}
              className={`min-h-11 rounded-full px-4 text-sm font-semibold transition-colors ${
                on ? "bg-ink text-white" : "bg-cream text-ink ring-1 ring-line hover:ring-ink/40"
              }`}
            >
              {tr.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function Look() {
  const app = useAppState();
  const uid = useId();
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    const res = await readImage(file, t.maxLogoSizeMb);
    if ("error" in res) setError(res.error === "type" ? t.fields.logo.errorType : t.fields.logo.errorSize);
    else {
      setError(null);
      app.setLogo(res.dataUrl);
    }
  }

  return (
    <Card step={2} title={t.steps.look}>
      <p className="text-sm font-semibold">{t.fields.logo.label}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-cream ring-1 ring-line">
          {app.demo.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.demo.logo} alt="" className="h-full w-full object-contain" />
          ) : (
            <Monogram text={app.monogram} color={app.primary} className="h-full w-full text-lg" />
          )}
        </span>
        <input id={`${uid}-logo`} type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
        <label
          htmlFor={`${uid}-logo`}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-cream px-4 text-sm font-semibold ring-1 ring-line hover:ring-ink/40"
        >
          <ImagePlus aria-hidden size={18} /> {app.demo.logo ? t.fields.logo.replace : t.fields.logo.upload}
        </label>
        {app.demo.logo ? (
          <button type="button" onClick={() => app.setLogo(null)} className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-medium text-ink-soft underline underline-offset-4">
            <X aria-hidden size={16} /> {t.fields.logo.remove}
          </button>
        ) : null}
      </div>
      <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          checked={app.demo.noLogo}
          onChange={(e) => app.setNoLogo(e.target.checked)}
          className="h-5 w-5 accent-tomette"
        />
        <span>
          {t.fields.logo.none}
          <span className="block text-xs font-normal text-ink-soft">{fr(t.fields.logo.noneHelp)}</span>
        </span>
      </label>
      {error ? (
        <p role="alert" className="mt-2 text-sm font-medium text-danger">
          {fr(error)}
        </p>
      ) : null}
      <p className="mt-2 text-xs text-ink-soft">{fr(t.fields.logo.privacy)}</p>

      <p id={`${uid}-pal`} className="mt-6 text-sm font-semibold">
        {t.fields.palette.label}
      </p>
      <div role="radiogroup" aria-labelledby={`${uid}-pal`} className="mt-2 flex flex-wrap items-center gap-2">
        {palettes.map((p) => {
          const on = !app.demo.primaryColor && app.demo.paletteId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={p.label}
              title={p.label}
              onClick={() => app.setPalette(p.id)}
              className={`relative inline-flex h-12 w-12 items-center justify-center rounded-full transition-transform ${on ? "scale-105 ring-3 ring-ink ring-offset-2 ring-offset-paper" : "ring-1 ring-line hover:scale-105"}`}
              style={{ background: `conic-gradient(${p.colors.map((c, i) => `${c} ${i * 90}deg ${(i + 1) * 90}deg`).join(",")})` }}
            >
              {on ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white">
                  <Check aria-hidden size={12} strokeWidth={3} />
                </span>
              ) : null}
            </button>
          );
        })}
        <label
          className={`relative inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full pr-4 pl-1.5 text-sm font-semibold ${
            app.demo.primaryColor ? "ring-3 ring-ink ring-offset-2 ring-offset-paper" : "ring-1 ring-line"
          }`}
        >
          <input
            type="color"
            value={app.demo.primaryColor ?? app.primary}
            onChange={(e) => app.setPrimaryColor(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded-full border-0 bg-transparent p-0"
          />
          {app.demo.primaryColor ? t.fields.palette.customActive : t.fields.palette.custom}
        </label>
      </div>
    </Card>
  );
}

function Recap() {
  const app = useAppState();
  return (
    <div className="mt-10 rounded-xl bg-night p-6 text-cream sm:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h3 className="font-display text-2xl font-semibold text-white">{fr(t.recap.title)}</h3>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="sr-only">{t.fields.name.label}</dt>
              <dd className="text-lg font-semibold text-white">{app.displayName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wider text-cream/80 uppercase">{t.recap.prizes}</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {app.demo.prizes.map((p, i) => (
                  <span key={p.id} className="inline-flex items-center gap-1.5 rounded-full bg-night-soft px-3 py-1 text-sm ring-1 ring-white/10">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: app.colors[i] }} />
                    {p.name || t.prizes.newPrizeName} <span className="text-cream/80">{formatPercent(p.percent)}</span>
                  </span>
                ))}
              </dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-sm text-cream/85">{t.recap.cost}</dt>
              <dd className="tabular font-display text-2xl font-semibold text-safran">{formatEuroCents(app.avgCost)}</dd>
            </div>
          </dl>
        </div>
        <div className="md:max-w-xs">
          <button
            type="button"
            onClick={() => app.openSignup()}
            className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-tomette px-6 text-center font-semibold text-white shadow-lg hover:bg-tomette-deep"
          >
            {t.recap.cta} <ArrowRight aria-hidden size={18} />
          </button>
          <p className="mt-2 text-center text-xs text-cream/85">{fr(t.recap.kept)}</p>
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  const isDesktop = useIsDesktop();
  const [testing, setTesting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sur téléphone, le test s'ouvre en plein écran, comme chez le client.
  useEffect(() => {
    if (isDesktop || !testing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTesting(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isDesktop, testing]);

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
        {/* Aperçu : collant en haut sur téléphone, à droite sur ordinateur */}
        <div className="sticky top-(--nav-h) z-20 -mx-5 bg-cream/95 px-5 pt-2 pb-3 backdrop-blur-sm sm:-mx-8 sm:px-8 lg:top-[calc(var(--nav-h)+24px)] lg:order-2 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          {isDesktop ? (
            <div className="mx-auto w-[340px]">
              <div className="rounded-(--radius-phone) bg-night p-3 shadow-lg" aria-label={t.preview.phoneLabel} role="group">
                <div className="relative h-[660px] overflow-hidden rounded-[34px]">
                  <span aria-hidden className="absolute top-2 left-1/2 z-40 h-5 w-24 -translate-x-1/2 rounded-full bg-night" />
                  <div className="h-full pt-5">
                    <PhoneScreen mode={testing ? "test" : "preview"} onStartTest={() => setTesting(true)} onExitTest={() => setTesting(false)} />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-sm text-ink-soft">{fr(testing ? t.preview.testHint : t.preview.liveHint)}</p>
            </div>
          ) : (
            <div className="mx-auto h-[min(300px,42svh)] max-w-md overflow-hidden rounded-xl shadow-md ring-1 ring-line" role="group" aria-label={t.preview.phoneLabel}>
              <PhoneScreen mode="preview" compact onStartTest={() => setTesting(true)} />
            </div>
          )}
        </div>

        <div className="space-y-5 lg:order-1">
          <Identity />
          <Look />
          <Card step={3} title={t.steps.prizes}>
            <PrizeEditor />
          </Card>
          <CostCard />
        </div>
      </div>

      <Recap />

      {!isDesktop && testing ? (
        <div ref={overlayRef} role="dialog" aria-modal="true" aria-label={t.preview.phoneLabel} className="fixed inset-0 z-[60] flex flex-col bg-cream">
          <div className="flex justify-end px-3 pt-2">
            <button
              type="button"
              onClick={() => setTesting(false)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink"
            >
              <X aria-hidden size={18} /> {t.preview.backToSettings}
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <PhoneScreen mode="test" />
          </div>
        </div>
      ) : null}
    </>
  );
}
