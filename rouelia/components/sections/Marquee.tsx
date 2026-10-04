import { marquee } from "@/content";
import { fr } from "@/lib/format";

/** Bandeau de cadeaux en défilement continu, décalé par le scroll. Décoratif. */
export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-line bg-paper py-7 sm:py-9" data-fx>
      <div className="marquee-shift">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {items.map((m, i) => (
                <span key={`${k}-${i}`} className="flex shrink-0 items-center">
                  <span className={`px-6 font-display text-4xl font-semibold tracking-[-0.03em] whitespace-nowrap sm:px-9 sm:text-6xl ${i % 2 ? "text-tomette-deep italic" : "text-ink"}`}>{fr(m)}</span>
                  <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0 sm:h-9 sm:w-9">
                    <circle cx="12" cy="12" r="11" fill="var(--color-tomette)" />
                    <path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M19.8 4.2 4.2 19.8" stroke="var(--color-cream)" strokeWidth="2.2" />
                    <circle cx="12" cy="12" r="3" fill="var(--color-ink)" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
