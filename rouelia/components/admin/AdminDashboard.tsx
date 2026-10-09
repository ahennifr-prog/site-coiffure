"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarClock, Download, Inbox, LogOut, RotateCcw, TriangleAlert, Users } from "lucide-react";
import { admin } from "@/content";
import { fr } from "@/lib/format";
import type { AdminCall, AdminRequest } from "@/lib/admin";
import type { SignupRecord, SignupStatus } from "@/lib/signup";
import { Logo } from "@/components/brand/Logo";
import type { AdminShop } from "./ShopPanel";
import { SignupCard } from "./SignupCard";
import { CallsTab } from "./CallsTab";
import { RequestsTab } from "./RequestsTab";
import { SiteMesure } from "./SiteMesure";
import { adminFetch, Empty, FilterChips, phoneDisplay } from "./ui";

const TABS = [
  { id: "inscriptions", label: "Inscriptions", Icon: Users },
  { id: "appels", label: "Appels", Icon: CalendarClock },
  { id: "demandes", label: "Demandes", Icon: Inbox },
  { id: "mesure", label: "Mesure", Icon: BarChart3 },
] as const;
type Tab = (typeof TABS)[number]["id"];
type StatusFilter = SignupStatus | "tous";

/**
 * Espace admin d'Aymen, en quatre onglets :
 * - Inscriptions : essais à ouvrir, en cours, clients, perdus ; chaque fiche est modifiable (coordonnées, pack, notes) ;
 * - Appels : appels réservés, à venir en premier ;
 * - Demandes : formulaires « Créez-la pour moi » et « Autre activité », à marquer traités ;
 * - Mesure : compteurs du site sans cookie.
 * L'onglet ouvert est gardé dans l'adresse (#appels...) pour y revenir directement.
 */
