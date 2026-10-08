import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/textes/blog";
import { brand } from "@/content";
import { formatDay } from "@/lib/dates";
import { fr } from "@/lib/format";
import { articleJsonLd, faqJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { PageShell } from "@/components/pages/PageShell";
import { Blocks, FaqList, PageHero } from "@/components/pages/Blocks";
import { CtaBand } from "@/components/pages/CtaBand";
import { Container } from "@/components/ui/Section";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return {};
  return pageMeta(a, { type: "article", publishedTime: a.date, modifiedTime: a.updated, authors: [a.author] });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const others = articles.filter((x) => x.slug !== a.slug);
  return (
    <PageShell crumbs={[{ name: "Blog", href: "/blog" }, { name: a.h1, href: a.path }]} jsonLd={[articleJsonLd(a), ...(a.faq?.length ? [faqJsonLd(a.faq)] : [])]}>
      <Container>
        <article className="mx-auto max-w-3xl">
          <PageHero eyebrow="Blog" h1={a.h1} lead={a.lead} />
          <p className="-mt-4 mb-10 text-sm text-ink-soft">
            Par{" "}
            <Link href="/a-propos" rel="author" className="font-semibold underline underline-offset-4">
              {a.author}
            </Link>
            , fondateur de {brand.name} · Publié le <time dateTime={a.date}>{formatDay(a.date)}</time>
            {a.updated !== a.date ? (
              <>
                {" "}
                · Mis à jour le <time dateTime={a.updated}>{formatDay(a.updated)}</time>
              </>
            ) : null}{" "}
            · {a.readingMinutes} min de lecture
          </p>
          <Blocks sections={a.sections} />
          {a.faq?.length ? (
            <section aria-labelledby="questions" className="mt-16">
              <h2 id="questions" className="mb-4 font-display text-[1.65rem] leading-tight font-semibold sm:text-[2.1rem]">
                Questions fréquentes
              </h2>
              <FaqList items={a.faq} />
            </section>
          ) : null}
          <nav aria-label="Autres articles" className="mt-16 border-t border-line pt-8">
            <p className="text-xs font-bold tracking-[0.14em] text-tomette-deep uppercase">À lire aussi</p>
            <ul className="mt-3 space-y-1">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={o.path} className="inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline">
                    {fr(o.h1)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </Container>
      <CtaBand title="Votre roue est à deux minutes d'ici." text="Réglez vos lots, testez, posez le QR code demain." />
    </PageShell>
  );
}
