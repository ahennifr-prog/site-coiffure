"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Crown, LoaderCircle, RotateCcw, Search } from "lucide-react";
import { codeStatus, formatDateTime, formatDay } from "@/lib/dates";
import { displayPhone } from "@/lib/phone";
import type { Play } from "@/lib/types";
import { api, STATUS_LABEL } from "./api";

function StatusChip({ play }: { play: Play }) {
  const s = STATUS_LABEL[codeStatus(play)];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

export function Caisse() {
  const [code, setCode] = useState("");
  const [found, setFound] = useState<Play | null>(null);
  const [message, setMessage] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [plays, setPlays] = useState<Play[] | null>(null);
  const [query, setQuery] = useState("");

  async function load() {
    const r = await api<{ plays: Play[] }>("/api/admin/plays");
    if (r.ok) setPlays(r.plays);
  }
  useEffect(() => {
    load();
  }, []);

  function updateInList(p: Play) {
    setPlays((list) => list?.map((x) => (x.code === p.code ? p : x)) ?? null);
    if (found?.code === p.code) setFound(p);
  }

  async function lookup(e?: React.FormEvent, value = code) {
    e?.preventDefault();
    if (!value.trim()) return;
    setBusy(true);
    setMessage(null);
    const r = await api<{ play?: Play }>("/api/admin/redeem", { method: "POST", body: JSON.stringify({ code: value, action: "chercher" }) });
    setBusy(false);
    if (r.ok && r.play) setFound(r.play);
    else {
      setFound(null);
      setMessage({ tone: "err", text: "Aucun cadeau ne correspond à ce code. Vérifiez les lettres et les chiffres." });
    }
  }

  async function act(p: Play, action: "valider" | "annuler") {
    setBusy(true);
    const r = await api<{ play?: Play }>("/api/admin/redeem", { method: "POST", body: JSON.stringify({ code: p.code, action }) });
    setBusy(false);
    if (r.play) updateInList(r.play);
    if (r.ok) {
      setMessage(
        action === "valider"
          ? { tone: "ok", text: `Cadeau validé : ${p.prizeName} pour ${p.firstName}.` }
          : { tone: "ok", text: "Retrait annulé : le code est de nouveau utilisable." },
      );
      navigator.vibrate?.(40);
    } else {
      const texts: Record<string, string> = {
        deja: "Ce code a déjà été utilisé.",
        expire: "Ce code a expiré.",
        pas_encore: `Ce code n'est utilisable qu'à partir du ${r.play ? formatDay(r.play.validFrom) : "lendemain"}.`,
        introuvable: "Code introuvable.",
      };
      setMessage({ tone: "err", text: texts[r.error ?? ""] ?? "L'opération a échoué." });
    }
  }

  const filtered = useMemo(() => {
    if (!plays) return [];
    const q = query.trim().toLowerCase().replace(/\s/g, "");
    if (!q) return plays.slice(0, 50);
    return plays.filter((p) => `${p.firstName}${p.phone}${displayPhone(p.phone)}${p.code}${p.prizeName}`.toLowerCase().replace(/\s/g, "").includes(q)).slice(0, 100);
  }, [plays, query]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-anthracite p-5 ring-1 ring-trait sm:p-6">
        <h2 className="font-display text-2xl">Valider un cadeau</h2>
        <p className="mt-1 text-sm text-gris">Tapez le code montré par la cliente.</p>
        <form onSubmit={lookup} className="mt-4 flex gap-2">
          <label htmlFor="code" className="sr-only">
            Code cadeau
          </label>
          <input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ALIA-XXXXX"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className="tabular min-h-13 min-w-0 flex-1 rounded-lg bg-noir px-4 font-mono text-xl tracking-wider ring-1 ring-trait outline-none focus:ring-2 focus:ring-rose"
          />
          <button type="submit" disabled={busy} aria-label="Vérifier le code" className="inline-flex min-h-13 items-center gap-2 rounded-lg bg-framboise px-5 font-semibold text-white disabled:opacity-60">
            {busy ? <LoaderCircle aria-hidden size={18} className="animate-spin" /> : <Search aria-hidden size={18} />}
            <span className="hidden sm:inline">Vérifier</span>
          </button>
        </form>

        {message ? (
          <p role="status" className={`mt-4 rounded-lg p-3 text-sm font-semibold ${message.tone === "ok" ? "bg-vert/15 text-vert" : "bg-alerte/15 text-alerte"}`}>
            {message.text}
          </p>
        ) : null}

        {found ? (
          <div className="pop-in mt-4 rounded-lg bg-noir p-4 ring-1 ring-trait">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 font-display text-2xl">
                  {found.tier === "gros" ? <Crown aria-hidden size={20} className="text-rose" /> : null}
                  {found.prizeName}
                </p>
                <p className="mt-1 text-sm text-argent">
                  {found.firstName} · {displayPhone(found.phone)} · <span className="font-mono">{found.code}</span>
                </p>
                <p className="mt-1 text-xs text-gris">
                  Gagné le {formatDateTime(found.createdAt)}. Valable du {formatDay(found.validFrom)} au {formatDay(found.expiresOn)}.
                </p>
              </div>
              <StatusChip play={found} />
            </div>
            {codeStatus(found) === "valable" ? (
              <button type="button" disabled={busy} onClick={() => act(found, "valider")} className="mt-4 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-vert font-semibold text-noir disabled:opacity-60">
                <Check aria-hidden size={20} strokeWidth={3} /> Valider le retrait
              </button>
            ) : null}
            {found.redeemedAt ? (
              <button type="button" disabled={busy} onClick={() => act(found, "annuler")} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-argent underline underline-offset-4">
                <RotateCcw aria-hidden size={16} /> Annuler ce retrait (erreur de validation)
              </button>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="rounded-xl bg-anthracite p-5 ring-1 ring-trait sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl">Gagnantes</h2>
          <button type="button" onClick={load} className="inline-flex min-h-11 items-center gap-1.5 text-sm text-argent">
            <RotateCcw aria-hidden size={14} /> Actualiser
          </button>
        </div>
        <label htmlFor="recherche" className="sr-only">
          Rechercher par prénom, téléphone ou code
        </label>
        <input
          id="recherche"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher : prénom, téléphone ou code"
          className="mt-3 min-h-12 w-full rounded-lg bg-noir px-4 ring-1 ring-trait outline-none focus:ring-2 focus:ring-rose"
        />
        {plays === null ? (
          <p className="mt-4 text-sm text-gris">Chargement…</p>
        ) : filtered.length === 0 ? (
          <p className="mt-4 text-sm text-gris">{plays.length === 0 ? "Aucune partie pour l'instant. Les gagnantes apparaîtront ici." : "Aucun résultat."}</p>
        ) : (
          <ul className="mt-3 divide-y divide-trait">
            {filtered.map((p) => (
              <li key={p.code} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {p.tier === "gros" ? <Crown aria-label="Gros cadeau" size={14} className="mr-1 inline text-rose" /> : null}
                    {p.prizeName}
                  </p>
                  <p className="truncate text-xs text-gris">
                    {p.firstName} · {displayPhone(p.phone)} · <span className="font-mono">{p.code}</span> · {formatDateTime(p.createdAt)}
                  </p>
                </div>
                <StatusChip play={p} />
                {codeStatus(p) === "valable" ? (
                  <button type="button" disabled={busy} onClick={() => act(p, "valider")} aria-label={`Valider le cadeau de ${p.firstName}`} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vert/15 text-vert">
                    <Check aria-hidden size={18} strokeWidth={3} />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
