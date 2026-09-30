import { Game } from "@/components/Game";
import { publicConfig } from "@/lib/config";
import { getConfig } from "@/lib/game";

// La configuration (lots, chances, dates) se règle dans l'espace gestion : on la lit à chaque visite.
export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await getConfig();
  return <Game config={publicConfig(config)} />;
}
