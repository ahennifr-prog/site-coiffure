import type { Metadata } from "next";
import { Check, HeartHandshake, LineChart, Sparkles } from "lucide-react";
import { aboutPage as p } from "@/textes/a-propos";
import { brand } from "@/content";
import { fr } from "@/lib/format";
import { faqJsonLd, personJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { PageShell } from "@/components/pages/PageShell";
import { FaqList, PageHero } from "@/components/pages/Blocks";
import { CtaBand } from "@/components/pages/CtaBand";
import { Awning } from "@/components/brand/Awning";
import { MerchantReviews } from "@/components/sections/MerchantReviews";
import { Container } from "@/components/ui/Section";

/**
 * Photo d'illustration (elle ne représente pas le fondateur). Fichiers générés par scripts/photo-a-propos.sh
 * (WebP 480, 720 et 1080 px, portrait 4:5). Tant que `ready` vaut false, un visuel aux couleurs de la marque la remplace.
 */
const aboutPhoto = {
  ready: true,
  base: "/a-propos/poignee-de-main",
  /** Texte neutre : la scène est une illustration, elle n'est présentée ni comme réelle ni comme le fondateur. */
  alt: "Deux hommes se serrent la main devant un café",
};

export const metadata: Metadata = pageMeta(p);

const icons = [Sparkles, HeartHandshake, LineChart];
const h2 = "font-display text-[1.75rem] leading-tight font-semibold tracking-[-0.02em] text-balance sm:text-[2.4rem]";

function Photo() {
  if (aboutPhoto.ready) {
    const src = (w: number) => `${aboutPhoto.base}-${w}.webp`;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src(720)}
        srcSet={`${src(480)} 480w, ${src(720)} 720w, ${src(1080)} 1080w`}
        sizes="(min-width: 1024px) 440px, (min-width: 640px) 440px, calc(100vw - 40px)"
        width={720}
        height={900}
        alt={aboutPhoto.alt}
        fetchPriority="high"
        className="aspect-[4/5] h-auto w-full rounded-[28px] object-cover shadow-lg"
      />
    );
  }
  return (
    <div role="img" aria-label={aboutPhoto.alt} className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[28px] bg-tomette shadow-lg">
      <Awning className="absolute inset-x-0 top-0 h-10 w-full" stripe="#A33317" base="#FBF6EE" />
      <HeartHandshake aria-hidden size={120} strokeWidth={1.25} className="text-cream" />
    </div>
  );
}

export default function Page() {
  return (
    <PageShell crumbs={[{ name: "À propos", href: p.path }]} jsonLd={[personJsonLd(), faqJsonLd(p.faq)]}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <PageHero eyebrow={p.eyebrow} h1={p.h1} lead={p.lead} />
          <div className="relative mx-auto w-full max-w-[440px] pb-6 lg:pb-0">
            <div aria-hidden className="absolute -inset-3 -z-10 translate-x-4 translate-y-4 rounded-[32px] bg-tomette-soft" />
            <Photo />
          </div>
        </div>

        <section id="fondateur" aria-labelledby="histoire" className="mx-auto mt-16 max-w-3xl sm:mt-24">
          <h2 id="histoire" className={h2}>
            {fr(p.story.h2)}
          </h2>
          <div className="mt-6 space-y-5 text-lg text-ink-soft">
            {p.story.p.map((t, i) => (
              <p key={i} className={i === 0 ? "font-display text-xl text-ink first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:leading-[0.85] first-letter:font-semibold first-letter:text-tomette sm:text-2xl" : ""}>
                {fr(t)}
              </p>
            ))}
          </div>
          <p className="mt-6 font-display text-lg font-semibold italic">{brand.founder}, fondateur de {brand.name}</p>
        </section>

        <section aria-labelledby="engagements" className="mt-20 sm:mt-28">
          <h2 id="engagements" className={`${h2} max-w-2xl`}>
            {fr(p.commitments.h2)}
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {p.commitments.items.map((c, i) => {
              const Icon = icons[i % icons.length];
              return (
                <li key={c.title} className="rounded-xl bg-paper p-6 ring-1 ring-line">
                  <span aria-hidden className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-tomette text-white">
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{fr(c.title)}</h3>
                  <p className="mt-2 text-ink-soft">{fr(c.text)}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="etapes" className="mt-20 rounded-xl bg-night p-6 text-cream sm:mt-28 sm:p-12">
          <h2 id="etapes" className={h2}>
            {fr(p.how.h2)}
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {p.how.steps.map((s, i) => (
              <li key={s.title}>
                <span aria-hidden className="font-display text-6xl leading-none font-semibold text-safran">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-bold">{fr(s.title)}</h3>
                <p className="mt-2 text-cream/85">{fr(s.text)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="preuves" className="mt-20 sm:mt-28">
          <h2 id="preuves" className={`${h2} max-w-2xl`}>
            {fr(p.proofs.h2)}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{fr(p.proofs.intro)}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.proofs.items.map((x) => (
              <li key={x.title} className="flex gap-3 rounded-xl bg-paper p-5 ring-1 ring-line">
                <Check aria-hidden size={20} strokeWidth={3} className="mt-0.5 shrink-0 text-sauge" />
                <span>
                  <span className="block font-bold">{fr(x.title)}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{fr(x.text)}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <MerchantReviews compact />

      <Container>
        <section aria-labelledby="questions" className="mx-auto mt-12 max-w-3xl sm:mt-16">
          <h2 id="questions" className={`${h2} mb-6`}>
            Questions fréquentes
          </h2>
          <FaqList items={p.faq} />
        </section>
      </Container>
      <CtaBand title={p.cta.title} text={p.cta.text} />
    </PageShell>
  );
}
