import Link from "next/link";
import type { Metadata } from "next";
import { SALON } from "@/lib/config";
import { getConfig } from "@/lib/game";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Règlement et données | ALIA coiffure" };

export default async function Reglement() {
  const c = await getConfig();
  const sections: [string, string[]][] = [
    [
      "Le jeu",
      [
        `Jeu gratuit et sans obligation d'achat, proposé par ${SALON.name}, ${SALON.address}.`,
        "Chaque case de la roue est un cadeau : toutes les participations sont gagnantes.",
        `Une participation par personne et par numéro de téléphone${c.replayDays > 0 ? `, tous les ${c.replayDays} jours` : ""}.`,
        "L'invitation à laisser un avis Google est facultative et n'a aucun lien avec le cadeau : la roue tourne dans tous les cas.",
      ],
    ],
    [
      "Le cadeau",
      [
        `Le cadeau s'utilise au salon${c.delayDays > 0 ? ` à partir de ${c.delayDays === 1 ? "la visite suivante (dès le lendemain)" : `${c.delayDays} jours après la partie`}` : ""}, pendant ${c.validityDays} jours, sur présentation du code.`,
        "Il n'est ni échangeable, ni remboursable, ni cumulable avec une autre offre, sauf accord du salon. Un code ne sert qu'une fois.",
      ],
    ],
    [
      "Vos données",
      [
        `${SALON.name} enregistre votre prénom et votre numéro de téléphone pour retrouver votre cadeau et limiter le jeu à une participation par personne. Base légale : votre consentement.`,
        "Ces données ne sont ni revendues, ni utilisées pour de la publicité. Elles sont supprimées automatiquement un an après la fin de validité du cadeau.",
        `Pour les consulter, les corriger ou les supprimer, contactez le salon au ${SALON.phone}. Vous pouvez aussi saisir la CNIL (cnil.fr).`,
      ],
    ],
  ];
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <Link href="/" className="inline-flex min-h-11 items-center text-sm text-argent underline underline-offset-4">
        Retour au jeu
      </Link>
      <div className="mt-4">
        <Logo />
      </div>
      <h1 className="mt-8 font-display text-4xl">Règlement et données</h1>
      {sections.map(([h, ps]) => (
        <section key={h} className="mt-8">
          <h2 className="text-lg font-semibold text-rose">{h}</h2>
          {ps.map((p) => (
            <p key={p} className="mt-2 text-argent">
              {p}
            </p>
          ))}
        </section>
      ))}
    </main>
  );
}
