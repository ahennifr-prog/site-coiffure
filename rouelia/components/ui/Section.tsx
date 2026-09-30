import type { ReactNode } from "react";
import { fr } from "@/lib/format";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Section({
  id,
  children,
  className = "",
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`py-(--section-y) ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, tone = "tomette" }: { children: string; tone?: "tomette" | "light" }) {
  return (
    <p
      className={`mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] uppercase ${
        tone === "light" ? "text-safran" : "text-tomette-deep"
      }`}
    >
      <span aria-hidden className={`h-2 w-2 rounded-full ${tone === "light" ? "bg-safran" : "bg-tomette"}`} />
      {fr(children)}
    </p>
  );
}

export function SectionTitle({ id, children, className = "" }: { id?: string; children: string; className?: string }) {
  return (
    <h2 id={id} className={`font-display text-[2rem] leading-[1.1] font-semibold text-balance sm:text-5xl ${className}`}>
      {fr(children)}
    </h2>
  );
}
