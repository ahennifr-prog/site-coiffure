import type { Metadata } from "next";
import { Check } from "lucide-react";
import { booking } from "@/textes/formulaires";
import { fr } from "@/lib/format";
import { indexedPage } from "@/lib/seo";
import { PageShell } from "@/components/pages/PageShell";
import { PageHero } from "@/components/pages/Blocks";
import { Container } from "@/components/ui/Section";
import { BookingForm } from "@/components/forms/BookingForm";

export const metadata: Metadata = {
  title: booking.title,
  description: booking.description,
  ...indexedPage(booking.path, { title: booking.title, description: booking.description }),
};

export default function Page() {
  return (
    <PageShell crumbs={[{ name: "Réserver un appel", href: booking.path }]}>
      <Container className="pb-20">
        <PageHero eyebrow={booking.eyebrow} h1={booking.h1} lead={booking.lead}>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink-soft">
            {booking.points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check aria-hidden size={16} strokeWidth={3} className="text-sauge" />
                {fr(p)}
              </li>
            ))}
          </ul>
        </PageHero>
        <BookingForm />
      </Container>
    </PageShell>
  );
}
