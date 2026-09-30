import type { Metadata } from "next";
import { legal } from "@/content";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: legal.pages.cgv.title,
  description: legal.pages.cgv.description,
  alternates: { canonical: "/cgv" },
};

export default function Page() {
  return <LegalPage page="cgv" />;
}
