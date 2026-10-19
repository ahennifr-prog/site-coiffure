"use client";

import { useEffect, useRef } from "react";
import { Star, X } from "lucide-react";
import { reviewPrompt } from "@/content";
import { fr } from "@/lib/format";

/**
 * Invitation à laisser un avis Google, affichée au premier toucher de la roue (choix d'Aymen, 19 octobre 2026).
 * Toujours facultative et identique pour tous : la croix ferme la fenêtre, le client retouche la roue pour jouer.
 * Le tirage, déjà fait par le serveur, ne change pas selon le choix du client. Aucun tri selon la note.
 * `href` absent (démo) : le bouton affiche seulement une explication.
 */
export function ReviewGate({
  open,
  href,
  onReview,
  onClose,
  demoNotice = false,
  className = "fixed",
}: {
  open: boolean;
  href?: string | null;
  onReview: () => void;
  onClose: () => void;
  demoNotice?: boolean;
  className?: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // Gardé dans une ref : les parents passent une fonction nouvelle à chaque rendu, le focus ne doit pas sauter.
  const closeFn = useRef(onClose);
  useEffect(() => {
    closeFn.current = onClose;
  });
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeFn.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  const button = "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 font-semibold text-white";
  return (
    <div className={`${className} inset-0 z-40 flex items-end justify-center bg-night/45 p-4 sm:items-center`} role="dialog" aria-modal="true" aria-labelledby="avis-titre">
      <div className="pop-in relative w-full max-w-sm rounded-2xl bg-paper p-5 pt-6 text-center text-ink shadow-lg">
        <button ref={closeRef} type="button" onClick={onClose} aria-label={reviewPrompt.close} className="absolute top-2 right-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-cream">
          <X aria-hidden size={20} />
        </button>
        <span aria-hidden className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-safran-soft text-safran">
          <Star size={22} fill="currentColor" strokeWidth={0} />
        </span>
        <p id="avis-titre" className="mt-3 font-display text-xl font-semibold">
          {fr(reviewPrompt.title)}
        </p>
        <p className="mt-1.5 text-sm text-ink-soft">{fr(reviewPrompt.text)}</p>
        <div className="mt-4">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={onReview} className={button}>
              {reviewPrompt.button}
            </a>
          ) : (
            <button type="button" onClick={onReview} className={button}>
              {reviewPrompt.button}
            </button>
          )}
          {demoNotice ? (
            <p role="status" className="mt-2 text-xs font-semibold text-ink-soft">
              {fr(reviewPrompt.demoNotice)}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
