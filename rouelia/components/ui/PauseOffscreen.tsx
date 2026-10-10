"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Met en pause les animations continues (bandes qui défilent) tant qu'elles sont hors de l'écran :
 * moins de travail pour le téléphone pendant le chargement et la lecture, rien ne change à l'œil.
 * Les éléments concernés portent l'attribut data-anim ; la pause se fait en CSS (globals.css).
 */
export function PauseOffscreen() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.target as HTMLElement).toggleAttribute("data-off", !e.isIntersecting);
      },
      { rootMargin: "100px 0px" },
    );
    document.querySelectorAll("[data-anim]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
