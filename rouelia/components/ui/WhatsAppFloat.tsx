"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/config";
import { cta } from "@/content";

/**
 * Bouton WhatsApp flottant, en bas à droite (là où le pouce l'attend, à l'écart du bouton « Retour » des navigateurs).
 * Il se retire de lui-même pour ne jamais masquer une action :
 * - pendant la saisie dans un champ (le clavier du téléphone occupe le bas de l'écran) ;
 * - quand un formulaire, un bouton principal marqué data-wa-hide ou le pied de page passe dans la bande basse de l'écran ;
 * - sur le jeu des commerces, l'espace commerçant et l'admin.
 */
export function WhatsAppFloat() {
  const pathname = usePathname() ?? "/";
  const off = /^\/(j|espace|admin)(\/|$)/.test(pathname);
  const [typing, setTyping] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    if (off) return;
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && t.matches("input, textarea, select, [contenteditable='true']");
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = (e: FocusEvent) => isField(e.target) && setTyping(isField(e.relatedTarget));
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, [off]);

  useEffect(() => {
    if (off || typeof IntersectionObserver === "undefined") return;
    const seen = new Set<Element>();
    // Seule compte la bande basse de l'écran, où se trouve le bouton.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target);
          else seen.delete(e.target);
        }
        setCovered(seen.size > 0);
      },
      { rootMargin: "-82% 0px 0px 0px" },
    );
    // Les pages se construisent après la navigation : on observe ce qui est présent un instant plus tard.
    const timer = window.setTimeout(() => document.querySelectorAll("form, footer, [data-wa-hide]").forEach((el) => io.observe(el)), 300);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
      setCovered(false);
    };
  }, [pathname, off]);

  if (off) return null;
  const hidden = typing || covered;
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={cta.whatsapp}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={`fixed right-4 bottom-4 z-30 inline-flex h-13 items-center gap-2 rounded-full bg-paper pr-2 pl-2 text-sm font-semibold text-ink shadow-lg ring-1 ring-line transition-[opacity,transform] duration-300 hover:ring-ink/40 sm:right-6 sm:bottom-6 sm:pr-5 print:hidden ${
        hidden ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"
      }`}
    >
      <span aria-hidden className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1F7A4D] text-white">
        <MessageCircle size={19} />
      </span>
      <span aria-hidden className="hidden sm:inline">
        WhatsApp
      </span>
    </a>
  );
}
