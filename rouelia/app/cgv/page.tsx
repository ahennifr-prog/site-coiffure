import type { Metadata } from "next";
import { legal } from "@/content";
import { indexedPage } from "@/lib/seo";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: legal.pages.cgv.title,
  description: legal.pages.cgv.description,
  ...indexedPage("/cgv", { title: legal.pages.cgv.title, description: legal.pages.cgv.description }),
};

export default function Page() {
  return <LegalPage page="cgv" />;
}
