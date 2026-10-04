"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cta, nav, ui } from "@/content";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Indique la section en cours de lecture.
  useEffect(() => {
    const ids = nav.links.map((l) => l.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 h-(--nav-h) transition-[background-color,box-shadow] duration-300 ${
        scrolled || open ? "bg-cream/95 shadow-[0_1px_0_var(--color-line)]" : "bg-cream/0"
      }`}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
      >
        {nav.skipLink}
      </a>
      <nav aria-label={ui.mainNav} className="mx-auto flex h-full max-w-6xl items-center gap-4 px-5 sm:px-8">
        <Link href="/" className="-ml-1 rounded-lg px-1 py-2" title={ui.homeLink}>
          <Logo />
        </Link>

        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {nav.links.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-tomette-soft text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <ButtonLink href="#demo" className="ml-auto lg:ml-3" onClick={() => setOpen(false)}>
          {cta.primary}
        </ButtonLink>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? nav.menuClose : nav.menuOpen}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden size={22} /> : <Menu aria-hidden size={22} />}
        </button>
      </nav>

      <div
        id="menu-mobile"
        hidden={!open}
        className="absolute inset-x-0 top-(--nav-h) border-b border-line bg-cream px-5 pb-6 shadow-md lg:hidden"
      >
        <ul className="flex flex-col">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={active === l.href.slice(1) ? "true" : undefined}
                className="flex min-h-12 items-center border-b border-line text-lg font-medium aria-[current=true]:text-tomette-deep"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
