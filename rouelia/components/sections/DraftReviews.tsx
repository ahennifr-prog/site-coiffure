"use client";

import { useEffect, useState } from "react";
import type { MerchantReview } from "@/textes/avis-commercants";
import { ReviewsBand } from "./ReviewsBand";

/** Aperçu interne des avis encore en brouillon : seulement avec ?apercu=avis dans l'adresse, jamais indexé. */
export function DraftReviews({ reviews, compact }: { reviews: MerchantReview[]; compact?: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(new URLSearchParams(window.location.search).get("apercu") === "avis");
  }, []);
  return show ? <ReviewsBand reviews={reviews} compact={compact} draft /> : null;
}
