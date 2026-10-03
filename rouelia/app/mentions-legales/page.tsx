import type { Metadata } from "next";
import { legal } from "@/content";
import { indexedPage } from "@/lib/seo";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: legal.pages.mentions.title,
  description: legal.pages.mentions.description,
  ...indexedPage("/mentions-legales", { title: legal.pages.mentions.title, description: legal.pages.mentions.description }),
};

export default function Page() {
  return <LegalPage page="mentions" />;
}
