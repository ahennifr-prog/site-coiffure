import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { articles } from "@/textes/blog";
import { formatDay } from "@/lib/dates";
import { fr } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { PageShell } from "@/components/pages/PageShell";
import { PageHero } from "@/components/pages/Blocks";
import { CtaBand } from "@/components/pages/CtaBand";
import { Container } from "@/components/ui/Section";

const blog = {
  path: "/blog",
  title: "Blog : fidéliser ses clients en commerce de quartier",
  description: "Conseils concrets pour commerçants : fidéliser avec un jeu en boutique, obtenir des avis Google conformes, répondre aux avis négatifs, placer son QR code.",
};

export const metadata: Metadata = pageMeta(blog);

export default function Page() {
  return (
    <PageShell crumbs={[{ name: "Blog", href: "/blog" }]}>
      <Container>
        <PageHero eyebrow="Blog" h1="Fidéliser ses clients, concrètement." lead="Des conseils courts et applicables dès demain, pour les commerces de quartier." />
        <ul className="grid gap-5 pb-4 md:grid-cols-2">
          {articles.map((a) => (
            <li key={a.slug}>
              <article className="group relative flex h-full flex-col rounded-xl bg-paper p-6 ring-1 ring-line transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-md">
                <p className="text-sm text-ink-soft">
                  <time dateTime={a.date}>{formatDay(a.date)}</time> · {a.readingMinutes} min de lecture
                </p>
                <h2 className="mt-2 font-display text-2xl leading-tight font-semibold">
                  <Link href={a.path} className="after:absolute after:inset-0">
                    {fr(a.h1)}
                  </Link>
                </h2>
                <p className="mt-3 text-ink-soft">{fr(a.excerpt)}</p>
                <span aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-tomette-deep">
                  Lire l&apos;article <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </article>
            </li>
          ))}
        </ul>
      </Container>
      <CtaBand title="Votre roue est à deux minutes d'ici." text="Réglez vos lots, testez, posez le QR code demain." />
    </PageShell>
  );
}
