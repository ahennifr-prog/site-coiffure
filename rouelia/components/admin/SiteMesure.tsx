"use client";

import { useEffect, useState } from "react";

type Row = { id: string; label: string; last7: number; last30: number };

/** Compteurs de la mesure sans cookie (clics, envois, lecture de l'accueil), sur 7 et 30 jours. */
export function SiteMesure() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    fetch("/api/admin/mesure")
      .then((r) => r.json())
      .then((d: { ok: boolean; events?: Row[] }) => (d.ok && d.events ? setRows(d.events) : setFailed(true)))
      .catch(() => setFailed(true));
  }, []);
  return (
    <details className="mt-6 rounded-xl bg-paper p-4 ring-1 ring-line">
      <summary className="cursor-pointer font-semibold">Mesure du site (sans cookie)</summary>
      {failed ? (
        <p className="mt-3 text-sm text-ink-soft">Compteurs indisponibles (base non connectée).</p>
      ) : !rows ? (
        <p className="mt-3 text-sm text-ink-soft">Chargement des compteurs</p>
      ) : (
        <table className="mt-3 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-soft">
              <th scope="col" className="py-2 font-semibold">Événement</th>
              <th scope="col" className="py-2 text-right font-semibold">7 jours</th>
              <th scope="col" className="py-2 text-right font-semibold">30 jours</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0">
                <th scope="row" className="py-2 font-medium">{r.label}</th>
                <td className="tabular py-2 text-right">{r.last7}</td>
                <td className="tabular py-2 text-right">{r.last30}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </details>
  );
}
