"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { pricing, type PackId } from "@/content";
import { codeStatus, parisDay } from "@/lib/dates";
import { packFeatures, type ShopSettings } from "@/lib/shop-config";
import type { Play } from "@/lib/game";
import { api, card } from "./api";

type Stats = { total: Record<string, number>; perDay: ({ day: string } & Record<string, number>)[] };

const euro = (v: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)} %` : "0 %");

function Tile({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ring-1 ${accent ? "bg-tomette-soft ring-tomette/30" : "bg-paper ring-line"}`}>
      <p className="text-xs font-semibold text-ink-soft">{label}</p>
      <p className="tabular mt-1 font-display text-3xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}

export function Suivi() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [plays, setPlays] = useState<Play[]>([]);
  const [conf, setConf] = useState<{ settings: ShopSettings; pack: PackId } | null>(null);

  useEffect(() => {
    api<{ settings: ShopSettings; pack: PackId }>("/api/espace/reglages").then((r) => r.ok && setConf({ settings: r.settings, pack: r.pack }));
    api<Stats>("/api/espace/stats").then((r) => r.ok && setStats(r));
    api<{ plays: Play[] }>("/api/espace/parties").then((r) => r.ok && setPlays(r.plays));
  }, []);

  if (!stats) return <p className="text-ink-soft">Chargement du suivi</p>;
  const t = stats.total;
  const visites = t.visites ?? 0;
  const parties = t.parties ?? 0;
  const retraits = plays.filter((p) => p.redeemedAt).length;
  const enAttente = plays.filter((p) => ["valable", "pas_encore"].includes(codeStatus(p))).length;
  const gros = plays.filter((p) => p.big).length;
  const coutRetire = plays.filter((p) => p.redeemedAt).reduce((s, p) => s + p.cost, 0);
  const contacts = plays.filter((p) => p.marketing).length;
  const f = conf ? packFeatures(conf.pack) : null;
  const byEmployee = Object.entries(
    plays.reduce<Record<string, number>>((acc, p) => {
      if (p.redeemedAt) acc[p.redeemedBy || "Non précisé"] = (acc[p.redeemedBy || "Non précisé"] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  // Rentabilité du mois en cours (Premium) : chaque cadeau retiré compte comme une visite.
  const month = parisDay().slice(0, 7);
  const monthRedeemed = plays.filter((p) => p.redeemedAt && parisDay(new Date(p.redeemedAt)).slice(0, 7) === month);
  const basket = conf?.settings.profit.basket ?? 0;
  const margin = (conf?.settings.profit.margin ?? 0) / 100;
  const packPrice = pricing.packs.find((x) => x.id === conf?.pack)?.price ?? 0;
  const revenue = monthRedeemed.length * basket;
  const lotsCost = monthRedeemed.reduce((sum, p) => sum + p.cost, 0);
  const balance = revenue * margin - lotsCost - packPrice;

  const max = Math.max(1, ...stats.perDay.map((d) => Math.max(d.visites ?? 0, d.parties ?? 0)));

  const byPrize = Object.values(
    plays.reduce<Record<string, { name: string; big: boolean; sortis: number; retires: number }>>((acc, p) => {
      acc[p.prizeName] ??= { name: p.prizeName, big: p.big, sortis: 0, retires: 0 };
      acc[p.prizeName].sortis++;
      if (p.redeemedAt) acc[p.prizeName].retires++;
      return acc;
    }, {}),
  ).sort((a, b) => b.sortis - a.sortis);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Scans du QR code" value={String(visites)} hint="Visites de la page du jeu" />
        <Tile label="Parties jouées" value={String(parties)} hint={`${pct(parties, visites)} des visites`} accent />
        <Tile label="Clics vers les avis Google" value={String(t.avis_clics ?? 0)} hint={`${pct(t.avis_clics ?? 0, t.avis_ouverts ?? 0)} des invitations`} />
        <Tile label="Cadeaux retirés" value={String(retraits)} hint={`${pct(retraits, plays.length)} des cadeaux gagnés`} accent />
        <Tile label="Cadeaux en attente" value={String(enAttente)} hint="Clients qui doivent revenir" />
        <Tile label="Gros cadeaux sortis" value={String(gros)} hint={`${pct(gros, plays.length)} des parties`} />
        <Tile label="Coût des cadeaux retirés" value={euro(coutRetire)} hint="D'après les coûts réglés" />
        <Tile label="Clients joignables par SMS" value={String(contacts)} hint="Ils l'ont accepté en jouant" />
        {f?.referral && conf?.settings.referral.enabled ? (
          <>
            <Tile label="Amis venus grâce au parrainage" value={String(t.parrainages ?? 0)} hint="Amis invités qui ont retiré leur cadeau" />
            <Tile label="Bonus de parrainage remis" value={String(t.bonus_retires ?? 0)} />
          </>
        ) : null}
      </div>

      {f?.profit ? (
        <section className={card}>
          <h2 className="font-display text-xl font-semibold">Rentabilité ce mois-ci</h2>
          {basket > 0 ? (
            <>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div><dt className="text-ink-soft">Visites de retrait</dt><dd className="tabular font-display text-2xl font-semibold">{monthRedeemed.length}</dd></div>
                <div><dt className="text-ink-soft">Chiffre d&apos;affaires estimé</dt><dd className="tabular font-display text-2xl font-semibold">{euro(revenue)}</dd></div>
                <div><dt className="text-ink-soft">Coût des cadeaux et du pack</dt><dd className="tabular font-display text-2xl font-semibold">{euro(lotsCost + packPrice)}</dd></div>
                <div><dt className="text-ink-soft">Solde estimé</dt><dd className={`tabular font-display text-2xl font-semibold ${balance >= 0 ? "text-sauge" : "text-danger"}`}>{euro(balance)}</dd></div>
              </dl>
              <p className="mt-3 text-xs text-ink-soft">
                Estimation : chaque cadeau retiré compte comme une visite avec un panier de {euro(basket)}, dont {Math.round(margin * 100)} % vous reste. Certains clients seraient venus de toute façon : le vrai chiffre est sans doute plus bas. Réglez le panier et la marge dans l&apos;onglet Roue.
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">Indiquez votre panier moyen et votre marge dans l&apos;onglet Roue pour voir ce que la roue vous rapporte.</p>
          )}
        </section>
      ) : null}

      {f?.employees && byEmployee.length ? (
        <section className={card}>
          <h2 className="font-display text-xl font-semibold">Retraits par employé</h2>
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-ink-soft">
                <th className="py-2 font-semibold">Employé</th>
                <th className="py-2 text-right font-semibold">Cadeaux validés</th>
              </tr>
            </thead>
            <tbody>
              {byEmployee.map(([name, n]) => (
                <tr key={name} className="border-t border-line">
                  <td className="py-2.5">{name}</td>
                  <td className="tabular py-2.5 text-right">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      <section className={card}>
        <h2 className="font-display text-xl font-semibold">14 derniers jours</h2>
        <div className="mt-2 flex gap-4 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-line" /> Scans</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-tomette" /> Parties</span>
        </div>
        <div className="mt-4 flex h-40 items-end gap-1.5" role="img" aria-label={`Parties des 14 derniers jours : ${stats.perDay.map((d) => d.parties ?? 0).join(", ")}`}>
          {stats.perDay.map((d) => (
            <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div className="relative flex w-full flex-1 items-end justify-center">
                <div className="absolute bottom-0 w-full rounded-t bg-line" style={{ height: `${((d.visites ?? 0) / max) * 100}%` }} />
                <div className="relative w-3/5 rounded-t bg-tomette" style={{ height: `${((d.parties ?? 0) / max) * 100}%` }} />
              </div>
              <span className="text-[10px] text-ink-soft">{d.day.slice(8)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">Par cadeau</h2>
          <a href="/api/espace/export" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream px-4 text-sm font-semibold ring-1 ring-line">
            <Download aria-hidden size={16} /> Exporter les clients (Excel)
          </a>
        </div>
        {byPrize.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">Aucune partie pour l&apos;instant.</p>
        ) : (
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-ink-soft">
                <th className="py-2 font-semibold">Cadeau</th>
                <th className="py-2 text-right font-semibold">Sortis</th>
                <th className="py-2 text-right font-semibold">Retirés</th>
              </tr>
            </thead>
            <tbody>
              {byPrize.map((p) => (
                <tr key={p.name} className="border-t border-line">
                  <td className="py-2.5">
                    {p.name} {p.big ? <span className="ml-1 rounded-full bg-tomette-soft px-2 py-0.5 text-[11px] font-semibold">gros</span> : null}
                  </td>
                  <td className="tabular py-2.5 text-right">{p.sortis}</td>
                  <td className="tabular py-2.5 text-right">{p.retires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
