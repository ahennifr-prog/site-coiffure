"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Crown, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { ICONS, MAX_PRIZES, MIN_PRIZES, setBigRate, tierTotal } from "@/lib/config";
import type { GameConfig, Prize, PrizeIcon } from "@/lib/types";
import { maxPercentFor, readableOn, removePrize, segmentColors, setPercent, type WheelPrize } from "@/lib/wheel";
import { Wheel } from "@/components/wheel/Wheel";
import { prizeIcons } from "@/components/wheel/icons";
import { api } from "./api";

const PALETTE = ["#E2336B", "#ECEEF1", "#A98BFF", "#1B1B1F", "#F6B8CC", "#C9CDD3"];
const asWheel = (p: Prize[]) => p as unknown as WheelPrize[];
const asPrizes = (p: WheelPrize[]) => p as unknown as Prize[];

function NumberField({ id, label, value, onChange, min, max, suffix, help }: { id: string; label: string; value: number; onChange: (v: number) => void; min: number; max: number; suffix: string; help?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
          className="tabular min-h-12 w-full rounded-lg bg-noir pr-16 pl-4 ring-1 ring-trait outline-none focus:ring-2 focus:ring-rose"
        />
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gris">{suffix}</span>
      </div>
      {help ? <p className="mt-1 text-xs text-gris">{help}</p> : null}
    </div>
  );
}

