"use client";

import type { ReactNode } from "react";
import { trackGlow } from "./Tilt";

/** Tuile dont la lueur suit le pointeur (classe .glow). */
export function GlowTile({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div onPointerMove={trackGlow} className={`glow ${className}`}>
      {children}
    </div>
  );
}
