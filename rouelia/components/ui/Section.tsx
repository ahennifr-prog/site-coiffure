import { Fragment, type ReactNode } from "react";
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

/** Découpe un texte en mots masqués pour l'apparition mot à mot (.split). */
export function Words({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = fr(text).split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" style={{ ["--i" as string]: i + offset }}>
            <span>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** Titre de section : les mots montent un à un à l'arrivée (.split). */
export function SectionTitle({ id, children, className = "" }: { id?: string; children: string; className?: string }) {
  return (
    <h2 id={id} data-split className={`split font-display text-[1.9rem] leading-[1.08] font-semibold tracking-[-0.025em] text-balance sm:text-[2.6rem] lg:text-[2.9rem] ${className}`}>
      <Words text={children} />
    </h2>
  );
}
