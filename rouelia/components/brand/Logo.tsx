/** Logotype Rouelia : le « o » est une petite roue à 8 segments. */
export function Logo({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "cream" }) {
  const text = tone === "ink" ? "text-ink" : "text-cream";
  return (
    <span className={`inline-flex items-center font-display text-[1.6rem] leading-none font-semibold ${text} ${className}`} role="img" aria-label="Rouelia">
      <span aria-hidden>R</span>
      <svg aria-hidden viewBox="0 0 24 24" className="mx-[0.04em] h-[0.72em] w-[0.72em] translate-y-[0.08em]">
        <circle cx="12" cy="12" r="11.5" fill="#C4401F" />
        {Array.from({ length: 8 }, (_, i) => {
          if (i % 2) return null;
          const a0 = (i * Math.PI) / 4;
          const a1 = ((i + 1) * Math.PI) / 4;
          const r = 9.5;
          return (
            <path
              key={i}
              d={`M12 12 L${12 + r * Math.sin(a0)} ${12 - r * Math.cos(a0)} A${r} ${r} 0 0 1 ${12 + r * Math.sin(a1)} ${12 - r * Math.cos(a1)} Z`}
              fill="#FBF6EE"
            />
          );
        })}
        <circle cx="12" cy="12" r="2.6" fill="#1D1A16" />
      </svg>
      <span aria-hidden>uelia</span>
    </span>
  );
}
