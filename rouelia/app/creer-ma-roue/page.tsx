import type { Metadata } from "next";
import { createWheel } from "@/textes/formulaires";
import { indexedPage } from "@/lib/seo";
import { PageShell } from "@/components/pages/PageShell";
import { PageHero } from "@/components/pages/Blocks";
import { Container } from "@/components/ui/Section";
import { WheelPaths } from "@/components/forms/WheelPaths";

export const metadata: Metadata = {
  title: createWheel.title,
  description: createWheel.description,
  ...indexedPage(createWheel.path, { title: createWheel.title, description: createWheel.description }),
};

export default function Page() {
  return (
    <PageShell crumbs={[{ name: createWheel.eyebrow, href: createWheel.path }]}>
      <Container className="pb-20">
        <PageHero eyebrow={createWheel.eyebrow} h1={createWheel.h1} lead={createWheel.lead} />
        <WheelPaths />
      </Container>
    </PageShell>
  );
}
