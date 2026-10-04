"use client";

import { useEffect, useState } from "react";
import { BarChart3, CreditCard, ExternalLink, Gift, Info, LogOut, MessageSquareText, QrCode, Receipt, SlidersHorizontal, TriangleAlert } from "lucide-react";
import { brand, offerWheel, pricing, type OfferId, type PackId } from "@/content";
import { formatDay } from "@/lib/dates";
import type { GameState, ShopSettings } from "@/lib/shop-config";
import { Logo } from "@/components/brand/Logo";
import { Avis } from "./Avis";
import { Caisse } from "./Caisse";
import { QrTab } from "./QrTab";
import { Reglages } from "./Reglages";
import { Suivi } from "./Suivi";

const TABS = [
  { id: "caisse", label: "Caisse", Icon: Receipt },
  { id: "suivi", label: "Suivi", Icon: BarChart3 },
  { id: "roue", label: "Roue", Icon: SlidersHorizontal },
  { id: "avis", label: "Avis", Icon: MessageSquareText },
  { id: "qr", label: "QR code", Icon: QrCode },
] as const;
type Tab = (typeof TABS)[number]["id"];

export interface EspaceProps {
  slug: string;
  name: string;
  firstName: string;
  pack: PackId;
  plan: "trial" | "active" | "paused";
  trialEnd: string;
  daysLeft: number;
  state: GameState;
  codePrefix: string;
  offer: { id: OfferId; applied: boolean } | null;
}

function Banner({ p }: { p: EspaceProps }) {
  const contact = <a href={`mailto:${brand.email}`} className="font-semibold underline underline-offset-2">{brand.email}</a>;
  if (p.state === "essai_termine" || p.state === "suspendu") {
    return (
      <p role="status" className="flex flex-wrap gap-2 rounded-lg bg-danger/10 p-3 text-sm ring-1 ring-danger/30 sm:flex-nowrap">
        <TriangleAlert aria-hidden size={18} className="mt-0.5 shrink-0 text-danger" />
        <span>
          {p.state === "essai_termine" ? "Votre essai gratuit est terminé" : "Votre compte est en pause"} : la roue affiche un message de pause à vos clients.
          Les cadeaux déjà gagnés restent valables en caisse.
        </span>
        <a href="/espace/abonnement" className="ml-auto inline-flex min-h-10 shrink-0 items-center self-center rounded-full bg-tomette px-4 text-sm font-semibold text-white hover:bg-tomette-deep">
          Relancer ma roue
        </a>
      </p>
    );
  }
  if (p.plan === "trial") {
    const pack = pricing.packs.find((x) => x.id === p.pack);
    return (
      <p role="status" className="flex flex-wrap gap-2 rounded-lg bg-safran-soft p-3 text-sm ring-1 ring-safran sm:flex-nowrap">
        <Info aria-hidden size={18} className="mt-0.5 shrink-0" />
        <span>
          Essai gratuit du pack {pack?.name} : {p.daysLeft} {p.daysLeft > 1 ? "jours restants" : "jour restant"}, jusqu&apos;au {formatDay(p.trialEnd)}. Une question ? {contact}
        </span>
        <a href="/espace/abonnement" className="ml-auto inline-flex min-h-10 shrink-0 items-center self-center rounded-full bg-ink px-4 text-sm font-semibold text-white">
          Garder ma roue après l&apos;essai
        </a>
      </p>
    );
  }
  return null;
}

export function Espace(props: EspaceProps) {
  const [tab, setTab] = useState<Tab>("caisse");
  const [name, setName] = useState(props.name);

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
    await fetch("/api/espace/deconnexion", { method: "POST" });
    window.location.href = "/espace/connexion";
  }

  const offer = props.offer ? offerWheel.offers.find((o) => o.id === props.offer?.id) : null;

  return (
    <div className="min-h-svh bg-cream pb-24 lg:pb-10">
      <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5">
          <Logo className="text-[1.35rem]" />
          <span className="hidden truncate border-l border-line pl-3 text-sm font-semibold text-ink-soft sm:inline">{name}</span>
          <nav aria-label="Sections de l'espace" className="ml-auto hidden gap-1 lg:flex">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ${tab === id ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
              >
                <Icon aria-hidden size={16} /> {label}
              </button>
            ))}
          </nav>
          {props.plan === "active" ? (
            <a href="/espace/abonnement" aria-label="Mon abonnement" className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-cream lg:ml-2">
              <CreditCard aria-hidden size={18} />
            </a>
          ) : null}
          <a href={`/j/${props.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Voir ma roue" className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-cream lg:ml-2">
            <ExternalLink aria-hidden size={18} />
          </a>
          <button type="button" onClick={logout} aria-label="Se déconnecter" className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-cream">
            <LogOut aria-hidden size={18} />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-5 py-6">
        <h1 className="sr-only">
          Espace {name} : {TABS.find((t) => t.id === tab)?.label}
        </h1>
        <Banner p={props} />
        {offer && tab === "caisse" ? (
          <p className="flex gap-2 rounded-lg bg-paper p-3 text-sm ring-1 ring-line">
            <Gift aria-hidden size={18} className="mt-0.5 shrink-0 text-tomette" />
            <span>
              Votre cadeau Rouelia : <span className="font-semibold">{offer.label}</span>
              {props.offer?.applied ? "." : " (valable sur Croissance et Premium)."}
            </span>
          </p>
        ) : null}
        {tab === "caisse" ? <Caisse codePrefix={props.codePrefix} /> : null}
        {tab === "suivi" ? <Suivi /> : null}
        {tab === "roue" ? <Reglages slug={props.slug} pack={props.pack} onSaved={(s: ShopSettings) => setName(s.name)} /> : null}
        {tab === "avis" ? <Avis name={name} /> : null}
        {tab === "qr" ? <QrTab slug={props.slug} name={name} /> : null}
      </main>

      <nav aria-label="Sections de l'espace" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => go(id)}
            aria-current={tab === id ? "page" : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${tab === id ? "text-tomette-deep" : "text-ink-soft"}`}
          >
            <Icon aria-hidden size={20} /> {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
