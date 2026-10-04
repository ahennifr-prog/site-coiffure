import { Check, X } from "lucide-react";
import { reviewPrompt, ui } from "@/content";

/* Illustrations des 4 étapes côté client (décoratives, sans données). */

/** QR code décoratif, déterministe. */
export function QrArt() {
  const cells: [number, number][] = [];
  let seed = 7;
  for (let y = 0; y < 13; y++)
    for (let x = 0; x < 13; x++) {
      const finder = (x < 4 && y < 4) || (x > 8 && y < 4) || (x < 4 && y > 8);
      if (finder) continue;
      seed = (seed * 9301 + 49297) % 233280;
      if (seed / 233280 > 0.52) cells.push([x, y]);
    }
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={3.4} height={3.4} rx={0.6} fill="#1D1A16" />
      <rect x={x + 0.7} y={y + 0.7} width={2} height={2} rx={0.3} fill="#FFFFFF" />
      <rect x={x + 1.2} y={y + 1.2} width={1} height={1} fill="#1D1A16" />
    </g>
  );
  return (
    <div className="relative flex flex-col items-center">
      <div className="rounded-t-lg bg-tomette px-4 pt-2 pb-1 text-[10px] font-bold tracking-wider text-white uppercase">{ui.illustrations.standTitle}</div>
      <div className="rounded-lg bg-paper p-3 shadow-md ring-1 ring-line">
        <svg aria-hidden viewBox="0 0 13 13" className="h-20 w-20">
          {finder(0, 0)}
          {finder(9.6, 0)}
          {finder(0, 9.6)}
          {cells.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={0.92} height={0.92} rx={0.2} fill="#1D1A16" />
          ))}
        </svg>
      </div>
    </div>
  );
}

export function ReviewArt() {
  return (
    <div className="w-44 rounded-xl bg-paper p-3 text-left shadow-md ring-1 ring-line">
      <div className="flex justify-end">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white">
          <X aria-hidden size={14} strokeWidth={3} />
        </span>
      </div>
      <div className="mt-1 h-2 w-32 rounded bg-line" />
      <div className="mt-1.5 h-2 w-24 rounded bg-line" />
      <div className="mt-3 rounded-full bg-ink py-1.5 text-center text-[10px] font-semibold text-white">{reviewPrompt.button}</div>
    </div>
  );
}

export function WheelArt() {
  return (
    <div className="relative">
      <div
        className="h-28 w-28 rounded-full shadow-md ring-[6px] ring-tomette-deep"
        style={{
          background:
            "conic-gradient(#C4401F 0 60deg,#FBF6EE 60deg 120deg,#F3B23C 120deg 180deg,#2E6150 180deg 240deg,#C4401F 240deg 300deg,#FBF6EE 300deg 360deg)",
        }}
      />
      <span className="absolute inset-0 m-auto h-8 w-8 rounded-full bg-paper shadow" />
      <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm bg-ink" />
    </div>
  );
}

export function TicketArt() {
  return (
    <div className="w-44 rounded-xl bg-paper p-3 shadow-md ring-1 ring-line">
      <p className="text-[10px] font-semibold tracking-wider text-ink-soft uppercase">{ui.illustrations.giftCode}</p>
      <p className="tabular mt-0.5 text-lg font-bold tracking-wide">ROU-7K4M</p>
      <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-sauge px-2 py-1 text-[11px] font-semibold text-white">
        <Check aria-hidden size={12} strokeWidth={3} /> {ui.illustrations.validated}
      </p>
    </div>
  );
}

export const stepArts = [QrArt, ReviewArt, WheelArt, TicketArt];
