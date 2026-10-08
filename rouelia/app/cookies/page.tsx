import type { Metadata } from "next";
import { legal } from "@/content";
import { indexedPage } from "@/lib/seo";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: legal.pages.cookies.title,
  description: legal.pages.cookies.description,
  ...indexedPage("/cookies", { title: legal.pages.cookies.title, description: legal.pages.cookies.description }),
};

export default function Page() {
  return <LegalPage page="cookies" />;
}
