"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { codeStatus } from "@/lib/dates";
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

  useEffect(() => {
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
      </div>

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
