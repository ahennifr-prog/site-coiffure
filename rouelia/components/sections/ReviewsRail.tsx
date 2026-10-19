"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { merchantReviewsSection, type MerchantReview } from "@/textes/avis-commercants";
import { ReviewCard } from "./ReviewCard";

/**
 * Avis en cartes fixes, que l'on fait glisser au doigt (ou avec les flèches sur ordinateur).
 * Rien ne bouge tout seul : on lit à son rythme. La liste est la vraie liste, lue par les lecteurs d'écran.
 */
export function ReviewsRail({ reviews }: { reviews: MerchantReview[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function move(dir: 1 | -1) {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 20), behavior: "smooth" });
  }

  const arrow = "inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink shadow-md ring-1 ring-line transition-opacity hover:bg-cream disabled:opacity-30";
  return (
    <div className="relative mt-8 sm:mt-10">
      <ul
        ref={rail}
        aria-label={merchantReviewsSection.title}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 py-4 sm:scroll-px-8 sm:px-8 xl:scroll-px-[calc((100vw-72rem)/2+2rem)] xl:px-[calc((100vw-72rem)/2+2rem)]"
      >
        {reviews.map((r) => (
          <li key={r.shop} className="flex snap-start">
            <ReviewCard review={r} />
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-2 flex max-w-6xl justify-center gap-3 px-5 sm:justify-end sm:px-8">
        <button type="button" onClick={() => move(-1)} disabled={edge.start} aria-label={merchantReviewsSection.prev} className={arrow}>
          <ChevronLeft aria-hidden size={20} />
        </button>
        <button type="button" onClick={() => move(1)} disabled={edge.end} aria-label={merchantReviewsSection.next} className={arrow}>
          <ChevronRight aria-hidden size={20} />
        </button>
      </div>
    </div>
  );
}
