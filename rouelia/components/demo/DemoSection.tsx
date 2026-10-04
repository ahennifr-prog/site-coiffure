"use client";

import dynamic from "next/dynamic";
import { demo } from "@/content";
import { WhenVisible } from "@/components/ui/WhenVisible";

function Skeleton({ label, blocks, side }: { label: string; blocks: number[]; side: number }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_400px]" aria-busy="true">
      <p className="sr-only" role="status">
        {label}
      </p>
      <div className="space-y-5">
        {blocks.map((h, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-paper ring-1 ring-line" style={{ height: h }} />
        ))}
      </div>
      <div className="hidden animate-pulse rounded-[44px] bg-night/10 lg:block" style={{ height: side }} />
    </div>
  );
}

const DemoInner = dynamic(() => import("./Demo"), {
  ssr: false,
  loading: () => <Skeleton label={demo.preview.loading} blocks={[300, 330, 900, 220]} side={700} />,
});

/** La démo ne se charge qu'à l'approche : la page d'accueil reste légère. */
export function DemoLazy() {
  return (
    <WhenVisible fallback={<Skeleton label={demo.preview.loading} blocks={[300, 330, 900, 220]} side={700} />}>
      <DemoInner />
    </WhenVisible>
  );
}
