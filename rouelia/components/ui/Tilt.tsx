"use client";

import { useRef, type ReactNode } from "react";

/**
 * Relief 3D léger qui suit le pointeur (souris uniquement : rien au toucher, rien si
 * l'utilisateur limite les animations). Pose --rx et --ry, lus par la classe .tilt.
 */
export function Tilt({ children, className = "", max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.classList.add("is-tracking");
      el.style.setProperty("--ry", `${(x * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-y * max * 2).toFixed(2)}deg`);
    });
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.classList.remove("is-tracking");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt ${className}`}>
      {children}
    </div>
  );
}
