import type { Metadata } from "next";
import { Connexion } from "@/components/espace/Connexion";

export const metadata: Metadata = { title: "Connexion à votre espace", robots: { index: false, follow: false } };

export default function Page() {
  return <Connexion />;
}
