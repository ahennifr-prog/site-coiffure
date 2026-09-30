"use client";

import { useEffect, useState } from "react";
import { Download, TriangleAlert } from "lucide-react";
import { codeStatus } from "@/lib/dates";
import type { Play } from "@/lib/types";
import { api } from "./api";

type Stats = { storage: "redis" | "netlify" | "memory"; total: Record<string, number>; perDay: ({ day: string } & Record<string, number>)[] };

const euro = (v: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)} %` : "0 %");

function Card({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ring-1 ${accent ? "bg-framboise/15 ring-framboise/40" : "bg-anthracite ring-trait"}`}>
      <p className="text-xs font-semibold text-gris">{label}</p>
      <p className="tabular mt-1 font-display text-3xl">{value}</p>
      {hint ? <p className="mt-1 text-xs text-argent">{hint}</p> : null}
    </div>
  );
}

export function Suivi() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [plays, setPlays] = useState<Play[]>([]);

  useEffect(() => {
    api<Stats>("/api/admin/stats").then((r) => r.ok && setStats(r));
    api<{ plays: Play[] }>("/api/admin/plays").then((r) => r.ok && setPlays(r.plays));
  }, []);

  if (!stats) return <p className="text-gris">Chargement du suivi…</p>;
  const t = stats.total;
  const visites = t.visites ?? 0;
  const parties = t.parties ?? 0;
  const retraits = plays.filter((p) => p.redeemedAt).length;
  const enAttente = plays.filter((p) => ["valable", "pas_encore"].includes(codeStatus(p))).length;
  const gros = plays.filter((p) => p.tier === "gros").length;
  const valeurRetiree = plays.filter((p) => p.redeemedAt).reduce((s, p) => s + p.cost, 0);
  const max = Math.max(1, ...stats.perDay.map((d) => Math.max(d.visites ?? 0, d.parties ?? 0)));

  const byPrize = Object.values(
    plays.reduce<Record<string, { name: string; gros: boolean; sortis: number; retires: number }>>((acc, p) => {
      acc[p.prizeName] ??= { name: p.prizeName, gros: p.tier === "gros", sortis: 0, retires: 0 };
      acc[p.prizeName].sortis++;
      if (p.redeemedAt) acc[p.prizeName].retires++;
      return acc;
    }, {}),
  ).sort((a, b) => b.sortis - a.sortis);

  return (
    <div className="space-y-6">
      {stats.storage === "memory" ? (
        <p className="flex gap-2 rounded-lg bg-alerte/15 p-3 text-sm font-semibold text-alerte">
          <TriangleAlert aria-hidden size={18} className="shrink-0" />
          Base de données non connectée : les parties ne sont pas conservées. Vérifiez la mise en ligne sur Netlify (voir le guide DEPLOIEMENT.md).
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card label="Scans du QR code" value={String(visites)} hint="Visites de la page du jeu" />
        <Card label="Parties jouées" value={String(parties)} hint={`${pct(parties, visites)} des visites`} accent />
        <Card label="Clics vers les avis Google" value={String(t.avis_clics ?? 0)} hint={`${pct(t.avis_clics ?? 0, t.avis_ouverts ?? 0)} des invitations`} />
        <Card label="Cadeaux retirés" value={String(retraits)} hint={`${pct(retraits, plays.length)} des cadeaux gagnés`} accent />
        <Card label="Cadeaux en attente" value={String(enAttente)} hint="Clientes qui doivent revenir" />
        <Card label="Gros cadeaux sortis" value={String(gros)} hint={`${pct(gros, plays.length)} des parties`} />
        <Card label="Valeur offerte (retirés)" value={euro(valeurRetiree)} hint="D'après les valeurs réglées" />
        <Card label="Déjà joué, revenue rejouer" value={String(t.deja_joue ?? 0)} hint="Bloquée par la limite" />
      </div>

      <section className="rounded-xl bg-anthracite p-5 ring-1 ring-trait">
        <h2 className="font-display text-xl">14 derniers jours</h2>
        <div className="mt-2 flex gap-4 text-xs text-argent">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-trait" /> Scans</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-framboise" /> Parties</span>
        </div>
        <div className="mt-4 flex h-40 items-end gap-1.5" role="img" aria-label={`Parties des 14 derniers jours : ${stats.perDay.map((d) => d.parties ?? 0).join(", ")}`}>
          {stats.perDay.map((d) => (
            <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div className="relative flex w-full flex-1 items-end justify-center">
                <div className="absolute bottom-0 w-full rounded-t bg-trait" style={{ height: `${((d.visites ?? 0) / max) * 100}%` }} />
                <div className="relative w-3/5 rounded-t bg-framboise" style={{ height: `${((d.parties ?? 0) / max) * 100}%` }} />
              </div>
              <span className="text-[10px] text-gris">{d.day.slice(8)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-anthracite p-5 ring-1 ring-trait">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl">Par cadeau</h2>
          <a href="/api/admin/export" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-noir px-4 text-sm font-semibold ring-1 ring-trait">
            <Download aria-hidden size={16} /> Exporter (Excel)
          </a>
        </div>
        {byPrize.length === 0 ? (
          <p className="mt-3 text-sm text-gris">Aucune partie pour l&apos;instant.</p>
        ) : (
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-gris">
                <th className="py-2 font-semibold">Cadeau</th>
                <th className="py-2 text-right font-semibold">Sortis</th>
                <th className="py-2 text-right font-semibold">Retirés</th>
              </tr>
            </thead>
            <tbody>
              {byPrize.map((p) => (
                <tr key={p.name} className="border-t border-trait">
                  <td className="py-2.5">
                    {p.name} {p.gros ? <span className="ml-1 rounded-full bg-rose/15 px-2 py-0.5 text-[11px] text-rose">gros</span> : null}
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
