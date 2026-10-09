import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { brand, seo } from "@/content";
import { ldString, organizationJsonLd } from "@/lib/jsonld";
import { baseOpenGraph } from "@/lib/seo";
import { AppStateProvider } from "@/components/AppState";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { SignupMount } from "@/components/signup/SignupMount";
import { ScrollReset } from "@/components/ui/ScrollReset";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: { default: seo.title, template: `%s | ${brand.name}` },
  description: seo.description,
  openGraph: baseOpenGraph,
  twitter: { card: "summary_large_image", title: seo.ogTitle, description: seo.ogDescription },
};

export const viewport: Viewport = {
  themeColor: "#FBF6EE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" className={`${fraunces.variable} ${figtree.variable}`} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(organizationJsonLd()) }} />
        <ScrollReset />
        <AppStateProvider>
          {children}
          <SignupMount />
        </AppStateProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
