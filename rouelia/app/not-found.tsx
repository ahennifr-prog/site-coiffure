import { notFound } from "@/content";
import { fr } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main id="contenu" className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <Logo />
      <h1 className="mt-10 font-display text-4xl font-semibold sm:text-5xl">{fr(notFound.title)}</h1>
      <p className="mt-4 max-w-md text-lg text-ink-soft">{fr(notFound.text)}</p>
      <ButtonLink href="/" size="lg" className="mt-8">
        {notFound.back}
      </ButtonLink>
    </main>
  );
}
