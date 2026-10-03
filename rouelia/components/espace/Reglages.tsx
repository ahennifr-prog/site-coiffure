"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ImagePlus, Lock, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { palettes, pricing, type PackId } from "@/content";
import { segmentColors } from "@/lib/wheel";
import { bigTotal, MAX_EMPLOYEES, MAX_SCHEDULES, packFeatures, setBigRate, shopTheme, type ShopPrize, type ShopSettings, type WheelSchedule } from "@/lib/shop-config";
import { Monogram } from "@/components/demo/PhoneScreen";
import { readImage } from "@/components/demo/readImage";
import { Wheel } from "@/components/wheel/Wheel";
import { api, card, input } from "./api";
import { PrizeList } from "./PrizeList";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/** Fonction réservée à un pack supérieur. */
function Locked({ packs }: { packs: string }) {
  return (
    <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
      <Lock aria-hidden size={14} /> Inclus dans {packs}. Pour changer de pack, écrivez-nous.
    </p>
  );
}

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

  const bigRate = bigTotal(c.prizes);
  const hasBoth = c.prizes.some((p) => p.big) && c.prizes.some((p) => !p.big);
  const theme = shopTheme(c);
  const f = packFeatures(pack);
  const plusPacks = `${pricing.packs[1].name} et ${pricing.packs[2].name}`;
  const premiumPack = pricing.packs[2].name;

  const setSchedule = (i: number, patch: Partial<WheelSchedule>) => set({ schedules: c.schedules.map((w, k) => (k === i ? { ...w, ...patch } : w)) });
  function addSchedule(kind: WheelSchedule["kind"]) {
    const id = `roue-${Date.now().toString(36)}`;
    const today = new Date().toISOString().slice(0, 10);
    set({
      schedules: [
        ...c.schedules,
        {
          id,
          name: kind === "heures" ? "Heures creuses" : "Roue de saison",
          kind,
          start: today,
          end: today,
          days: kind === "heures" ? [2, 3, 4] : [],
          from: "14:00",
          to: "17:00",
          prizes: c.prizes.map((p) => ({ ...p, id: `${id}-${p.id}` })),
        },
      ],
    });
  }
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
          <PrizeList prizes={c.prizes} onChange={setPrizes} colors={theme.colors} />
        </section>

        <section className={card}>
          <h2 className="font-display text-2xl font-semibold">Roues programmées</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Une autre roue remplace la roue habituelle entre deux dates (Noël, soldes, fête des mères) ou sur des créneaux calmes de la semaine. Les heures creuses passent avant la roue de saison.
          </p>
          {!f.seasons ? (
            <Locked packs={plusPacks} />
          ) : (
            <>
              <ul className="mt-4 space-y-4">
                {c.schedules.map((w, i) => (
                  <li key={w.id} className="rounded-lg bg-cream p-3 ring-1 ring-line sm:p-4">
                    <div className="flex items-center gap-2">
                      <label className="sr-only" htmlFor={`${w.id}-nom`}>Nom de la roue</label>
                      <input id={`${w.id}-nom`} value={w.name} maxLength={40} onChange={(e) => setSchedule(i, { name: e.target.value })} className="min-h-11 min-w-0 flex-1 rounded-lg bg-paper px-3 font-semibold ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette" />
                      <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold ring-1 ring-line">{w.kind === "heures" ? "Heures creuses" : "Saison"}</span>
                      <button type="button" aria-label={`Supprimer la roue ${w.name}`} onClick={() => set({ schedules: c.schedules.filter((_, k) => k !== i) })} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:text-danger">
                        <Trash2 aria-hidden size={18} />
                      </button>
                    </div>
                    {w.kind === "dates" ? (
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <label className="text-sm font-semibold">
                          Du
                          <input type="date" value={w.start} onChange={(e) => setSchedule(i, { start: e.target.value })} className={`${input} mt-1`} />
                        </label>
                        <label className="text-sm font-semibold">
                          Au (inclus)
                          <input type="date" value={w.end} onChange={(e) => setSchedule(i, { end: e.target.value })} className={`${input} mt-1`} />
                        </label>
                      </div>
                    ) : (
                      <>
                        <div role="group" aria-label="Jours" className="mt-3 flex flex-wrap gap-1.5">
                          {DAYS.map((d, k) => {
                            const on = w.days.includes(k + 1);
                            return (
                              <button
                                key={d}
                                type="button"
                                aria-pressed={on}
                                onClick={() => setSchedule(i, { days: on ? w.days.filter((x) => x !== k + 1) : [...w.days, k + 1].sort() })}
                                className={`min-h-11 min-w-12 rounded-full px-3 text-sm font-semibold ring-1 ${on ? "bg-ink text-white ring-ink" : "bg-paper ring-line"}`}
                              >
                                {d}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <label className="text-sm font-semibold">
                            De
                            <input type="time" value={w.from} onChange={(e) => setSchedule(i, { from: e.target.value })} className={`${input} mt-1`} />
                          </label>
                          <label className="text-sm font-semibold">
                            À
                            <input type="time" value={w.to} onChange={(e) => setSchedule(i, { to: e.target.value })} className={`${input} mt-1`} />
                          </label>
                        </div>
                      </>
                    )}
                    <p className="mt-3 text-sm font-semibold">Cadeaux de cette roue</p>
                    <PrizeList prizes={w.prizes} onChange={(prizes) => setSchedule(i, { prizes })} colors={segmentColors(theme.base, w.prizes.length)} idPrefix={`${w.id}-`} />
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" disabled={c.schedules.length >= MAX_SCHEDULES} onClick={() => addSchedule("dates")} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-4 text-sm font-semibold ring-1 ring-line disabled:opacity-40">
                  <Plus aria-hidden size={16} /> Roue de saison
                </button>
                {f.offPeak ? (
                  <button type="button" disabled={c.schedules.length >= MAX_SCHEDULES} onClick={() => addSchedule("heures")} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-4 text-sm font-semibold ring-1 ring-line disabled:opacity-40">
                    <Plus aria-hidden size={16} /> Heures creuses
                  </button>
                ) : null}
              </div>
              {!f.offPeak ? <Locked packs={`${premiumPack} pour les heures creuses`} /> : null}
            </>
          )}
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
            {f.booking ? (
              <TextField id="rdv" type="url" label="Lien de réservation (affiché après le jeu)" value={c.bookingUrl} placeholder="https://www.planity.com/..." onChange={(v) => set({ bookingUrl: v })} help="Facultatif : Planity, TheFork, votre site." />
            ) : (
              <Locked packs={`${plusPacks} pour le lien de réservation après le jeu`} />
            )}
            {f.social ? (
              <>
                <TextField id="instagram" type="url" label="Instagram (affiché après le jeu)" value={c.instagramUrl} placeholder="https://www.instagram.com/..." onChange={(v) => set({ instagramUrl: v })} />
                <TextField id="facebook" type="url" label="Facebook (affiché après le jeu)" value={c.facebookUrl} placeholder="https://www.facebook.com/..." onChange={(v) => set({ facebookUrl: v })} />
              </>
            ) : (
              <Locked packs={`${plusPacks} pour les liens Instagram et Facebook`} />
            )}
          </div>
        </section>

        <section className={card}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">Parrainage</h2>
              <p className="text-sm text-ink-soft">Après le jeu, le client peut inviter un ami. Si l&apos;ami vient retirer son cadeau, le client reçoit un bonus, remis en caisse sur son code.</p>
            </div>
            {f.referral ? (
              <button
                type="button"
                role="switch"
                aria-checked={c.referral.enabled}
                aria-label="Parrainage actif"
                onClick={() => set({ referral: { ...c.referral, enabled: !c.referral.enabled } })}
                className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${c.referral.enabled ? "bg-sauge" : "bg-line"}`}
              >
                <span className={`absolute top-1 left-0 h-6 w-6 rounded-full bg-white shadow transition-transform ${c.referral.enabled ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            ) : null}
          </div>
          {!f.referral ? (
            <Locked packs={plusPacks} />
          ) : c.referral.enabled ? (
            <div className="mt-4">
              <TextField id="bonus" label="Bonus du parrain" value={c.referral.reward} placeholder="Un café offert" onChange={(v) => set({ referral: { ...c.referral, reward: v } })} />
            </div>
          ) : null}
        </section>

        <section className={card}>
          <h2 className="font-display text-2xl font-semibold">Équipe</h2>
          <p className="mt-1 text-sm text-ink-soft">Ajoutez les prénoms de l&apos;équipe : en caisse, chacun choisit son prénom, et le Suivi montre qui valide les cadeaux.</p>
          {!f.employees ? (
            <Locked packs={plusPacks} />
          ) : (
            <>
              <ul className="mt-3 flex flex-wrap gap-2">
                {c.employees.map((e) => (
                  <li key={e} className="inline-flex min-h-11 items-center gap-1 rounded-full bg-cream pl-4 text-sm font-semibold ring-1 ring-line">
                    {e}
                    <button type="button" aria-label={`Retirer ${e}`} onClick={() => set({ employees: c.employees.filter((x) => x !== e) })} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:text-danger">
                      <X aria-hidden size={16} />
                    </button>
                  </li>
                ))}
              </ul>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const field = (e.currentTarget.elements.namedItem("prenom") as HTMLInputElement);
                  const name = field.value.trim().slice(0, 30);
                  if (name && !c.employees.includes(name) && c.employees.length < MAX_EMPLOYEES) set({ employees: [...c.employees, name] });
                  field.value = "";
                }}
              >
                <label htmlFor="prenom-employe" className="sr-only">Prénom à ajouter</label>
                <input id="prenom-employe" name="prenom" placeholder="Prénom" maxLength={30} className={`${input} min-w-0 flex-1`} />
                <button type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-ink px-4 font-semibold text-white">
                  <Plus aria-hidden size={16} /> Ajouter
                </button>
              </form>
            </>
          )}
        </section>

        <section className={card}>
          <h2 className="font-display text-2xl font-semibold">Rentabilité</h2>
          <p className="mt-1 text-sm text-ink-soft">Pour estimer dans le Suivi ce que la roue vous rapporte chaque mois.</p>
          {!f.profit ? (
            <Locked packs={premiumPack} />
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <NumberField id="panier" label="Panier moyen" value={c.profit.basket} min={0} max={10000} suffix="€" onChange={(v) => set({ profit: { ...c.profit, basket: v } })} />
              <NumberField id="marge" label="Ce qui vous reste sur un panier" value={c.profit.margin} min={0} max={100} suffix="%" help="Après le coût des produits, hors loyer et salaires." onChange={(v) => set({ profit: { ...c.profit, margin: v } })} />
            </div>
          )}
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
