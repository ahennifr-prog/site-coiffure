"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cta, nav, ui } from "@/content";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { FounderAvatar } from "@/components/brand/FounderAvatar";

const ABOUT = "/a-propos";

/**
 * Menu principal. Fond crème plein dès le haut de page (le texte ne transparaît jamais derrière),
 * bordure et ombre légère au défilement.
 */
export function Nav() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // Sur l'accueil, le bouton du menu reste caché tant que celui du haut de page est à l'écran (pas de doublon).
  const [heroCtaVisible, setHeroCtaVisible] = useState(pathname === "/");
  // Sur /creer-ma-roue, « Créer ma roue » mènerait à la page en cours : le menu propose l'appel à la place.
  const onCreatePage = pathname === cta.href;
  const navCta = onCreatePage ? { href: cta.callHref, label: cta.callShort } : { href: cta.href, label: cta.primary };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sur l'accueil, indique la section en cours de lecture.
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = nav.links.filter((l) => l.href.startsWith("/#")).map((l) => l.href.slice(2));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSection(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
    const el = pathname === "/" ? document.getElementById("hero-cta") : null;
    if (!el || typeof IntersectionObserver === "undefined") {
      setHeroCtaVisible(false);
      return;
    }
    const io = new IntersectionObserver(([e]) => setHeroCtaVisible(e.isIntersecting), { rootMargin: "-64px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href.startsWith("/#") ? pathname === "/" && section === href.slice(2) : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-40 h-(--nav-h) border-b bg-cream transition-[border-color,box-shadow] duration-300 ${
        scrolled || open ? "border-line shadow-[0_6px_20px_-12px_rgb(60_30_10/0.25)]" : "border-transparent"
      }`}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
      >
        {nav.skipLink}
      </a>
      <nav aria-label={ui.mainNav} className="mx-auto flex h-full max-w-6xl items-center gap-3 px-5 sm:px-8">
        {/* Sur l'accueil, inutile de précharger l'accueil lui-même (environ 15 Ko de données en plus). */}
        <Link href="/" prefetch={pathname === "/" ? false : undefined} className="-ml-1 rounded-lg px-1 py-2" title={ui.homeLink}>
          <Logo />
        </Link>

        <ul className="ml-auto hidden items-center gap-0.5 xl:flex">
          {nav.links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  l.href === ABOUT ? "py-1.5 pl-1.5" : ""
                } ${isActive(l.href) ? "bg-tomette-soft text-ink" : "text-ink-soft hover:text-ink"}`}
              >
                {/* « À propos » : la pastille du fondateur, comme une photo de profil (cercle et texte forment un seul lien). */}
                {l.href === ABOUT ? <FounderAvatar size={28} /> : null}
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <ButtonLink
          href={navCta.href}
          variant={onCreatePage ? "secondary" : "primary"}
          aria-hidden={heroCtaVisible || undefined}
          tabIndex={heroCtaVisible ? -1 : undefined}
          className={`ml-auto transition-[opacity,transform] duration-300 xl:ml-3 ${heroCtaVisible ? "pointer-events-none translate-y-1 opacity-0" : "opacity-100"}`}
          onClick={() => setOpen(false)}
        >
          {navCta.label}
        </ButtonLink>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink xl:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? nav.menuClose : nav.menuOpen}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden size={22} /> : <Menu aria-hidden size={22} />}
        </button>
      </nav>

      <div id="menu-mobile" hidden={!open} className="absolute inset-x-0 top-(--nav-h) border-b border-line bg-cream px-5 pb-6 shadow-md xl:hidden">
        <ul className="flex flex-col">
          {nav.links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(l.href) ? "page" : undefined}
                className="flex min-h-12 items-center gap-3 border-b border-line text-lg font-medium aria-[current=page]:text-tomette-deep"
              >
                {l.href === ABOUT ? <FounderAvatar size={32} /> : null}
                {l.label}
              </Link>
            </li>
          ))}
          {!onCreatePage ? (
            <li>
              <Link href={cta.callHref} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-lg font-semibold text-tomette-deep">
                {cta.callShort}
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </header>
  );
}
