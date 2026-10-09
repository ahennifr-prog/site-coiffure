"use client";

import { useEffect, useState } from "react";
import { ArrowDown, X } from "lucide-react";
import { fromWheel } from "@/content";
import { fr } from "@/lib/format";
import { Container } from "@/components/ui/Section";

/**
 * Accueil des visiteurs arrivés depuis la roue d'un commerçant (lien « Propulsé par Rouelia » : /?ref=roue).
 * Lu dans l'adresse seulement, sans cookie ni stockage. Sans le paramètre, rien ne s'affiche.
 */
export function FromWheelWelcome() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(new URLSearchParams(window.location.search).get("ref") === "roue");
  }, []);
  if (!show) return null;
  return (
    <Container className="pt-3">
      <div role="note" className="pop-in flex items-start gap-3 rounded-xl bg-night px-4 py-3 text-cream shadow-md sm:items-center sm:px-5">
        <p className="min-w-0 flex-1 text-sm sm:text-base">
          <span className="font-semibold text-white">{fr(fromWheel.title)}</span> {fr(fromWheel.text)}{" "}
          <a href={fromWheel.href} className="mt-2 inline-flex min-h-10 items-center gap-1 rounded-full bg-safran px-4 text-sm font-semibold whitespace-nowrap text-ink hover:bg-white sm:mt-0 sm:ml-2">
            {fromWheel.button}
            <ArrowDown aria-hidden size={14} />
          </a>
        </p>
        <button type="button" onClick={() => setShow(false)} aria-label={fromWheel.close} className="-m-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10">
          <X aria-hidden size={18} />
        </button>
      </div>
    </Container>
  );
}
