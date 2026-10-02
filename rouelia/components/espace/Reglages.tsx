"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Crown, ImagePlus, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { palettes, type PackId, type PrizeIcon } from "@/content";
import { averageCost, maxPercentFor, removePrize, setPercent, type WheelPrize } from "@/lib/wheel";
import { formatEuroCents } from "@/lib/format";
import { bigTotal, hasBooking, MAX_PRIZES, MIN_PRIZES, setBigRate, shopTheme, type ShopPrize, type ShopSettings } from "@/lib/shop-config";
import { Monogram } from "@/components/demo/PhoneScreen";
import { readImage } from "@/components/demo/readImage";
import { Wheel } from "@/components/wheel/Wheel";
import { prizeIconIds, prizeIcons } from "@/components/wheel/icons";
import { api, card, input } from "./api";

const asWheel = (p: ShopPrize[]) => p as unknown as WheelPrize[];
const asPrizes = (p: WheelPrize[]) => p as unknown as ShopPrize[];

function NumberField({ id, label, value, onChange, min, max, suffix, help }: { id: string; label: string; value: number; onChange: (v: number) => void; min: number; max: number; suffix: string; help?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">{label}</label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
          aria-describedby={help ? `${id}-aide` : undefined}
          className={`${input} tabular pr-16`}
        />
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-ink-soft">{suffix}</span>
      </div>
      {help ? <p id={`${id}-aide`} className="mt-1 text-xs text-ink-soft">{help}</p> : null}
    </div>
  );
}

function TextField({ id, label, value, onChange, help, type = "text", placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; help?: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">{label}</label>
      <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} aria-describedby={help ? `${id}-aide` : undefined} className={`${input} mt-1.5`} />
      {help ? <p id={`${id}-aide`} className="mt-1 text-xs text-ink-soft">{help}</p> : null}
    </div>
  );
}

