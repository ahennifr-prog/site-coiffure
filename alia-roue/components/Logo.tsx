/* eslint-disable @next/next/no-img-element */

/** Logo officiel ALIA coiffure (monogramme AC, « ALIA », « coiffure »), argent sur fond transparent. */
export function Logo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const h = { sm: "h-16 sm:h-20", md: "h-28", lg: "h-40" }[size];
  return <img src="/logo-alia.png" alt="ALIA coiffure" width={463} height={457} className={`w-auto ${h} ${className}`} />;
}

/** Monogramme AC seul, pour les petits espaces. */
export function LogoMark({ className = "" }: { className?: string }) {
  return <img src="/logo-ac.png" alt="ALIA coiffure" width={225} height={242} className={`w-auto ${className}`} />;
}
