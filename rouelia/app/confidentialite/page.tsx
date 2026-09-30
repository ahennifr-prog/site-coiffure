import type { Metadata } from "next";
import { legal } from "@/content";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: legal.pages.confidentialite.title,
  description: legal.pages.confidentialite.description,
  alternates: { canonical: "/confidentialite" },
};

export default function Page() {
  return <LegalPage page="confidentialite" />;
}
