import Link from "next/link";
import { brand, footer, ui } from "@/content";
import { fr } from "@/lib/format";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Section";

const linkClass = "inline-flex min-h-11 items-center text-sm text-cream/90 underline-offset-4 hover:text-white hover:underline";

function FooterLink({ href, label }: { href: string; label: string }) {
  return /^(https?:|mailto:)/.test(href) ? (
    <a href={href} className={linkClass} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {label}
    </a>
  ) : (
    <Link href={href} className={linkClass}>
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="bg-night pt-14 pb-10 text-cream">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="cream" />
            <p className="mt-3 max-w-xs text-cream/85">{fr(footer.tagline)}</p>
            <p className="mt-1 text-sm text-cream/85">{fr(brand.area)}</p>
          </div>
          {footer.groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <p className="text-xs font-bold tracking-[0.14em] text-safran uppercase">{g.title}</p>
              <ul className="mt-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <FooterLink {...l} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <nav aria-label={ui.legalNav} className="mt-10 border-t border-cream/15 pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {footer.links.map((l) => (
              <li key={l.href}>
                <FooterLink {...l} />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-cream/80">{footer.copyright(new Date().getFullYear())}</p>
        </nav>
      </Container>
    </footer>
  );
}
