import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbJsonLd, ldString } from "@/lib/jsonld";
import { fr } from "@/lib/format";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Section";

export type Crumb = { name: string; href: string };

/** Cadre commun des pages de contenu : menu, fil d'Ariane (visible et JSON-LD), contenu, pied de page. */
export function PageShell({ crumbs, jsonLd = [], children }: { crumbs: Crumb[]; jsonLd?: object[]; children: React.ReactNode }) {
  const trail = [{ name: "Accueil", href: "/" }, ...crumbs];
  const last = trail.length - 1;
  return (
    <>
      {[breadcrumbJsonLd(trail), ...jsonLd].map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(d) }} />
      ))}
      <Nav />
      <main id="contenu">
        <Container>
          <nav aria-label="Fil d'Ariane" className="pt-5 text-sm text-ink-soft">
            {/* Une seule ligne : la page en cours (souvent un long titre d'article, répété juste en dessous) est coupée. */}
            <ol className="flex items-center gap-1">
              {trail.map((c, i) => (
                <li key={c.href} className={`inline-flex items-center gap-1 ${i === last ? "min-w-0" : "shrink-0"}`}>
                  {i > 0 ? <ChevronRight aria-hidden size={14} /> : null}
                  {i < last ? (
                    <Link href={c.href} className="inline-flex min-h-8 items-center underline-offset-4 hover:underline">
                      {fr(c.name)}
                    </Link>
                  ) : (
                    <span aria-current="page" className="truncate font-medium text-ink">
                      {fr(c.name)}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </Container>
        {children}
      </main>
      <Footer />
    </>
  );
}
