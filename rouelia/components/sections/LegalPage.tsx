import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { legal } from "@/content";
import { fr } from "@/lib/format";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Section";
import { Footer } from "./Footer";

export function LegalPage({ page }: { page: keyof typeof legal.pages }) {
  const p = legal.pages[page];
  return (
    <>
      <header className="border-b border-line">
        <Container className="flex h-(--nav-h) items-center justify-between">
          <Link href="/" className="rounded-lg py-2">
            <Logo />
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-tomette-deep">
            <ArrowLeft aria-hidden size={16} /> {legal.back}
          </Link>
        </Container>
      </header>
      <main id="contenu" className="py-14 sm:py-20">
        <Container className="max-w-3xl">
          <p role="note" className="flex gap-2 rounded-lg bg-safran-soft p-4 text-sm font-semibold ring-1 ring-safran">
            <TriangleAlert aria-hidden size={18} className="mt-0.5 shrink-0" />
            {fr(legal.draftNotice)}
          </p>
          <h1 className="mt-8 font-display text-4xl font-semibold sm:text-5xl">{fr(p.title)}</h1>
          <p className="mt-2 text-sm text-ink-soft">{fr(legal.updated)}</p>
          {p.sections.map((s) => (
            <section key={s.h} className="mt-10">
              <h2 className="text-xl font-bold">{fr(s.h)}</h2>
              {s.p.map((x) => (
                <p key={x} className="mt-3 text-ink-soft">
                  {fr(x)}
                </p>
              ))}
            </section>
          ))}
        </Container>
      </main>
      <Footer />
    </>
  );
}
