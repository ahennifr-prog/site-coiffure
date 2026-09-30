"use client";

import { useEffect, useState } from "react";
import { BarChart3, LogOut, QrCode, Receipt, SlidersHorizontal } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { Caisse } from "./Caisse";
import { QrTab } from "./QrTab";
import { Reglages } from "./Reglages";
import { Suivi } from "./Suivi";

const TABS = [
  { id: "caisse", label: "Caisse", Icon: Receipt },
  { id: "suivi", label: "Suivi", Icon: BarChart3 },
  { id: "roue", label: "Roue", Icon: SlidersHorizontal },
  { id: "qr", label: "QR code", Icon: QrCode },
] as const;
type Tab = (typeof TABS)[number]["id"];

export function Admin() {
  const [tab, setTab] = useState<Tab>("caisse");

  useEffect(() => {
    const h = window.location.hash.slice(1) as Tab;
    if (TABS.some((t) => t.id === h)) setTab(h);
  }, []);

  function go(t: Tab) {
    setTab(t);
    history.replaceState(null, "", `#${t}`);
    window.scrollTo({ top: 0 });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="min-h-svh pb-24 lg:pb-10">
      <header className="sticky top-0 z-20 border-b border-trait bg-noir/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
          <LogoMark className="h-10" />
          <span className="hidden font-mono text-[11px] tracking-[0.16em] text-gris uppercase sm:inline">Gestion</span>
          <nav aria-label="Sections de la gestion" className="ml-auto hidden gap-1 lg:flex">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ${tab === id ? "bg-blanc text-noir" : "text-argent hover:text-blanc"}`}
              >
                <Icon aria-hidden size={16} /> {label}
              </button>
            ))}
          </nav>
          <button type="button" onClick={logout} aria-label="Se déconnecter" className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-gris hover:text-blanc lg:ml-2">
            <LogOut aria-hidden size={18} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        <h1 className="sr-only">Gestion du jeu ALIA coiffure : {TABS.find((t) => t.id === tab)?.label}</h1>
        {tab === "caisse" ? <Caisse /> : null}
        {tab === "suivi" ? <Suivi /> : null}
        {tab === "roue" ? <Reglages /> : null}
        {tab === "qr" ? <QrTab /> : null}
      </main>

      {/* Onglets en bas sur téléphone, à portée de pouce */}
      <nav aria-label="Sections de la gestion" className={`fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-trait bg-noir/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden`}>
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => go(id)}
            aria-current={tab === id ? "page" : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${tab === id ? "text-rose" : "text-gris"}`}
          >
            <Icon aria-hidden size={20} /> {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
