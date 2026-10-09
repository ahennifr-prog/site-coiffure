import { FOUNDER_AVATAR } from "@/config";
import { brand } from "@/content";

/** Pastille ronde du fondateur (photo de profil, ou son initiale). Taille en pixels CSS. */
export function FounderAvatar({ size = 28 }: { size?: number }) {
  const alt = `${brand.founder}, fondateur de ${brand.name}`;
  if (FOUNDER_AVATAR) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={FOUNDER_AVATAR.src96}
        srcSet={`${FOUNDER_AVATAR.src96} 1x, ${FOUNDER_AVATAR.src192} 2x`}
        width={size}
        height={size}
        alt={alt}
        className="shrink-0 rounded-full object-cover ring-2 ring-paper"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={alt}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-tomette font-display font-semibold text-white ring-2 ring-paper"
      style={{ width: size, height: size, fontSize: size * 0.48 }}
    >
      <span aria-hidden>{brand.founder.charAt(0)}</span>
    </span>
  );
}
