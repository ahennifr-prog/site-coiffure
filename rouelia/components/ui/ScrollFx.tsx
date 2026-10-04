"use client";

import { useEffect } from "react";

/**
 * Moteur d'effets au défilement, sans bibliothèque. Une seule boucle par image :
 * - chaque élément [data-fx] visible reçoit --p (traversée de l'écran, 0 à 1) et --enter (arrivée, 0 à 1) ;
 * - la racine reçoit --scroll (px) et --doc (avancement dans la page, 0 à 1) ;
 * - les titres [data-split] reçoivent .is-in quand ils entrent à l'écran.
 * La classe .fx-on est posée par le script de démarrage de la page d'accueil, sauf si
 * l'utilisateur limite les animations : dans ce cas, rien ne bouge.
 */
export function ScrollFx() {
  useEffect(() => {
    const root = document.documentElement;
    (window as unknown as { __fx?: boolean }).__fx = true;
    if (!root.classList.contains("fx-on")) return;

    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) visible.add(el);
          else visible.delete(el);
        }
        schedule();
      },
      { rootMargin: "25% 0px" },
    );
    const split = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            split.unobserve(e.target);
          }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const watch = () => {
      document.querySelectorAll<HTMLElement>("[data-fx]").forEach((el) => io.observe(el));
      document.querySelectorAll<HTMLElement>("[data-split]:not(.is-in)").forEach((el) => split.observe(el));
    };
    watch();

    let raf = 0;
    function frame() {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      root.style.setProperty("--scroll", y.toFixed(1));
      root.style.setProperty("--doc", (y / max).toFixed(4));
      for (const el of visible) {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        const enter = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)));
        el.style.setProperty("--p", p.toFixed(4));
        el.style.setProperty("--enter", enter.toFixed(4));
      }
    }
    function schedule() {
      if (!raf) raf = requestAnimationFrame(frame);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Les blocs chargés plus tard (démo, simulateur) peuvent contenir des éléments animés.
    let pending = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(pending);
      pending = window.setTimeout(watch, 300);
    });
    mo.observe(document.getElementById("contenu") ?? document.body, { childList: true, subtree: true });
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      split.disconnect();
      mo.disconnect();
      window.clearTimeout(pending);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return null;
}

/** Script de démarrage, exécuté avant l'affichage : évite le clignotement des titres animés. */
export const fxBoot = `(function(){var d=document.documentElement;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('fx-on');setTimeout(function(){if(!window.__fx)d.classList.remove('fx-on')},4000)})();`;
