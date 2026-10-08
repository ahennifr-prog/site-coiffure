import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { TradeView, tradePage } from "@/components/pages/TradeView";

const page = tradePage("/jeu-fidelisation-restaurant");

export const metadata: Metadata = pageMeta(page);

export default function Page() {
  return <TradeView page={page} />;
}
