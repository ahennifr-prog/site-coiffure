"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ArrowLeft, Printer, TriangleAlert } from "lucide-react";
import { Monogram } from "@/components/demo/PhoneScreen";

type Format = "a5" | "a6";

interface FlyerShop {
  slug: string;
  name: string;
  primary: string;
  onPrimary: string;
  monogram: string;
  logoUrl: string | null;
  poweredBy: boolean;
}

/** Une carte : un chevalet A5, ou un flyer A6 (même dessin, plus petit). */
function Card({ shop, svg, size }: { shop: FlyerShop; svg: string; size: Format }) {
  const k = size === "a5" ? 1 : 0.71;
  const mm = (v: number) => `${v * k}mm`;
  return (
    <div className="flex flex-col items-center overflow-hidden bg-white text-center text-ink" style={{ width: size === "a5" ? "148mm" : "105mm", height: size === "a5" ? "210mm" : "148.5mm" }}>
      <div className="flex w-full flex-col items-center" style={{ background: shop.primary, color: shop.onPrimary, padding: `${mm(9)} ${mm(10)} ${mm(7)}` }}>
        <span className="inline-flex items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-white" style={{ width: mm(22), height: mm(22) }}>
          {shop.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shop.logoUrl} alt="" className="h-full w-full object-contain" />
          ) : (
            <Monogram text={shop.monogram} color={shop.primary} className="h-full w-full" />
          )}
        </span>
        <p className="font-display font-semibold" style={{ fontSize: mm(6), marginTop: mm(3) }}>{shop.name}</p>
        <p className="font-display leading-none font-semibold" style={{ fontSize: mm(13), marginTop: mm(4) }}>Tentez votre chance</p>
      </div>
      <p className="font-semibold" style={{ fontSize: mm(4.6), margin: `${mm(6)} ${mm(12)} 0`, lineHeight: 1.3 }}>
        Scannez, tournez la roue : chaque case est un cadeau à utiliser lors de votre prochaine visite.
      </p>
      <div className="[&_svg]:h-full [&_svg]:w-full" style={{ width: mm(78), height: mm(78), marginTop: mm(5) }} dangerouslySetInnerHTML={{ __html: svg }} />
      <p className="mt-auto text-ink-soft" style={{ fontSize: mm(3.4), padding: `0 ${mm(10)} ${mm(7)}` }}>
        Jeu gratuit, sans obligation d&apos;achat. Une participation par personne.
        {shop.poweredBy ? <><br />Propulsé par Rouelia</> : null}
      </p>
    </div>
  );
}

export function Flyer({ shop }: { shop: FlyerShop }) {
  const [format, setFormat] = useState<Format>("a5");
  const [svg, setSvg] = useState("");
  const [provisional, setProvisional] = useState(false);
  // Aperçu réduit sur petit écran ; l'impression garde les vraies dimensions.
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const widthMm = format === "a5" ? 148 : 210;
    const fit = () => setZoom(Math.min(1, (window.innerWidth - 32) / (widthMm * 3.78)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [format]);

  useEffect(() => {
    const url = `${window.location.origin}/j/${shop.slug}`;
    setProvisional(window.location.hostname !== "rouelia.fr");
    QRCode.toString(url, { type: "svg", errorCorrectionLevel: "H", margin: 1, color: { dark: "#1D1A16", light: "#FFFFFF" } }).then(setSvg);
  }, [shop.slug]);

  return (
    <div className="min-h-svh bg-cream print:bg-white">
      <style>{`@page { size: ${format === "a5" ? "A5" : "A4"} portrait; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>
      <div className="mx-auto max-w-3xl px-5 py-6 print:hidden">
        <a href="/espace#qr" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold">
          <ArrowLeft aria-hidden size={16} /> Retour à l&apos;espace
        </a>
        <h1 className="mt-3 font-display text-3xl font-semibold">Flyer et chevalet à imprimer</h1>
        <p className="mt-1 text-ink-soft">Choisissez le format, puis « Imprimer ». Pour un PDF, choisissez « Enregistrer au format PDF » comme imprimante.</p>
        {provisional ? (
          <p className="mt-4 flex gap-2 rounded-lg bg-safran-soft p-3 text-sm font-semibold ring-1 ring-safran">
            <TriangleAlert aria-hidden size={18} className="mt-0.5 shrink-0" />
            Adresse provisoire : attendez que le site soit sur rouelia.fr avant d&apos;imprimer.
          </p>
        ) : null}
        <div role="radiogroup" aria-label="Format" className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["a5", "Chevalet A5"],
              ["a6", "4 flyers A6 sur une feuille A4"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" role="radio" aria-checked={format === id} onClick={() => setFormat(id)} className={`min-h-11 rounded-full px-4 text-sm font-semibold ring-1 ${format === id ? "bg-ink text-white ring-ink" : "bg-paper ring-line"}`}>
              {label}
            </button>
          ))}
          <button type="button" onClick={() => window.print()} disabled={!svg} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-tomette px-5 text-sm font-semibold text-white hover:bg-tomette-deep disabled:opacity-50">
            <Printer aria-hidden size={16} /> Imprimer
          </button>
        </div>
      </div>
      <div className="pb-10 print:pb-0">
        <div className="mx-auto w-fit shadow-lg ring-1 ring-line print:shadow-none print:ring-0 print:[zoom:1]" style={{ zoom }}>
          {svg ? (
            format === "a5" ? (
              <Card shop={shop} svg={svg} size="a5" />
            ) : (
              <div className="grid grid-cols-2 bg-white" style={{ width: "210mm", height: "297mm" }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="outline outline-1 outline-dashed outline-line">
                    <Card shop={shop} svg={svg} size="a6" />
                  </div>
                ))}
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