export function Reglages({ slug, pack, onSaved }: { slug: string; pack: PackId; onSaved: (s: ShopSettings) => void }) {
  const [config, setConfig] = useState<ShopSettings | null>(null);
  const [saved, setSaved] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [logoStatus, setLogoStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api<{ settings: ShopSettings }>("/api/espace/reglages").then((r) => {
      if (r.ok) {
        setConfig(r.settings);
        setSaved(JSON.stringify(r.settings));
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

  if (!config) return <p className="text-ink-soft">Chargement des réglages</p>;
  const c = config;
  const set = (patch: Partial<ShopSettings>) => {
    setConfig({ ...c, ...patch });
    setStatus("idle");
  };
  const setPrizes = (prizes: ShopPrize[]) => set({ prizes });
  const updatePrize = (i: number, patch: Partial<ShopPrize>) => setPrizes(c.prizes.map((p, k) => (k === i ? { ...p, ...patch } : p)));

  const bigRate = bigTotal(c.prizes);
  const hasBoth = c.prizes.some((p) => p.big) && c.prizes.some((p) => !p.big);
  const theme = shopTheme(c);
  const avg = averageCost(c.prizes);
  const logoUrl = c.hasLogo ? `/api/j/${slug}/logo?v=${c.logoVersion}` : null;

  async function save() {
    setStatus("saving");
    const r = await api<{ settings: ShopSettings }>("/api/espace/reglages", { method: "PUT", body: JSON.stringify({ settings: c }) });
    if (r.ok) {
      setConfig(r.settings);
      setSaved(JSON.stringify(r.settings));
      setStatus("saved");
      onSaved(r.settings);
    } else setStatus("error");
  }

  async function sendLogo(logo: string | null) {
    setLogoStatus("Envoi du logo");
    const r = await api<{ settings: ShopSettings }>("/api/espace/logo", { method: "PUT", body: JSON.stringify({ logo }) });
    if (r.ok) {
      // Le logo est enregistré tout de suite, sans toucher aux autres modifications en cours.
      setConfig((cur) => (cur ? { ...cur, hasLogo: r.settings.hasLogo, logoVersion: r.settings.logoVersion } : cur));
      setSaved((s) => JSON.stringify({ ...JSON.parse(s), hasLogo: r.settings.hasLogo, logoVersion: r.settings.logoVersion }));
      setLogoStatus(logo ? "Logo enregistré." : "Logo retiré.");
      onSaved({ ...c, hasLogo: r.settings.hasLogo, logoVersion: r.settings.logoVersion });
    } else setLogoStatus("Ce fichier n'a pas pu être enregistré. Essayez un PNG ou un JPG.");
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    const res = await readImage(file, 5);
    if ("error" in res) setLogoStatus(res.error === "type" ? "Ce fichier n'est pas une image. Essayez un JPG ou un PNG." : "Cette image dépasse 5 Mo.");
    else await sendLogo(res.dataUrl);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="grid gap-6 pb-28 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className={card}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">Jeu {c.active ? "actif" : "en pause"}</h2>
              <p className="text-sm text-ink-soft">{c.active ? "Vos clients peuvent jouer." : "La page affiche un message de pause. Les codes déjà gagnés restent valables."}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={c.active}
              aria-label="Jeu actif"
              onClick={() => set({ active: !c.active })}
              className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${c.active ? "bg-sauge" : "bg-line"}`}
            >
              <span className={`absolute top-1 left-0 h-6 w-6 rounded-full bg-white shadow transition-transform ${c.active ? "translate-x-7" : "translate-x-1"}`} />
            </button>
          </div>
        </section>

        <section className={card}>
          <h2 className="font-display text-2xl font-semibold">Gros et petits cadeaux</h2>
          {hasBoth ? (
            <>
              <div className="mt-4 flex items-end justify-between">
                <label htmlFor="bigrate" className="text-sm font-semibold">Chance de gagner un gros cadeau</label>
                <span className="tabular font-display text-3xl font-semibold text-tomette-deep">{bigRate} %</span>
              </div>
              <input
                id="bigrate"
                type="range"
                className="range"
                min={c.prizes.filter((p) => p.big).length}
                max={60}
                value={bigRate}
                aria-valuetext={`${bigRate} %`}
                style={{ ["--fill" as string]: `${(bigRate / 60) * 100}%` }}
                onChange={(e) => setPrizes(setBigRate(c.prizes, Number(e.target.value)))}
              />
              <p className="text-sm text-ink-soft">
                Soit environ 1 client sur {Math.max(1, Math.round(100 / Math.max(1, bigRate)))} qui gagne un gros cadeau. Les petits cadeaux se partagent les {100 - bigRate} % restants.
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">Marquez au moins un lot « gros » et un lot « petit » pour régler la part des gros cadeaux d&apos;un seul geste.</p>
          )}
        </section>

        <section className={card}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Les cadeaux</h2>
            <p className="tabular text-sm font-semibold text-sauge">Total {c.prizes.reduce((s, p) => s + p.percent, 0)} %</p>
          </div>
          <p className="mt-1 text-sm text-ink-soft">Quand vous changez une chance, les autres s&apos;ajustent pour garder 100 %.</p>
          <ul className="mt-4 space-y-3">
            {c.prizes.map((p, i) => {
              const max = maxPercentFor(asWheel(c.prizes), i);
              return (
                <li key={p.id} className="rounded-lg bg-cream p-3 ring-1 ring-line sm:p-4">
                  <div className="flex items-center gap-2">
                    <span aria-hidden className="h-9 w-2 shrink-0 rounded-full" style={{ background: theme.colors[i] }} />
                    <label className="sr-only" htmlFor={`nom-${p.id}`}>Nom du cadeau</label>
                    <input id={`nom-${p.id}`} value={p.name} maxLength={30} onChange={(e) => updatePrize(i, { name: e.target.value })} className="min-h-11 min-w-0 flex-1 rounded-lg bg-paper px-3 font-semibold ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette" />
                    <button
                      type="button"
                      aria-label={`Supprimer ${p.name}`}
                      disabled={c.prizes.length <= MIN_PRIZES}
                      onClick={() => setPrizes(asPrizes(removePrize(asWheel(c.prizes), i)))}
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:text-danger disabled:opacity-30"
                    >
                      <Trash2 aria-hidden size={18} />
                    </button>
                  </div>
                  <label className="sr-only" htmlFor={`detail-${p.id}`}>Précision affichée au client</label>
                  <input
                    id={`detail-${p.id}`}
                    value={p.detail}
                    maxLength={140}
                    placeholder="Précision affichée au client (facultatif)"
                    onChange={(e) => updatePrize(i, { detail: e.target.value })}
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
                          onClick={() => updatePrize(i, { big })}
                          className={`inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold ${p.big === big ? (big ? "bg-tomette text-white" : "bg-ink text-white") : "text-ink-soft"}`}
                        >
                          {big ? <Crown aria-hidden size={12} /> : null}
                          {big ? "Gros" : "Petit"}
                        </button>
                      ))}
                    </div>
                    <label className="sr-only" htmlFor={`icone-${p.id}`}>Icône</label>
                    <select id={`icone-${p.id}`} value={p.icon} onChange={(e) => updatePrize(i, { icon: e.target.value as PrizeIcon })} className="min-h-11 rounded-full bg-paper px-3 text-sm ring-1 ring-line">
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
                        onChange={(e) => updatePrize(i, { cost: Math.max(0, Number(e.target.value) || 0) })}
                        className="tabular min-h-11 w-20 rounded-lg bg-paper px-2 text-sm text-ink ring-1 ring-line"
                      />
                      €
                    </label>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <label htmlFor={`chance-${p.id}`} className="w-14 shrink-0 text-xs font-semibold text-ink-soft">Chance</label>
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
              const next: ShopPrize[] = [...c.prizes, { id: `lot-${Date.now().toString(36)}`, name: "Nouveau cadeau", detail: "", icon: "cadeau", big: false, cost: 0, percent: fair }];
              setPrizes(asPrizes(setPercent(asWheel(next), next.length - 1, fair)));
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
        </section>

        <section className={card}>
          <h2 className="font-display text-2xl font-semibold">Codes et dates</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <NumberField id="validite" label="Validité du code" value={c.validityDays} min={1} max={365} suffix="jours" onChange={(v) => set({ validityDays: v })} />
            <NumberField id="delai" label="Utilisable après" value={c.delayDays} min={0} max={30} suffix="jours" help="1 = à partir du lendemain. 0 = tout de suite." onChange={(v) => set({ delayDays: v })} />
            <NumberField id="rejouer" label="Rejouer après" value={c.replayDays} min={0} max={365} suffix="jours" help="Une partie par numéro sur cette durée. 0 = sans limite." onChange={(v) => set({ replayDays: v })} />
          </div>
        </section>

        <section className={card}>
          <h2 className="font-display text-2xl font-semibold">Liens</h2>
          <div className="mt-4 space-y-4">
            <TextField
              id="avis"
              type="url"
              label="Lien « Laisser un avis Google »"
              value={c.reviewUrl}
              placeholder="https://g.page/r/..."
              onChange={(v) => set({ reviewUrl: v })}
              help="Sur Google, ouvrez votre fiche en étant connecté au compte du commerce, cliquez sur « Demander des avis » et copiez le lien. Sans lien, l'invitation à laisser un avis n'apparaît pas."
            />
            {hasBooking(pack) ? (
              <TextField id="rdv" type="url" label="Lien de réservation (affiché après le jeu)" value={c.bookingUrl} placeholder="https://www.planity.com/..." onChange={(v) => set({ bookingUrl: v })} help="Facultatif : Planity, TheFork, votre site." />
            ) : (
              <p className="text-sm text-ink-soft">Le lien de réservation après le jeu est inclus dans les packs Croissance et Premium.</p>
            )}
          </div>
        </section>

        <section className={card}>
          <h2 className="font-display text-2xl font-semibold">Votre commerce</h2>
          <p className="mt-1 text-sm text-ink-soft">Ces informations s&apos;affichent sur la page du jeu et dans son règlement.</p>
          <div className="mt-4 space-y-4">
            <TextField id="nom" label="Nom du commerce" value={c.name} onChange={(v) => set({ name: v })} />
            <TextField id="adresse" label="Adresse" value={c.address} onChange={(v) => set({ address: v })} />
            <TextField id="telephone" type="tel" label="Téléphone affiché" value={c.phone} onChange={(v) => set({ phone: v })} />
          </div>
        </section>

        <section className={card}>
          <h2 className="font-display text-2xl font-semibold">Couleurs et logo</h2>
          <p id="palette-label" className="mt-4 text-sm font-semibold">Couleurs</p>
          <div role="radiogroup" aria-labelledby="palette-label" className="mt-2 flex flex-wrap gap-2">
            {palettes.map((p) => {
              const on = !c.primaryColor && c.paletteId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => set({ paletteId: p.id, primaryColor: null })}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-cream py-1.5 pr-4 pl-1.5 text-sm font-semibold ring-1 ${on ? "ring-2 ring-ink" : "ring-line"}`}
                >
                  <span aria-hidden className="flex overflow-hidden rounded-full ring-1 ring-line">
                    {p.colors.map((col) => <span key={col} className="h-7 w-3.5" style={{ background: col }} />)}
                  </span>
                  {p.label}
                </button>
              );
            })}
          </div>
          <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold">
            <input type="color" value={c.primaryColor ?? theme.primary} onChange={(e) => set({ primaryColor: e.target.value.toUpperCase() })} className="h-10 w-12 cursor-pointer rounded border-0 bg-transparent" />
            {c.primaryColor ? `Couleur personnalisée ${c.primaryColor}` : "Couleur principale au choix"}
          </label>

          <p className="mt-5 text-sm font-semibold">Logo</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-cream ring-1 ring-line">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Votre logo" className="h-full w-full object-contain" />
              ) : (
                <Monogram text={theme.monogram} color={theme.primary} className="h-full w-full" />
              )}
            </span>
            <input ref={fileRef} id="logo" type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            <label htmlFor="logo" className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-cream px-4 text-sm font-semibold ring-1 ring-line">
              <ImagePlus aria-hidden size={18} /> {c.hasLogo ? "Changer le logo" : "Ajouter un logo"}
            </label>
            {c.hasLogo ? (
              <button type="button" onClick={() => sendLogo(null)} className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-ink-soft underline underline-offset-4">
                Retirer le logo
              </button>
            ) : null}
          </div>
          <p role="status" className="mt-2 min-h-5 text-sm text-ink-soft">{logoStatus}</p>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className={card}>
          <p className="text-sm font-semibold text-ink-soft">Aperçu de la roue</p>
          <Wheel
            segments={c.prizes.map((p, i) => ({ label: p.name, color: theme.colors[i], textColor: theme.textColors[i], icon: p.icon }))}
            logo={logoUrl}
            monogram={theme.monogram}
            hubColor={theme.primary}
            rimColor={theme.rim}
            label="Aperçu de la roue"
            className="mx-auto mt-3 w-full max-w-[300px]"
          />
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur lg:bottom-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <p className="text-sm" role="status">
            {status === "saved" ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-sauge">
                <Check aria-hidden size={16} /> Enregistré. La roue est à jour pour vos clients.
              </span>
            ) : status === "error" ? (
              <span className="font-semibold text-danger">L&apos;enregistrement a échoué. Réessayez.</span>
            ) : dirty ? (
              <span className="font-semibold text-tomette-deep">Modifications non enregistrées</span>
            ) : (
              <span className="text-ink-soft">Tout est enregistré</span>
            )}
          </p>
          <button type="button" onClick={save} disabled={!dirty || status === "saving"} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-tomette px-6 font-semibold text-white hover:bg-tomette-deep disabled:opacity-40">
            {status === "saving" ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : null}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
