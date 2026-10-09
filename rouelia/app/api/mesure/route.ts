import { countEvent } from "@/lib/mesure";
import { isClientEvent } from "@/lib/mesure-events";

/**
 * Mesure sans cookie : le navigateur envoie seulement le nom d'un événement de la liste autorisée.
 * Rien d'autre n'est lu ni gardé (pas d'adresse IP, pas d'identifiant, pas de page précédente).
 */
export async function POST(req: Request) {
  let event: unknown = null;
  try {
    event = (JSON.parse(await req.text()) as { e?: unknown }).e;
  } catch {
    /* corps illisible : ignoré */
  }
  if (isClientEvent(event)) await countEvent(event);
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