export function Reglages() {
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    api<{ config: GameConfig }>("/api/admin/config").then((r) => {
      if (r.ok) {
        setConfig(r.config);
        setSaved(JSON.stringify(r.config));
      }
    });
  }, []);

  const dirty = useMemo(() => !!config && JSON.stringify(config) !== saved, [config, saved]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!config) return <p className="text-gris">Chargement des réglages…</p>;
  const c = config;
  const set = (patch: Partial<GameConfig>) => {
    setConfig({ ...c, ...patch });
    setStatus("idle");
  };
  const setPrizes = (prizes: Prize[]) => set({ prizes });
  const updatePrize = (i: number, patch: Partial<Prize>) => setPrizes(c.prizes.map((p, k) => (k === i ? { ...p, ...patch } : p)));

  const bigRate = tierTotal(c.prizes, "gros");
  const hasBoth = c.prizes.some((p) => p.tier === "gros") && c.prizes.some((p) => p.tier === "petit");
  const colors = segmentColors(PALETTE, c.prizes.length);

  async function save() {
    setStatus("saving");
    const r = await api<{ config: GameConfig }>("/api/admin/config", { method: "PUT", body: JSON.stringify({ config: c }) });
    if (r.ok) {
      setConfig(r.config);
      setSaved(JSON.stringify(r.config));
      setStatus("saved");
    } else setStatus("error");
  }

  return (
    <div className="grid gap-6 pb-28 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="rounded-xl bg-anthracite p-5 ring-1 ring-trait sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl">Jeu {c.active ? "actif" : "en pause"}</h2>
              <p className="text-sm text-gris">{c.active ? "Les clientes peuvent jouer." : "La page affiche un message de pause."}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={c.active}
              aria-label="Jeu actif"
              onClick={() => set({ active: !c.active })}
              className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${c.active ? "bg-vert" : "bg-trait"}`}
            >
              <span className={`absolute top-1 left-0 h-6 w-6 rounded-full bg-white transition-transform ${c.active ? "translate-x-7" : "translate-x-1"}`} />
            </button>
          </div>
        </section>

        <section className="rounded-xl bg-anthracite p-5 ring-1 ring-trait sm:p-6">
          <h2 className="font-display text-2xl">Gros et petits cadeaux</h2>
          {hasBoth ? (
            <>
              <div className="mt-4 flex items-end justify-between">
                <label htmlFor="bigrate" className="text-sm font-semibold">
                  Chance de gagner un gros cadeau
                </label>
                <span className="tabular font-display text-3xl text-rose">{bigRate} %</span>
              </div>
              <input
                id="bigrate"
                type="range"
                className="range"
                min={c.prizes.filter((p) => p.tier === "gros").length}
                max={60}
                value={bigRate}
                aria-valuetext={`${bigRate} %`}
                style={{ ["--fill" as string]: `${(bigRate / 60) * 100}%` }}
                onChange={(e) => setPrizes(setBigRate(c.prizes, Number(e.target.value)))}
              />
              <p className="text-sm text-argent">
                Soit environ 1 cliente sur {Math.max(1, Math.round(100 / Math.max(1, bigRate)))} qui gagne un gros cadeau. Les petits cadeaux se partagent les {100 - bigRate} % restants.
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-argent">Marquez au moins un lot « gros » et un lot « petit » pour régler la part des gros cadeaux d&apos;un seul geste.</p>
          )}
        </section>

        <section className="rounded-xl bg-anthracite p-5 ring-1 ring-trait sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Les cadeaux</h2>
            <p className="tabular text-sm font-semibold text-vert">
              Total {c.prizes.reduce((s, p) => s + p.percent, 0)} %
            </p>
          </div>
          <p className="mt-1 text-sm text-gris">Quand vous changez une chance, les autres s&apos;ajustent pour garder 100 %.</p>
          <ul className="mt-4 space-y-3">
            {c.prizes.map((p, i) => {
              const max = maxPercentFor(asWheel(c.prizes), i);
              return (
                <li key={p.id} className="rounded-lg bg-noir p-3 ring-1 ring-trait sm:p-4">
                  <div className="flex items-center gap-2">
                    <span aria-hidden className="h-9 w-2 shrink-0 rounded-full" style={{ background: colors[i] }} />
                    <label className="sr-only" htmlFor={`nom-${p.id}`}>
                      Nom du cadeau
                    </label>
                    <input
                      id={`nom-${p.id}`}
                      value={p.name}
                      maxLength={30}
                      onChange={(e) => updatePrize(i, { name: e.target.value })}
                      className="min-h-11 min-w-0 flex-1 rounded-lg bg-anthracite px-3 font-semibold ring-1 ring-trait outline-none focus:ring-2 focus:ring-rose"
                    />
                    <button
                      type="button"
                      aria-label={`Supprimer ${p.name}`}
                      disabled={c.prizes.length <= MIN_PRIZES}
                      onClick={() => setPrizes(asPrizes(removePrize(asWheel(c.prizes), i)))}
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gris hover:text-alerte disabled:opacity-30"
                    >
                      <Trash2 aria-hidden size={18} />
                    </button>
                  </div>
                  <label className="sr-only" htmlFor={`detail-${p.id}`}>
                    Précision affichée à la cliente
                  </label>
                  <input
                    id={`detail-${p.id}`}
                    value={p.detail}
                    maxLength={140}
                    placeholder="Précision affichée à la cliente (facultatif)"
                    onChange={(e) => updatePrize(i, { detail: e.target.value })}
                    className="mt-2 min-h-11 w-full rounded-lg bg-anthracite px-3 text-sm ring-1 ring-trait outline-none placeholder:text-gris focus:ring-2 focus:ring-rose"
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div role="radiogroup" aria-label={`Type de ${p.name}`} className="inline-flex rounded-full bg-anthracite p-1 ring-1 ring-trait">
                      {(["petit", "gros"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={p.tier === t}
                          onClick={() => updatePrize(i, { tier: t })}
                          className={`inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold ${p.tier === t ? (t === "gros" ? "bg-rose text-noir" : "bg-blanc text-noir") : "text-argent"}`}
                        >
                          {t === "gros" ? <Crown aria-hidden size={12} /> : null}
                          {t === "gros" ? "Gros" : "Petit"}
                        </button>
                      ))}
                    </div>
                    <label className="sr-only" htmlFor={`icone-${p.id}`}>
                      Icône
                    </label>
                    <select
                      id={`icone-${p.id}`}
                      value={p.icon}
                      onChange={(e) => updatePrize(i, { icon: e.target.value as PrizeIcon })}
                      className="min-h-11 rounded-full bg-anthracite px-3 text-sm ring-1 ring-trait"
                    >
                      {ICONS.map((ic) => (
                        <option key={ic} value={ic}>
                          {prizeIcons[ic].label}
                        </option>
                      ))}
                    </select>
                    <label className="inline-flex items-center gap-2 text-xs text-gris">
                      Valeur
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        value={p.cost}
                        onChange={(e) => updatePrize(i, { cost: Math.max(0, Number(e.target.value) || 0) })}
                        className="tabular min-h-11 w-20 rounded-lg bg-anthracite px-2 text-sm text-blanc ring-1 ring-trait"
                      />
                      €
                    </label>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <label htmlFor={`chance-${p.id}`} className="w-14 shrink-0 text-xs font-semibold text-gris">
                      Chance
                    </label>
                    <input
                      id={`chance-${p.id}`}
                      type="range"
                      className="range"
                      min={1}
                      max={Math.max(1, max)}
                      value={p.percent}
                      aria-valuetext={`${p.percent} %`}
                      style={{ ["--fill" as string]: `${((p.percent - 1) / Math.max(1, max - 1)) * 100}%` }}
                      onChange={(e) => setPrizes(asPrizes(setPercent(asWheel(c.prizes), i, Number(e.target.value))))}
                    />
                    <span className="tabular w-12 shrink-0 text-right font-semibold">{p.percent} %</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            disabled={c.prizes.length >= MAX_PRIZES}
            onClick={() => {
              const fair = Math.max(1, Math.round(100 / (c.prizes.length + 1)));
              const next: Prize[] = [...c.prizes, { id: `lot-${Date.now().toString(36)}`, name: "Nouveau cadeau", detail: "", icon: "cadeau", tier: "petit", cost: 0, percent: fair }];
              setPrizes(asPrizes(setPercent(asWheel(next), next.length - 1, fair)));
            }}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-trait font-semibold text-rose disabled:opacity-40"
          >
            <Plus aria-hidden size={18} /> Ajouter un cadeau
          </button>
          <p className="mt-2 text-xs text-gris">
            De {MIN_PRIZES} à {MAX_PRIZES} cadeaux. Au-delà, la roue devient difficile à lire sur téléphone.
          </p>
        </section>

        <section className="rounded-xl bg-anthracite p-5 ring-1 ring-trait sm:p-6">
          <h2 className="font-display text-2xl">Codes et dates</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <NumberField id="validite" label="Validité du code" value={c.validityDays} min={1} max={365} suffix="jours" onChange={(v) => set({ validityDays: v })} />
            <NumberField id="delai" label="Utilisable après" value={c.delayDays} min={0} max={30} suffix="jours" help="1 = à partir du lendemain. 0 = tout de suite." onChange={(v) => set({ delayDays: v })} />
            <NumberField id="rejouer" label="Rejouer après" value={c.replayDays} min={0} max={365} suffix="jours" help="Une partie par numéro sur cette durée. 0 = sans limite." onChange={(v) => set({ replayDays: v })} />
          </div>
        </section>

        <section className="rounded-xl bg-anthracite p-5 ring-1 ring-trait sm:p-6">
          <h2 className="font-display text-2xl">Liens</h2>
          <label htmlFor="avis" className="mt-4 block text-sm font-semibold">
            Lien « Laisser un avis Google »
          </label>
          <input id="avis" type="url" value={c.reviewUrl} onChange={(e) => set({ reviewUrl: e.target.value })} className="mt-1.5 min-h-12 w-full rounded-lg bg-noir px-4 text-sm ring-1 ring-trait outline-none focus:ring-2 focus:ring-rose" />
          <p className="mt-1.5 text-xs text-gris">
            Pour le lien direct : sur Google, cherchez « ALIA coiffure », ouvrez votre fiche en étant connecté au compte du salon, cliquez sur « Demander des avis » et copiez le lien (il commence par g.page/r/). Par défaut, le lien ouvre directement la fenêtre « Laisser un avis » du salon.
          </p>
          <label htmlFor="rdv" className="mt-4 block text-sm font-semibold">
            Lien de prise de rendez-vous
          </label>
          <input id="rdv" type="url" value={c.bookingUrl} onChange={(e) => set({ bookingUrl: e.target.value })} className="mt-1.5 min-h-12 w-full rounded-lg bg-noir px-4 text-sm ring-1 ring-trait outline-none focus:ring-2 focus:ring-rose" />
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl bg-anthracite p-5 ring-1 ring-trait">
          <p className="text-sm font-semibold text-gris">Aperçu de la roue</p>
          <Wheel
            segments={c.prizes.map((p, i) => ({
              label: p.name,
              color: colors[i],
              textColor: readableOn(colors[i]) === "#FFFFFF" ? "#FFFFFF" : "#0D0D0D",
              icon: p.tier === "gros" ? "couronne" : p.icon,
            }))}
            rimColor="#26272C"
            hubColor="#0D0D0D"
            monogram="A"
            pointerColor="#ECEEF1"
            pointerDot="#E2336B"
            bulbColors={["#FFFFFF", "#F6B8CC"]}
            label="Aperçu de la roue"
            className="mx-auto mt-3 w-full max-w-[300px]"
          />
        </div>
      </aside>

      {/* Barre d'enregistrement */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-trait bg-noir/95 px-5 py-3 backdrop-blur lg:bottom-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <p className="text-sm" role="status">
            {status === "saved" ? (
              <span className="inline-flex items-center gap-1.5 text-vert">
                <Check aria-hidden size={16} /> Enregistré. La roue est à jour pour les clientes.
              </span>
            ) : status === "error" ? (
              <span className="text-alerte">L&apos;enregistrement a échoué. Réessayez.</span>
            ) : dirty ? (
              <span className="text-rose">Modifications non enregistrées</span>
            ) : (
              <span className="text-gris">Tout est enregistré</span>
            )}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || status === "saving"}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-framboise px-6 font-semibold text-white disabled:opacity-40"
          >
            {status === "saving" ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : null}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
