import type { Metadata } from "next";
import { legal } from "@/content";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: legal.pages.mentions.title,
  description: legal.pages.mentions.description,
  alternates: { canonical: "/mentions-legales" },
};

export default function Page() {
  return <LegalPage page="mentions" />;
}
