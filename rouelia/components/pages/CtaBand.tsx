import { CalendarClock, MessageCircle } from "lucide-react";
import { brand, cta } from "@/content";
import { fr } from "@/lib/format";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Awning } from "@/components/brand/Awning";
import { Container } from "@/components/ui/Section";

/** Bloc d'appel final des pages de contenu : créer sa roue, réserver un appel ou écrire sur WhatsApp. */
export function CtaBand({ title, text }: { title: string; text?: string }) {
  return (
    <section aria-labelledby="cta-final" className="relative mt-16 overflow-hidden bg-tomette text-white sm:mt-24">
      <Awning className="h-8 w-full" stripe="#A33317" base="#FBF6EE" />
      <Container className="py-14 sm:py-20">
        <h2 id="cta-final" className="max-w-3xl font-display text-3xl leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
          {fr(title)}
        </h2>
        {text ? <p className="mt-4 max-w-2xl text-lg text-white sm:text-xl">{fr(text)}</p> : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <ButtonLink href={cta.href} size="lg" variant="light" className="shadow-lg">
            {cta.primary}
          </ButtonLink>
          <Link href={cta.callHref} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-7 font-semibold text-white ring-1 ring-white/70 ring-inset transition-colors hover:bg-white/10">
            <CalendarClock aria-hidden size={18} /> {cta.callShort}
          </Link>
          <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 px-2 font-semibold text-white underline-offset-4 hover:underline">
            <MessageCircle aria-hidden size={18} /> {cta.whatsapp}
          </a>
        </div>
        <p className="mt-5 text-sm font-medium text-white">14 jours gratuits, sans carte bancaire, sans engagement.</p>
      </Container>
    </section>
  );
}
