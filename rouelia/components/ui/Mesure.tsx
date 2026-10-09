"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cta } from "@/content";
import type { SiteEvent } from "@/lib/mesure-events";

/** Envoie un événement de mesure, sans cookie ni identifiant (voir lib/mesure-events.ts). */
export function mesure(e: SiteEvent) {
  try {
    const body = new Blob([JSON.stringify({ e })], { type: "text/plain" });
    if (!navigator.sendBeacon?.("/api/mesure", body)) void fetch("/api/mesure", { method: "POST", body, keepalive: true });
  } catch {
    /* la mesure ne doit jamais gêner la navigation */
  }
}

/** Événement correspondant à un lien, ou null. */
export function eventForHref(href: string): SiteEvent | null {
  if (/^https:\/\/wa\.me\//.test(href)) return "whatsapp_clic";
  let url: URL;
  try {
    url = new URL(href, "https://rouelia.fr");
  } catch {
    return null;
  }
  if (url.hostname !== "rouelia.fr") return null;
  if (url.pathname === cta.href) return "creer_ma_roue_clic";
  if (url.pathname === "/tarifs" || (url.pathname === "/" && url.hash === "#tarifs")) return "tarifs_clic";
  return null;
}

const SCROLL_STEPS = [25, 50, 75, 100] as const;

/**
 * Mesure des conversions du site public : clics sur les liens clés (par délégation, un seul écouteur),
 * profondeur de lecture de l'accueil et arrivées depuis la roue d'un commerçant (?ref=roue).
 * Ni cookie, ni stockage local, ni identifiant : seulement des compteurs par jour côté serveur.
 */
export function Mesure() {
  const pathname = usePathname() ?? "/";
  const off = /^\/(j|espace|admin)(\/|$)/.test(pathname);

  useEffect(() => {
    if (off) return;
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as Element | null)?.closest?.("a[href]");
      const e = a ? eventForHref(a.getAttribute("href") ?? "") : null;
      if (e) mesure(e);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [off]);

  useEffect(() => {
    if (off) return;
    if (new URLSearchParams(window.location.search).get("ref") === "roue") mesure("arrivee_roue");
    if (pathname !== "/") return;
    const sent = new Set<number>();
    let raf = 0;
    const check = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = ((window.scrollY + 2) / max) * 100;
      for (const s of SCROLL_STEPS) {
        if (pct >= s && !sent.has(s)) {
          sent.add(s);
          mesure(`scroll_${s}`);
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, off]);

  return null;
}
