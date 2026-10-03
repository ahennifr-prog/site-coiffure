"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, ExternalLink, Printer, TriangleAlert } from "lucide-react";
import { card } from "./api";

export function QrTab({ slug, name }: { slug: string; name: string }) {
  const [url, setUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [png, setPng] = useState("");
  const [copied, setCopied] = useState(false);
  const [provisional, setProvisional] = useState(false);

  useEffect(() => {
    const u = `${window.location.origin}/j/${slug}`;
    setUrl(u);
    setProvisional(window.location.hostname !== "rouelia.fr");
    const opts = { errorCorrectionLevel: "H" as const, margin: 2, color: { dark: "#1D1A16", light: "#FFFFFF" } };
    QRCode.toString(u, { ...opts, type: "svg" }).then(setSvg);
    QRCode.toDataURL(u, { ...opts, width: 1600 }).then(setPng);
  }, [slug]);

  const svgHref = svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : "";
  const file = `${slug}-qr-code`;

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-line">
        {svg ? <div className="aspect-square w-full [&_svg]:h-full [&_svg]:w-full" role="img" aria-label={`QR code du jeu de ${name}`} dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="aspect-square animate-pulse rounded bg-line" />}
        <p className="mt-2 text-center font-mono text-xs break-all">{url}</p>
      </div>
      <div className="space-y-5">
        {provisional ? (
          <p className="flex gap-2 rounded-lg bg-safran-soft p-3 text-sm font-semibold ring-1 ring-safran">
            <TriangleAlert aria-hidden size={18} className="mt-0.5 shrink-0" />
            Adresse provisoire : attendez que le site soit sur rouelia.fr avant d&apos;imprimer le QR code.
          </p>
        ) : null}
        <section className={card}>
          <h2 className="font-display text-2xl font-semibold">Le QR code de votre jeu</h2>
          <p className="mt-1 text-sm text-ink-soft">Il mène directement à votre roue. Téléchargez-le pour votre chevalet, votre vitrine ou vos flyers.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={png || undefined} download={`${file}.png`} aria-disabled={!png} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-tomette px-5 font-semibold text-white hover:bg-tomette-deep">
              <Download aria-hidden size={18} /> Image PNG (impression)
            </a>
            <a href={svgHref || undefined} download={`${file}.svg`} aria-disabled={!svg} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cream px-5 font-semibold ring-1 ring-line">
              <Download aria-hidden size={18} /> SVG (qualité maximale)
            </a>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              })}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cream px-5 font-semibold ring-1 ring-line"
            >
              {copied ? <Check aria-hidden size={18} /> : <Copy aria-hidden size={18} />} {copied ? "Lien copié" : "Copier le lien"}
            </button>
            <a href="/espace/flyer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-white">
              <Printer aria-hidden size={18} /> Flyer et chevalet à imprimer
            </a>
            <a href={`/j/${slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cream px-5 font-semibold ring-1 ring-line">
              <ExternalLink aria-hidden size={18} /> Voir ma roue
            </a>
          </div>
        </section>
        <section className={card}>
          <h2 className="font-display text-xl font-semibold">Conseils pour l&apos;affichage</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-soft">
            <li>Imprimez le QR code à 3 cm de côté minimum, sur fond blanc, sans rien dessus.</li>
            <li>Posez-le là où le client attend : comptoir, caisse, table, miroir.</li>
            <li>Testez-le avec deux téléphones différents avant de le poser.</li>
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
