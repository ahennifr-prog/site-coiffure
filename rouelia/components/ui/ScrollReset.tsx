"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Chaque nouvelle page s'ouvre tout en haut, d'un coup (sans défilement doux).
 * Exceptions : un lien vers une ancre (#section), géré par le navigateur avec le décalage du menu
 * (scroll-padding-top), et les boutons précédent / suivant, qui retrouvent la position d'avant.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const first = useRef(true);
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPop = () => (fromHistory.current = true);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = previous;
  }, [pathname]);

  return null;
}
