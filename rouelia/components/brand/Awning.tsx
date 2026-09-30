/** Store banne à festons : le motif signature de Rouelia. Décoratif. */
export function Awning({ className = "", stripe = "#C4401F", base = "#FBF6EE" }: { className?: string; stripe?: string; base?: string }) {
  const id = `aw-${stripe.slice(1)}-${base.slice(1)}`;
  return (
    <svg aria-hidden className={className} viewBox="0 0 440 44" preserveAspectRatio="none">
      <defs>
        <pattern id={id} width="44" height="44" patternUnits="userSpaceOnUse">
          <rect width="22" height="44" fill={stripe} />
          <rect x="22" width="22" height="44" fill={base} />
        </pattern>
      </defs>
      <path
        fill={`url(#${id})`}
        d={`M0 0 H440 V30 ${Array.from({ length: 10 }, (_, i) => `A22 14 0 0 1 ${440 - (i + 1) * 44} 30`).join(" ")} Z`}
      />
    </svg>
  );
}
