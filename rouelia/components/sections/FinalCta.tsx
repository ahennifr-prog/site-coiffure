import Link from "next/link";
import { CalendarClock, Mail, MessageCircle } from "lucide-react";
import { brand, contact, cta, finalCta, offerWheel } from "@/content";
import { fr } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Awning } from "@/components/brand/Awning";
import { OfferWheelLazy } from "./OfferWheelLazy";

const card =
  "flex min-h-16 items-center gap-3 rounded-xl bg-white/95 px-4 py-3 font-semibold text-ink shadow-md transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white";

/** Dernière section : la roue d'offres, puis le contact (WhatsApp, e-mail, appel de 5 minutes). */
export function FinalCta() {
  return (
    <section id="contact" aria-labelledby="final-title" data-fx="rise" data-wa-hide className="relative overflow-hidden bg-tomette pb-14 text-white sm:pb-20">
      <Awning className="h-10 w-full" stripe="#A33317" base="#FBF6EE" />
      <Container className="grid items-center gap-12 pt-14 pb-6 sm:pt-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 id="final-title" className="font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-[3.4rem]">
            {fr(offerWheel.title)}
          </h2>
          <p className="mt-5 max-w-xl text-lg text-white sm:text-xl">{fr(offerWheel.text)}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={cta.href} size="lg" variant="light" className="text-lg shadow-lg">
              {cta.primary}
            </ButtonLink>
            <p className="text-sm font-medium text-white">{fr(finalCta.note)}</p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[380px]">
          <OfferWheelLazy />
        </div>
      </Container>
      <Container className="mt-8">
        <div className="rounded-xl bg-tomette-deep/60 p-5 ring-1 ring-white/20 sm:p-7">
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">{fr(contact.title)}</h3>
          <p className="mt-1 text-white">{fr(contact.text)}</p>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            <li>
              <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className={card}>
                <span aria-hidden className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F7A4D] text-white">
                  <MessageCircle size={20} />
                </span>
                {cta.whatsapp}
              </a>
            </li>
            <li>
              <a href={`mailto:${brand.email}`} className={card}>
                <span aria-hidden className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                  <Mail size={20} />
                </span>
                <span className="min-w-0 break-words">{brand.email}</span>
              </a>
            </li>
            <li>
              <Link href={cta.callHref} className={card}>
                <span aria-hidden className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tomette text-white">
                  <CalendarClock size={20} />
                </span>
                {cta.call}
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
