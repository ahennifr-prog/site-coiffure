import Link from "next/link";
import { Fragment } from "react";
import { fr } from "@/lib/format";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Texte avec liens internes écrits [texte](/chemin). */
export function RichText({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const i = m.index ?? 0;
    if (i > last) out.push(<Fragment key={`t${i}`}>{fr(text.slice(last, i))}</Fragment>);
    const href = m[2];
    const external = /^https?:/.test(href);
    out.push(
      external ? (
        <a key={`l${i}`} href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-tomette-deep underline underline-offset-4 hover:no-underline">
          {fr(m[1])}
        </a>
      ) : (
        <Link key={`l${i}`} href={href} className="font-semibold text-tomette-deep underline underline-offset-4 hover:no-underline">
          {fr(m[1])}
        </Link>
      ),
    );
    last = i + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key="end">{fr(text.slice(last))}</Fragment>);
  return <>{out}</>;
}

/** Le même texte sans la syntaxe des liens (balisage JSON-LD, meta). */
export const plainText = (text: string) => text.replace(LINK, "$1");
