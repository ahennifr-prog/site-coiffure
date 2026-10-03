import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShopBySlug } from "@/lib/shops";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { absolute: "Règlement et données" }, robots: { index: false, follow: false } };

export default async function Reglement({ params }: { params: Promise<{ slug: string }> }) {
  const shop = await getShopBySlug((await params).slug);
  if (!shop) notFound();
  const c = shop.settings;
  const who = c.address ? `${c.name}, ${c.address}` : c.name;
  const contact = c.phone ? `contactez ${c.name} au ${c.phone}` : `adressez-vous à ${c.name}`;
  const sections: [string, string[]][] = [
    [
      "Le jeu",
      [
        `Jeu gratuit et sans obligation d'achat, proposé par ${who}.`,
        "Chaque case de la roue est un cadeau : toutes les participations sont gagnantes.",
        `Une participation par personne et par numéro de téléphone${c.replayDays > 0 ? `, tous les ${c.replayDays} jours` : ""}.`,
        "L'invitation à laisser un avis Google est facultative et n'a aucun lien avec le cadeau : la roue tourne dans tous les cas.",
      ],
    ],
    [
      "Le cadeau",
      [
        `Le cadeau s'utilise sur place${c.delayDays > 0 ? ` à partir de ${c.delayDays === 1 ? "la visite suivante (dès le lendemain)" : `${c.delayDays} jours après la partie`}` : ""}, pendant ${c.validityDays} jours, sur présentation du code.`,
        "Il n'est ni échangeable, ni remboursable, ni cumulable avec une autre offre, sauf accord du commerce. Un code ne sert qu'une fois.",
      ],
    ],
    [
      "Vos données",
      [
        `${c.name} enregistre votre prénom et votre numéro de téléphone pour retrouver votre cadeau et limiter le jeu à une participation par personne. Base légale : votre consentement. Si vous l'avez accepté, ${c.name} peut aussi vous envoyer ses offres par SMS ; vous pouvez vous désinscrire à tout moment.`,
        "Si vous indiquez votre e-mail (facultatif), il sert uniquement à vous envoyer votre code et un seul rappel avant la date limite.",
        "Ces données ne sont ni revendues, ni utilisées pour de la publicité par des tiers. Elles sont supprimées automatiquement un an après la fin de validité du cadeau.",
        `Le jeu est fourni par Rouelia, qui héberge ces données pour le compte de ${c.name} (hébergement Cloudflare, envoi des e-mails par Brevo).`,
        `Pour consulter, corriger ou supprimer vos données, ${contact}. Vous pouvez aussi saisir la CNIL (cnil.fr).`,
      ],
    ],
  ];
  return (
    <main className="mx-auto min-h-svh max-w-2xl bg-cream px-5 py-10">
      <Link href={`/j/${shop.slug}`} className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
        Retour au jeu
      </Link>
      <h1 className="mt-6 font-display text-4xl font-semibold">Règlement et données</h1>
      <p className="mt-2 text-ink-soft">{c.name}</p>
      {sections.map(([h, ps]) => (
        <section key={h} className="mt-8">
          <h2 className="text-lg font-bold">{h}</h2>
          {ps.map((p) => (
            <p key={p} className="mt-2 text-ink-soft">
              {p}
            </p>
          ))}
        </section>
      ))}
    </main>
  );
}
