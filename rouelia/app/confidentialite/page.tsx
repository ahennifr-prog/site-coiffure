import type { Metadata } from "next";
import { legal } from "@/content";
import { indexedPage } from "@/lib/seo";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: legal.pages.confidentialite.title,
  description: legal.pages.confidentialite.description,
  ...indexedPage("/confidentialite", { title: legal.pages.confidentialite.title, description: legal.pages.confidentialite.description }),
};

export default function Page() {
  return <LegalPage page="confidentialite" />;
}
