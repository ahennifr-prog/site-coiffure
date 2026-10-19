import Link from "next/link";
import { brand, contact, cta, finalCta } from "@/content";
import { fr } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Awning } from "@/components/brand/Awning";

const link = "inline-flex min-h-11 items-center font-semibold text-white underline underline-offset-4 hover:text-cream";

/**
 * Dernière section : une seule action principale (« Créer ma roue »), puis le contact en petits liens
 * pour qui a encore une question. Le cadeau de bienvenue est sur /creer-ma-roue, juste avant les parcours.
 */
export function FinalCta() {
  return (
    <section id="contact" aria-labelledby="final-title" data-fx="rise" data-wa-hide className="relative overflow-hidden bg-tomette pb-14 text-white sm:pb-20">
      <Awning className="h-10 w-full" stripe="#A33317" base="#FBF6EE" />
      <Container className="pt-14 text-center sm:pt-20">
        <h2 id="final-title" className="mx-auto max-w-3xl font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-[3.4rem]">
          {fr(finalCta.title)}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white sm:text-xl">{fr(finalCta.text)}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <ButtonLink href={cta.href} size="lg" variant="light" className="w-full text-lg shadow-lg sm:w-auto sm:px-12">
            {cta.primary}
          </ButtonLink>
          <p className="text-sm font-medium text-white">{fr(finalCta.note)}</p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl border-t border-white/25 pt-6">
          <p className="font-semibold">{fr(contact.title)}</p>
          <p className="mt-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-0 text-sm">
            <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className={link}>
              WhatsApp
            </a>
            <a href={`mailto:${brand.email}`} className={link}>
              {brand.email}
            </a>
            <Link href={cta.callHref} className={link}>
              {fr(contact.callLink)}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
