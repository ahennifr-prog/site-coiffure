"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Gift, ImageIcon, LogOut, Mail, Phone, RotateCcw, Trash2, TriangleAlert } from "lucide-react";
import { admin, pricing, trades } from "@/content";
import { formatEuroCents, fr } from "@/lib/format";
import { offerSummary } from "@/lib/offers";
import { SIGNUP_STATUSES, type SignupRecord, type SignupStatus } from "@/lib/signup";
import { Logo } from "@/components/brand/Logo";
import { ShopPanel, type AdminShop } from "./ShopPanel";
import { SiteMesure } from "./SiteMesure";

type Data = { storage: "d1" | "memory"; signups: SignupRecord[] };

const STATUS_STYLE: Record<SignupStatus, string> = {
  essai_en_attente: "bg-safran-soft text-ink",
  essai_en_cours: "bg-tomette-soft text-ink",
  client: "bg-sauge text-white",
  perdu: "bg-line text-ink-soft",
};

function when(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function phoneDisplay(e164: string) {
  return ("0" + e164.replace("+33", "")).replace(/(\d{2})(?=\d)/g, "$1 ");
}

export function AdminDashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [shops, setShops] = useState<AdminShop[]>([]);

  async function loadShops() {
    try {
      const res = await fetch("/api/admin/shops", { cache: "no-store" });
      const d = await res.json();
      if (d.ok) setShops(d.shops);
    } catch {
      /* commerces indisponibles : les inscriptions restent affichées */
    }
  }

  async function load() {
    setError(false);
    try {
      const res = await fetch("/api/admin/signups", { cache: "no-store" });
      if (res.status === 401) return window.location.reload();
      const d = await res.json();
      if (d.ok) setData({ storage: d.storage, signups: d.signups });
      else setError(true);
    } catch {
      setError(true);
    }
  }
  useEffect(() => {
    load();
    loadShops();
  }, []);

  async function setStatus(id: string, status: SignupStatus) {
    setData((d) => (d ? { ...d, signups: d.signups.map((s) => (s.id === id ? { ...s, status } : s)) } : d));
    await fetch("/api/admin/signups", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
  }

  async function remove(s: SignupRecord) {
    if (!window.confirm(admin.confirmRemove(`${s.firstName} (${s.shopName})`))) return;
    await fetch("/api/admin/signups", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: s.id }) });
    setData((d) => (d ? { ...d, signups: d.signups.filter((x) => x.id !== s.id) } : d));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const list = useMemo(() => {
    const all = data?.signups ?? [];
    const q = query.trim().toLowerCase().replace(/\s/g, "");
    if (!q) return all;
    return all.filter((s) => `${s.firstName}${s.shopName}${s.email}${s.phone}${phoneDisplay(s.phone)}`.toLowerCase().replace(/\s/g, "").includes(q));
  }, [data, query]);

  const count = (st: SignupStatus) => data?.signups.filter((s) => s.status === st).length ?? 0;

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
          <Logo />
          <span className="text-xs font-bold tracking-[0.12em] text-tomette-deep uppercase">Admin</span>
          <button type="button" onClick={logout} aria-label={admin.logout} title={admin.logout} className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-paper">
            <LogOut aria-hidden size={18} />
          </button>
        </div>
      </header>

      <main id="contenu" className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl font-semibold">{admin.title}</h1>
          <div className="flex gap-2">
            <button type="button" onClick={() => { load(); loadShops(); }} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-paper">
              <RotateCcw aria-hidden size={16} /> {admin.refresh}
            </button>
            <a href="/api/admin/export" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white">
              <Download aria-hidden size={16} /> {admin.export}
            </a>
          </div>
        </div>

        {data?.storage === "memory" ? (
          <p className="mt-5 flex gap-2 rounded-lg bg-safran-soft p-3 text-sm font-semibold ring-1 ring-safran">
            <TriangleAlert aria-hidden size={18} className="shrink-0" /> {fr(admin.memoryWarning)}
          </p>
        ) : null}

        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [admin.counts.total, data?.signups.length ?? 0],
            [admin.counts.pending, count("essai_en_attente")],
            [admin.counts.active, count("essai_en_cours")],
            [admin.counts.clients, count("client")],
          ].map(([label, n]) => (
            <div key={label as string} className="rounded-xl bg-paper p-4 ring-1 ring-line">
              <dt className="text-xs font-semibold text-ink-soft">{label}</dt>
              <dd className="tabular mt-1 font-display text-3xl font-semibold">{n}</dd>
            </div>
          ))}
        </dl>

        <SiteMesure />

        <label htmlFor="recherche" className="sr-only">
          {admin.search}
        </label>
        <input
          id="recherche"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={admin.search}
          className="mt-6 min-h-12 w-full rounded-lg bg-paper px-4 ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette"
        />

        {error ? (
          <p role="alert" className="mt-6 text-danger">
            {fr(admin.login.failed)}
          </p>
        ) : !data ? (
          <p className="mt-6 text-ink-soft" role="status">
            {admin.loading}
          </p>
        ) : list.length === 0 ? (
          <p className="mt-6 text-ink-soft">{fr(data.signups.length ? admin.noResult : admin.empty)}</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {list.map((s) => {
              const trade = trades.find((t) => t.id === s.trade)?.label ?? s.trade ?? "";
              const pack = pricing.packs.find((p) => p.id === s.pack)?.name ?? s.pack;
              return (
                <li key={s.id} className="rounded-xl bg-paper p-5 ring-1 ring-line">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-xl font-semibold">
                        {s.shopName} <span className="font-sans text-base font-normal text-ink-soft">· {s.firstName}</span>
                      </p>
                      <p className="mt-0.5 text-sm text-ink-soft">
                        {when(s.createdAt)} · {trade} · Pack {pack}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="sr-only" htmlFor={`st-${s.id}`}>
                        {admin.statusLabel}
                      </label>
                      <select
                        id={`st-${s.id}`}
                        value={s.status}
                        onChange={(e) => setStatus(s.id, e.target.value as SignupStatus)}
                        className={`min-h-10 rounded-full px-3 text-sm font-semibold ${STATUS_STYLE[s.status]}`}
                      >
                        {SIGNUP_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {admin.statuses[st]}
                          </option>
                        ))}
                      </select>
                      <button type="button" onClick={() => remove(s)} aria-label={`${admin.remove} ${s.shopName}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:text-danger">
                        <Trash2 aria-hidden size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={`tel:${s.phone}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-tomette px-4 text-sm font-semibold text-white">
                      <Phone aria-hidden size={14} /> {phoneDisplay(s.phone)}
                    </a>
                    <a href={`mailto:${s.email}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold ring-1 ring-line">
                      <Mail aria-hidden size={14} /> {s.email}
                    </a>
                  </div>
                  {s.wheelConfig ? (
                    <div className="mt-3 rounded-lg bg-cream p-3 text-sm">
                      <p className="flex items-center gap-2 font-semibold">
                        {admin.wheel} · {formatEuroCents(s.wheelConfig.averageCost)} {admin.avgCost}
                        {s.wheelConfig.logo ? (
                          <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
                            <ImageIcon aria-hidden size={12} /> {admin.logo}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 text-ink-soft">{s.wheelConfig.prizes.map((p) => `${p.name} ${p.percent} %`).join(" · ")}</p>
                    </div>
                  ) : null}
                  {s.offer ? (
                    <p className={`mt-3 flex gap-2 rounded-lg p-3 text-sm ${s.offer.status === "applied" ? "bg-sauge/10" : "bg-safran-soft"}`}>
                      <Gift aria-hidden size={16} className="mt-0.5 shrink-0" />
                      <span>
                        <span className="font-semibold">{admin.offer.title} : </span>
                        {fr(offerSummary(s.offer))}
                      </span>
                    </p>
                  ) : null}
                  <ShopPanel
                    signup={s}
                    shop={shops.find((x) => x.signupId === s.id)}
                    onChange={() => {
                      load();
                      loadShops();
                    }}
                  />
                  <p className="mt-2 text-xs text-ink-soft">
                    {admin.source} : {[s.utm.source, s.utm.medium, s.utm.campaign].filter(Boolean).join(" / ") || s.utm.referrer || admin.direct}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
