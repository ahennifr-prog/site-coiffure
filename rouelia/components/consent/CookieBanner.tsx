"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cookieBanner } from "@/content";
import { fr } from "@/lib/format";
import { Button } from "@/components/ui/Button";

const KEY = "rouelia-cookies";
const EVENT = "rouelia:cookies";
type Choice = "accepted" | "refused";

export function readConsent(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "accepted" || v === "refused" ? v : null;
  } catch {
    return null;
  }
}

/** Lien du pied de page pour rouvrir le choix. */
export function CookieSettingsLink({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new CustomEvent(EVENT, { detail: "open" }))}>
      {children}
    </button>
  );
}

/**
 * Bandeau de consentement. Aucun traceur n'est chargé avant « Accepter ».
 * Pour brancher une mesure d'audience, renseigner NEXT_PUBLIC_ANALYTICS_SRC.
 */
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  // Le jeu des commerces, l'espace commerçant et l'admin ne chargent aucune mesure d'audience.
  const pathname = usePathname() ?? "";
  const hidden = /^\/(j|espace|admin)(\/|$)/.test(pathname);

  useEffect(() => {
    if (readConsent() === null) setOpen(true);
    else if (readConsent() === "accepted" && !hidden) loadAnalytics();
    const onEvent = () => setOpen(true);
    window.addEventListener(EVENT, onEvent);
    return () => window.removeEventListener(EVENT, onEvent);
  }, []);

  function choose(c: Choice) {
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* stockage indisponible : le choix vaut pour cette visite */
    }
    setOpen(false);
    if (c === "accepted") loadAnalytics();
  }

  if (!open || hidden) return null;
  return (
    <div role="region" aria-label={cookieBanner.label} className="fixed inset-x-3 bottom-3 z-50 print:hidden mx-auto max-w-xl rounded-xl bg-night p-4 text-cream shadow-lg sm:inset-x-6 sm:bottom-6 sm:p-5">
      <p className="text-[13px] leading-snug sm:text-sm">
        {fr(cookieBanner.text)}{" "}
        <Link href="/confidentialite" className="font-semibold text-white underline underline-offset-4">
          {cookieBanner.more}
        </Link>
      </p>
      <div className="mt-3 flex gap-3">
        <Button variant="light" onClick={() => choose("refused")} className="flex-1">
          {cookieBanner.refuse}
        </Button>
        <Button variant="light" onClick={() => choose("accepted")} className="flex-1">
          {cookieBanner.accept}
        </Button>
      </div>
    </div>
  );
}

let analyticsLoaded = false;
function loadAnalytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  if (!src || analyticsLoaded) return;
  analyticsLoaded = true;
  const s = document.createElement("script");
  s.src = src;
  s.defer = true;
  document.head.appendChild(s);
}
