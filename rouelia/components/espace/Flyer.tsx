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
  rim: string;
  monogram: string;
  logoUrl: string | null;
  poweredBy: boolean;
  /** Couleurs des segments et noms des lots de la roue. */
  colors: string[];
  prizes: string[];
}

/** Petite roue décorative aux couleurs du commerce. */
function MiniWheel({ colors, rim, size }: { colors: string[]; rim: string; size: string }) {
  const n = Math.max(3, colors.length);
  const r = 46;
  const wedge = (i: number) => {
    const a0 = (i / n) * 2 * Math.PI;
    const a1 = ((i + 1) / n) * 2 * Math.PI;
    const p = (a: number) => `${50 + r * Math.sin(a)} ${54 - r * Math.cos(a)}`;
    return `M50 54 L${p(a0)} A${r} ${r} 0 0 1 ${p(a1)} Z`;
  };
  return (
    <svg viewBox="0 0 100 106" style={{ width: size, height: "auto" }} aria-hidden>
      <circle cx="50" cy="54" r="50" fill={rim} />
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={wedge(i)} fill={colors[i % colors.length]} stroke="#FFFFFF" strokeWidth="0.8" />
      ))}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * 2 * Math.PI;
        return <circle key={i} cx={50 + 48 * Math.sin(a)} cy={54 - 48 * Math.cos(a)} r="1.2" fill="#FFFFFF" />;
      })}
      <circle cx="50" cy="54" r="9" fill="#FFFFFF" />
      <circle cx="50" cy="54" r="5" fill={rim} />
      <path d="M43 0 H57 L50 14 Z" fill="#1D1A16" />
    </svg>
  );
}

/** Store banne à festons, aux couleurs du commerce. */
function Awning({ color, height }: { color: string; height: string }) {
  return (
    <svg viewBox="0 0 440 44" preserveAspectRatio="none" style={{ width: "100%", height, display: "block" }} aria-hidden>
      <defs>
        <pattern id="flyer-stripes" width="44" height="44" patternUnits="userSpaceOnUse">
          <rect width="22" height="44" fill={color} />
          <rect x="22" width="22" height="44" fill="#FFFFFF" />
        </pattern>
      </defs>
      <path fill="url(#flyer-stripes)" d={`M0 0 H440 V30 ${Array.from({ length: 10 }, (_, i) => `A22 14 0 0 1 ${440 - (i + 1) * 44} 30`).join(" ")} Z`} />
    </svg>
  );
}

/** Une carte : un chevalet A5, ou un flyer A6 (même dessin, plus petit). */
function Card({ shop, svg, size }: { shop: FlyerShop; svg: string; size: Format }) {
  const k = size === "a5" ? 1 : 0.71;
  const mm = (v: number) => `${v * k}mm`;
  const steps = ["Scannez le QR code", "Tournez la roue", "Revenez profiter de votre cadeau"];
  return (
    <div className="relative flex flex-col items-center overflow-hidden bg-white text-center text-ink" style={{ width: size === "a5" ? "148mm" : "105mm", height: size === "a5" ? "210mm" : "148.5mm" }}>
      <Awning color={shop.primary} height={mm(13)} />
      <div className="flex items-center justify-center" style={{ gap: mm(3), marginTop: mm(5) }}>
        <span className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white" style={{ width: mm(13), height: mm(13), boxShadow: `0 0 0 ${mm(0.6)} ${shop.primary}` }}>
          {shop.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shop.logoUrl} alt="" className="h-full w-full object-contain" />
          ) : (
            <Monogram text={shop.monogram} color={shop.primary} className="h-full w-full" />
          )}
        </span>
        <p className="font-display font-semibold" style={{ fontSize: mm(6.2) }}>{shop.name}</p>
      </div>
      <p className="font-display leading-none font-semibold" style={{ fontSize: mm(14), marginTop: mm(5) }}>Tentez votre chance</p>
      <p className="inline-block rounded-full font-bold tracking-wide uppercase" style={{ background: shop.primary, color: shop.onPrimary, fontSize: mm(3.6), padding: `${mm(1.4)} ${mm(4)}`, marginTop: mm(3.5) }}>
        100 % gagnant : chaque case est un cadeau
      </p>

      <div className="flex items-center justify-center" style={{ gap: mm(5), marginTop: mm(7) }}>
        <div className="flex flex-col items-center">
          <span className="rounded-t-lg font-bold uppercase" style={{ background: "#1D1A16", color: "#FFFFFF", fontSize: mm(3), padding: `${mm(0.8)} ${mm(3)}`, letterSpacing: "0.08em" }}>
            Scannez-moi
          </span>
          <div className="rounded-xl bg-white [&_svg]:h-full [&_svg]:w-full" style={{ width: mm(52), height: mm(52), padding: mm(2), border: `${mm(0.8)} solid #1D1A16` }} dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
        <MiniWheel colors={shop.colors} rim={shop.rim} size={mm(40)} />
      </div>

      {shop.prizes.length ? (
        <div style={{ marginTop: mm(6), padding: `0 ${mm(9)}` }}>
          <p className="font-bold uppercase" style={{ fontSize: mm(3), letterSpacing: "0.12em", color: "#5E564E" }}>À gagner</p>
          <div className="flex flex-wrap justify-center" style={{ gap: mm(1.6), marginTop: mm(1.8) }}>
            {shop.prizes.slice(0, 5).map((p, i) => (
              <span key={p} className="inline-flex items-center rounded-full font-semibold" style={{ gap: mm(1.4), fontSize: mm(3.3), padding: `${mm(0.9)} ${mm(2.6)} ${mm(0.9)} ${mm(1.6)}`, border: `${mm(0.35)} solid #E8DFD2`, background: "#FBF6EE" }}>
                <span aria-hidden className="inline-block rounded-full" style={{ width: mm(3), height: mm(3), background: shop.colors[i % shop.colors.length], boxShadow: "inset 0 0 0 1px rgba(29,26,22,0.25)" }} />
                {p}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <ol className="flex justify-center" style={{ gap: mm(4), marginTop: mm(8), padding: `0 ${mm(8)}` }}>
        {steps.map((t, i) => (
          <li key={t} className="flex flex-1 flex-col items-center" style={{ gap: mm(1.2) }}>
            <span className="inline-flex items-center justify-center rounded-full font-bold" style={{ width: mm(7), height: mm(7), fontSize: mm(3.6), background: shop.primary, color: shop.onPrimary }}>
              {i + 1}
            </span>
            <span className="font-semibold leading-tight" style={{ fontSize: mm(3.2) }}>{t}</span>
          </li>
        ))}
      </ol>

      <p className="mt-auto text-ink-soft" style={{ fontSize: mm(2.7), padding: `0 ${mm(10)} ${mm(5)}`, lineHeight: 1.35 }}>
        Jeu gratuit, sans obligation d&apos;achat. Une participation par personne. Pas d&apos;application à installer.
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
