"use client";

import { useEffect } from "react";

type Fx = { el: HTMLElement; kind: string; top: number; height: number; depth: number; target: HTMLElement; applied: number; last: string };

/**
 * Effets au défilement, sans bibliothèque et sans recalcul de style de la page entière :
 * chaque effet écrit directement la transformation de son seul élément, et les positions
 * sont mesurées une fois (puis à chaque changement de mise en page), pas à chaque image.
 * - data-fx="parallax" (+ data-depth en px) : l'élément défile plus lentement ou plus vite ;
 * - data-fx="grow" : son premier enfant s'agrandit en arrivant à l'écran ;
 * - data-fx="rise" : l'élément remonte doucement en arrivant ;
 * - data-fx="rail" : son premier enfant (le trait) se remplit pendant la traversée ;
 * - data-fx="progress" : fil d'avancement dans la page ;
 * - [data-split] : titres mot à mot, déclenchés une fois à l'arrivée.
 * La classe .fx-on est posée par le script de démarrage, sauf si l'utilisateur limite les animations.
 */
export function ScrollFx() {
  useEffect(() => {
    const root = document.documentElement;
    (window as unknown as { __fx?: boolean }).__fx = true;
    if (!root.classList.contains("fx-on")) return;

    let items: Fx[] = [];
    let vh = window.innerHeight;
    let docMax = 1;

    function collect() {
      items = [...document.querySelectorAll<HTMLElement>("[data-fx]")].map((el) => {
        const kind = el.dataset.fx ?? "";
        const target = kind === "grow" || kind === "rail" ? ((el.firstElementChild as HTMLElement) ?? el) : el;
        return { el, kind, top: 0, height: 0, depth: Number(el.dataset.depth ?? -100), target, applied: 0, last: "" };
      });
      measure();
    }

    // Positions dans la page, sans tenir compte du décalage déjà appliqué par l'effet.
    function measure() {
      vh = window.innerHeight;
      docMax = Math.max(1, document.documentElement.scrollHeight - vh);
      const y = window.scrollY;
      for (const it of items) {
        const r = it.el.getBoundingClientRect();
        const shifted = it.kind === "parallax" || it.kind === "rise" ? it.applied : 0;
        it.top = r.top + y - shifted;
        it.height = r.height;
      }
      schedule();
    }

    let raf = 0;
    function frame() {
      raf = 0;
      const y = window.scrollY;
      for (const it of items) {
        let t: string;
        if (it.kind === "progress") {
          t = `scaleX(${(y / docMax).toFixed(4)})`;
        } else {
          // Calculé même hors de l'écran : un défilement rapide laisse chaque effet dans son état final.
          const rel = it.top - y;
          const p = Math.min(1, Math.max(0, (vh - rel) / (vh + it.height)));
          const enter = Math.min(1, Math.max(0, (vh - rel) / (vh * 0.75)));
          if (it.kind === "parallax") {
            it.applied = (p - 0.5) * it.depth;
            t = `translate3d(0, ${it.applied.toFixed(1)}px, 0)`;
          } else if (it.kind === "rise") {
            it.applied = (1 - enter) * 60;
            t = `translate3d(0, ${it.applied.toFixed(1)}px, 0)`;
          } else if (it.kind === "grow") {
            t = `scale(${(0.88 + 0.12 * enter).toFixed(3)})`;
          } else if (it.kind === "rail") {
            t = `scaleY(${Math.min(1, Math.max(0, (p - 0.18) * 1.9)).toFixed(3)})`;
          } else continue;
        }
        // On n'écrit que si la valeur change : rien à recalculer pour les éléments immobiles.
        if (t !== it.last) {
          it.target.style.transform = t;
          it.last = t;
        }
      }
    }
    function schedule() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

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
    const watchSplit = () => document.querySelectorAll<HTMLElement>("[data-split]:not(.is-in)").forEach((el) => split.observe(el));

    collect();
    watchSplit();

    // La mise en page change (démo chargée, polices, image) : on remesure, regroupé.
    let pending = 0;
    const later = () => {
      window.clearTimeout(pending);
      pending = window.setTimeout(() => {
        collect();
        watchSplit();
      }, 200);
    };
    const ro = new ResizeObserver(later);
    ro.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", later);
    void document.fonts?.ready.then(later);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(pending);
      split.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", later);
    };
  }, []);
  return null;
}

/** Script de démarrage, exécuté avant l'affichage : évite le clignotement des titres animés. */
export const fxBoot = `(function(){var d=document.documentElement;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('fx-on');setTimeout(function(){if(!window.__fx)d.classList.remove('fx-on')},4000)})();`;
