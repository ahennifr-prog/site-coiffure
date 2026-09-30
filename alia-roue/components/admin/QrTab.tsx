"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download } from "lucide-react";

export function QrTab() {
  const [url, setUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [png, setPng] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const u = window.location.origin + "/";
    setUrl(u);
    const opts = { errorCorrectionLevel: "H" as const, margin: 2, color: { dark: "#0D0D0D", light: "#FFFFFF" } };
    QRCode.toString(u, { ...opts, type: "svg" }).then(setSvg);
    QRCode.toDataURL(u, { ...opts, width: 1600 }).then(setPng);
  }, []);

  const svgHref = svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : "";

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="rounded-xl bg-white p-5">
        {svg ? <div className="aspect-square w-full [&_svg]:h-full [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="aspect-square animate-pulse rounded bg-argent/30" />}
        <p className="mt-2 text-center font-mono text-xs break-all text-noir">{url}</p>
      </div>
      <div className="space-y-5">
        <section className="rounded-xl bg-anthracite p-5 ring-1 ring-trait sm:p-6">
          <h2 className="font-display text-2xl">Le QR code du jeu</h2>
          <p className="mt-1 text-sm text-argent">Il mène directement à la roue. Téléchargez-le pour votre flyer ou votre chevalet.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={png} download="alia-coiffure-qr-code.png" aria-disabled={!png} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-framboise px-5 font-semibold text-white">
              <Download aria-hidden size={18} /> Image PNG (impression)
            </a>
            <a href={svgHref} download="alia-coiffure-qr-code.svg" aria-disabled={!svg} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-noir px-5 font-semibold ring-1 ring-trait">
              <Download aria-hidden size={18} /> SVG (qualité maximale)
            </a>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              })}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-noir px-5 font-semibold ring-1 ring-trait"
            >
              {copied ? <Check aria-hidden size={18} /> : <Copy aria-hidden size={18} />} {copied ? "Lien copié" : "Copier le lien"}
            </button>
          </div>
        </section>
        <section className="rounded-xl bg-anthracite p-5 ring-1 ring-trait sm:p-6">
          <h2 className="font-display text-xl">Conseils pour le flyer</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-argent">
            <li>Imprimez le QR code à 3 cm de côté minimum, sur fond blanc, sans rien dessus.</li>
            <li>Testez le flyer imprimé avec deux téléphones différents avant de le poser.</li>
            <li>
              Texte conseillé : « Tentez votre chance. Scannez, tournez la roue : chaque case est un cadeau à utiliser lors de votre prochaine visite. Jeu gratuit, sans obligation d&apos;achat. »
            </li>
            <li>N&apos;écrivez pas que le cadeau est offert contre un avis : Google l&apos;interdit. L&apos;avis reste une simple invitation.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