export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("inscriptions");
  const [signups, setSignups] = useState<SignupRecord[] | null>(null);
  const [storage, setStorage] = useState<"d1" | "memory">("d1");
  const [shops, setShops] = useState<AdminShop[]>([]);
  const [calls, setCalls] = useState<AdminCall[]>([]);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter | null>(null);
  const [loading, setLoading] = useState(false);
  // Fiches sur lesquelles on vient d'agir : elles restent visibles même si leur statut sort du filtre.
  const [kept, setKept] = useState<Set<string>>(new Set());
  const keep = (id: string) => setKept((k) => new Set(k).add(id));
  const filterBy = (st: StatusFilter) => {
    setStatus(st);
    setKept(new Set());
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const [s, sh, c, r] = await Promise.all([
      adminFetch<{ storage: "d1" | "memory"; signups: SignupRecord[] }>("/api/admin/signups", "GET"),
      adminFetch<{ shops: AdminShop[] }>("/api/admin/shops", "GET"),
      adminFetch<{ calls: AdminCall[] }>("/api/admin/appels", "GET"),
      adminFetch<{ requests: AdminRequest[] }>("/api/admin/demandes", "GET"),
    ]);
    if (s?.ok) {
      setSignups(s.signups);
      setStorage(s.storage);
    } else setError(true);
    if (sh?.ok) setShops(sh.shops);
    if (c?.ok) setCalls(c.calls);
    if (r?.ok) setRequests(r.requests);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (TABS.some((t) => t.id === h)) setTab(h as Tab);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [load]);

  function choose(t: Tab) {
    setTab(t);
    history.replaceState(null, "", `#${t}`);
    window.scrollTo({ top: 0 });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const all = useMemo(() => signups ?? [], [signups]);
  const count = (st: SignupStatus) => all.filter((s) => s.status === st).length;
  const pending = count("essai_en_attente");
  // Par défaut : les essais à ouvrir s'il y en a, sinon tout.
  const activeStatus: StatusFilter = status ?? (pending ? "essai_en_attente" : "tous");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s/g, "");
    return all.filter(
      (s) =>
        (activeStatus === "tous" || s.status === activeStatus || kept.has(s.id)) &&
        (!q || `${s.firstName}${s.shopName}${s.email}${s.phone}${phoneDisplay(s.phone)}${s.notes ?? ""}`.toLowerCase().replace(/\s/g, "").includes(q)),
    );
  }, [all, query, activeStatus, kept]);

  const now = Date.now();
  const upcomingCalls = calls.filter((c) => !c.done && new Date(c.end).getTime() >= now).length;
  const openRequests = requests.filter((r) => !r.done).length;
  const badge: Record<Tab, number> = { inscriptions: pending, appels: upcomingCalls, demandes: openRequests, mesure: 0 };

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-5">
          <Logo />
          <span className="text-xs font-bold tracking-[0.12em] text-tomette-deep uppercase">Admin</span>
          <button type="button" onClick={() => void load()} aria-label={admin.refresh} title={admin.refresh} className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-paper">
            <RotateCcw aria-hidden size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button type="button" onClick={logout} aria-label={admin.logout} title={admin.logout} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-paper">
            <LogOut aria-hidden size={18} />
          </button>
        </div>
        <nav aria-label="Rubriques de l'admin" className="mx-auto max-w-5xl overflow-x-auto px-2 sm:px-3">
          <ul className="flex gap-1">
            {TABS.map(({ id, label, Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => choose(id)}
                  aria-current={tab === id ? "page" : undefined}
                  className={`relative inline-flex min-h-12 items-center gap-1.5 px-2 text-sm font-semibold whitespace-nowrap sm:gap-2 sm:px-3 transition-colors ${tab === id ? "text-ink" : "text-ink-soft hover:text-ink"}`}
                >
                  <Icon aria-hidden size={16} className="max-sm:hidden" />
                  {label}
                  {badge[id] ? (
                    <span className="tabular inline-flex min-w-5 items-center justify-center rounded-full bg-tomette px-1.5 text-xs text-white" aria-label={`${badge[id]} à traiter`}>
                      {badge[id]}
                    </span>
                  ) : null}
                  <span aria-hidden className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full ${tab === id ? "bg-tomette" : "bg-transparent"}`} />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="contenu" className="mx-auto max-w-5xl px-5 py-6">
        {storage === "memory" ? (
          <p className="mb-5 flex gap-2 rounded-lg bg-safran-soft p-3 text-sm font-semibold ring-1 ring-safran">
            <TriangleAlert aria-hidden size={18} className="shrink-0" /> {fr(admin.memoryWarning)}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="mb-5 text-danger">
            {fr(admin.login.failed)}
          </p>
        ) : null}

        <h1 className="sr-only">{TABS.find((t) => t.id === tab)?.label}</h1>

        {tab === "inscriptions" ? (
          <section aria-label="Inscriptions">
            <FilterChips
              label="Filtrer par statut"
              value={activeStatus}
              onChange={filterBy}
              options={[
                { id: "essai_en_attente", label: "À ouvrir", count: pending },
                { id: "essai_en_cours", label: "Essai en cours", count: count("essai_en_cours") },
                { id: "client", label: "Clients", count: count("client") },
                { id: "perdu", label: "Perdus", count: count("perdu") },
                { id: "tous", label: "Tous", count: all.length },
              ]}
            />
            <div className="mt-3 flex gap-2">
              <label htmlFor="recherche" className="sr-only">
                {admin.search}
              </label>
              <input
                id="recherche"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher : nom, commerce, e-mail, téléphone, notes"
                className="min-h-11 min-w-0 flex-1 rounded-full bg-paper px-4 ring-1 ring-line outline-none focus:ring-2 focus:ring-ink"
              />
              <a href="/api/admin/export" title={admin.export} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white">
                <Download aria-hidden size={16} /> <span className="max-sm:sr-only">{admin.export}</span>
              </a>
            </div>
            {!signups ? (
              <p className="mt-6 text-ink-soft" role="status">
                {admin.loading}
              </p>
            ) : list.length === 0 ? (
              <Empty>{all.length ? (query ? admin.noResult : "Rien dans cette catégorie.") : fr(admin.empty)}</Empty>
            ) : (
              <ul className="mt-4 space-y-3">
                {list.map((s) => (
                  <SignupCard
                    key={s.id}
                    s={s}
                    shop={shops.find((x) => x.signupId === s.id)}
                    onSaved={(next) => {
                      keep(next.id);
                      setSignups((ss) => (ss ?? []).map((x) => (x.id === next.id ? next : x)));
                    }}
                    onRemoved={(id) => setSignups((ss) => (ss ?? []).filter((x) => x.id !== id))}
                    onReload={() => {
                      keep(s.id);
                      void load();
                    }}
                  />
                ))}
              </ul>
            )}
          </section>
        ) : tab === "appels" ? (
          <CallsTab calls={calls} setCalls={setCalls} />
        ) : tab === "demandes" ? (
          <RequestsTab
            requests={requests}
            setRequests={setRequests}
            signups={all}
            onReload={() => void load()}
            onOpenSignup={(shopName) => {
              filterBy("tous");
              setQuery(shopName);
              choose("inscriptions");
            }}
          />
        ) : (
          <SiteMesure />
        )}
      </main>
    </div>
  );
}
