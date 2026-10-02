import type { Metadata } from "next";
import { Invitation } from "@/components/espace/Invitation";

export const metadata: Metadata = { title: "Choisir votre mot de passe", robots: { index: false, follow: false } };

export default function Page() {
  return <Invitation />;
}
