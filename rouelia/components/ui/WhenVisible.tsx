"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** N'affiche (et ne charge) son contenu qu'à l'approche de l'écran. */
export function WhenVisible({ children, fallback, margin = "900px" }: { children: ReactNode; fallback: ReactNode; margin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.location.hash) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin} 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return <div ref={ref}>{show ? children : fallback}</div>;
}
