/**
 * Saisie assistée du nom de l'établissement.
 * Aujourd'hui : saisie libre. Demain : brancher l'API Google Places (Autocomplete New)
 * côté serveur, dans une route /api/places, pour ne pas exposer la clé.
 */
export interface Establishment {
  name: string;
  /** Identifiant Google Places, vide tant que l'API n'est pas branchée. */
  placeId: string | null;
  address: string | null;
  googleMapsUrl: string | null;
}

export const placesEnabled = false;

export async function searchPlaces(_query: string): Promise<Establishment[]> {
  return [];
}

export function freeTextEstablishment(name: string): Establishment {
  return { name: name.trim(), placeId: null, address: null, googleMapsUrl: null };
}
