import { Check } from "lucide-react";
import { espacePreview as e } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";

/** Aperçu de l'espace commerçant : rassure sur la simplicité (gagnants, caisse, cadeaux retirés, QR code). */
export function EspacePreview() {
  return (
    <Section id="espace" labelledBy="espace-title" className="pt-0">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{e.eyebrow}</Eyebrow>
          <SectionTitle id="espace-title">{e.title}</SectionTitle>
        </div>
        <ul className="mx-auto mt-6 grid max-w-3xl gap-x-8 gap-y-2.5 sm:mt-8 sm:grid-cols-2">
          {e.points.map((t) => (
            <li key={t} className="flex gap-2.5 text-ink">
              <Check aria-hidden size={20} strokeWidth={3} className="mt-0.5 shrink-0 text-sauge" />
              <span className="font-medium">{fr(t)}</span>
            </li>
          ))}
        </ul>
        {/* Deux images : sur téléphone, la caisse en grand (lisible) ; sur ordinateur, le suivi et la caisse côte à côte. */}
        <picture>
          <source media="(max-width: 639px)" srcSet="/espace/apercu-espace-mobile-800.webp" width={800} height={900} />
          <source srcSet="/espace/apercu-espace-800.webp 800w, /espace/apercu-espace-1200.webp 1200w, /espace/apercu-espace-1600.webp 1600w" sizes="(min-width: 1200px) 1100px, 100vw" width={1600} height={880} />
          {/* eslint-disable-next-line @next/next/no-img-element -- images déjà déclinées en WebP aux bonnes tailles */}
          <img src="/espace/apercu-espace-1200.webp" width={1600} height={880} alt={e.alt} loading="lazy" decoding="async" className="mx-auto mt-8 h-auto w-full max-w-[1100px] sm:mt-10" />
        </picture>
        <p className="mt-3 text-center text-sm text-ink-soft">{fr(e.note)}</p>
      </Container>
    </Section>
  );
}
