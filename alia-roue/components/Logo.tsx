/** Logo ALIA coiffure : « ALIA » serif chromé et « coiffure » en écriture manuscrite, comme sur le site du salon. */
export function Logo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const s = { sm: "text-2xl", md: "text-4xl", lg: "text-6xl" }[size];
  return (
    <span role="img" aria-label="ALIA coiffure" className={`inline-flex items-baseline gap-2 whitespace-nowrap ${s} ${className}`}>
      <span aria-hidden className="chrome-sheen font-display font-medium tracking-[0.16em]">
        ALIA
      </span>
      <span aria-hidden className="font-script text-[1.05em] leading-none text-argent">
        coiffure
      </span>
    </span>
  );
}
