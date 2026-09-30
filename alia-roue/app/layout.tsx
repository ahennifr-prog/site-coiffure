import type { Metadata, Viewport } from "next";
import { Alex_Brush, DM_Mono, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-playfair", display: "swap" });
const alex = Alex_Brush({ subsets: ["latin"], weight: "400", variable: "--font-alex", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-dm", display: "swap" });

export const metadata: Metadata = {
  title: "ALIA coiffure : tentez votre chance",
  description: "Tournez la roue d'ALIA coiffure à Champigny-sur-Marne : chaque case est un cadeau à utiliser lors de votre prochaine visite.",
  robots: { index: false, follow: false },
  openGraph: { title: "ALIA coiffure : tentez votre chance", description: "Chaque case de la roue est un cadeau.", locale: "fr_FR", type: "website" },
};

export const viewport: Viewport = { themeColor: "#0D0D0D", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${alex.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
