import Link from "next/link";
import { brand, footer, ui } from "@/content";
import { fr } from "@/lib/format";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Section";
import { CookieSettingsLink } from "@/components/consent/CookieBanner";

export function Footer() {
  return (
    <footer className="bg-night py-12 text-cream">
      <Container className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo tone="cream" />
          <p className="mt-3 max-w-xs text-cream/85">{fr(footer.tagline)}</p>
          <p className="mt-1 text-sm text-cream/85">{fr(brand.area)}</p>
        </div>
        <nav aria-label={ui.legalNav}>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {footer.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center text-sm text-cream/90 underline-offset-4 hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsLink className="inline-flex min-h-11 items-center text-sm text-cream/90 underline-offset-4 hover:text-white hover:underline">
                {footer.cookies}
              </CookieSettingsLink>
            </li>
          </ul>
          <p className="mt-2 text-sm text-cream/80">{footer.copyright(new Date().getFullYear())}</p>
        </nav>
      </Container>
    </footer>
  );
}
