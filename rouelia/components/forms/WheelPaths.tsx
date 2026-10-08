"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles, Wand2 } from "lucide-react";
import { fr } from "@/lib/format";
import { createWheel } from "@/textes/formulaires";
import { DemoLazy } from "@/components/demo/DemoSection";
import { WheelRequestForm } from "./WheelRequestForm";

type PathId = "moi-meme" | "pour-moi";

/** Les deux parcours de /creer-ma-roue, en deux grandes cartes qui servent d'onglets. */
export function WheelPaths() {
  const [path, setPath] = useState<PathId>("pour-moi");

  // Le parcours se garde dans l'adresse (#moi-meme, #pour-moi) pour pouvoir le partager.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (h === "moi-meme" || h === "pour-moi") setPath(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  function choose(p: PathId) {
    setPath(p);
    history.replaceState(null, "", `#${p}`);
  }

  const cards: { id: PathId; title: string; text: string; badge: string; Icon: typeof Wand2; featured?: boolean }[] = [
    { ...createWheel.paths.pourMoi, id: "pour-moi", Icon: Sparkles, featured: true },
    { ...createWheel.paths.moi, id: "moi-meme", Icon: Wand2 },
  ];

  return (
    <div>
      <h2 className="sr-only">{createWheel.choose}</h2>
      <div role="tablist" aria-label={createWheel.choose} className="grid gap-7 md:grid-cols-2 md:gap-5">
        {cards.map((c) => {
          const on = path === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={on}
              aria-controls={`panel-${c.id}`}
              onClick={() => choose(c.id)}
              className={`relative flex flex-col rounded-xl p-5 text-left transition-[box-shadow,transform,background-color] duration-300 sm:p-7 ${
                on ? "bg-night text-cream shadow-lg ring-2 ring-tomette" : "bg-paper ring-1 ring-line hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              <span className={`absolute -top-3 left-5 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${c.featured ? "bg-tomette text-white" : "bg-sauge text-white"}`}>
                {c.badge}
              </span>
              <span className="flex items-center gap-3">
                <span aria-hidden className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${on ? "bg-tomette text-white" : "bg-tomette-soft text-tomette-deep"}`}>
                  <c.Icon size={22} />
                </span>
                <span className="font-display text-xl font-semibold sm:text-2xl">{fr(c.title)}</span>
                {on ? <Check aria-hidden size={22} className="ml-auto text-safran" /> : null}
              </span>
              <span className={`mt-3 ${on ? "text-cream/85" : "text-ink-soft"}`}>{fr(c.text)}</span>
            </button>
          );
        })}
      </div>

      <div id="panel-pour-moi" role="tabpanel" aria-labelledby="tab-pour-moi" hidden={path !== "pour-moi"} className="mt-10">
        <WheelRequestForm />
      </div>
      <div id="panel-moi-meme" role="tabpanel" aria-labelledby="tab-moi-meme" hidden={path !== "moi-meme"} className="mt-10">
        <h3 className="max-w-2xl font-display text-2xl font-semibold sm:text-3xl">{fr(createWheel.demoTitle)}</h3>
        <div className="mt-6">{path === "moi-meme" ? <DemoLazy /> : null}</div>
      </div>
    </div>
  );
}
