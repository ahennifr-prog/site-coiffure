/**
 * Réglages du site à modifier sans toucher au reste du code.
 * Aucun secret ici : les clés (RESEND_API_KEY, BREVO_API_KEY...) restent des variables d'environnement Cloudflare.
 */

/** Adresse de contact affichée partout et destinataire des demandes du site. */
export const EMAIL = "contact@rouelia.fr";

/** Numéro WhatsApp au format international, sans + ni espaces. Provisoire : remplacer par le numéro business. */
export const WHATSAPP_NUMBER = "33672780326";
export const WHATSAPP_TEXT = "Bonjour, je souhaite en savoir plus sur Rouelia";
export const whatsappUrl = (text: string = WHATSAPP_TEXT) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/**
 * Disponibilités des appels de découverte (page /rendez-vous), heure de Paris.
 * Jours : 1 = lundi ... 7 = dimanche. Plages au format « HH:MM ».
 */
/** Plages des jours ouvrés (lundi à vendredi), heure de Paris : matin, midi, après-midi, soir. */
const WEEKDAY_HOURS: [string, string][] = [
  ["09:00", "12:00"],
  ["12:00", "14:00"],
  ["14:00", "17:00"],
  ["18:00", "20:00"],
];

export const BOOKING = {
  /** Durée d'un créneau, en minutes. */
  slotMinutes: 5,
  /** Nombre de jours affichés à partir d'aujourd'hui. */
  daysAhead: 14,
  /** Délai minimum avant un créneau, en heures. */
  minNoticeHours: 2,
  /**
   * Plages ouvertes par jour de la semaine. Un jour absent est fermé.
   * Pour changer les horaires de tous les jours ouvrés, modifiez WEEKDAY_HOURS ci-dessous ;
   * pour un jour précis, remplacez sa ligne par sa propre liste (exemple : 3: [["09:00", "12:00"]]).
   */
  hours: {
    1: WEEKDAY_HOURS,
    2: WEEKDAY_HOURS,
    3: WEEKDAY_HOURS,
    4: WEEKDAY_HOURS,
    5: WEEKDAY_HOURS,
  } as Record<number, [string, string][]>,
  /** Jours bloqués (congés, jours fériés), au format AAAA-MM-JJ. */
  blockedDays: [] as string[],
};

/**
 * Photo de profil du fondateur, affichée en pastille à côté de « À propos » dans le menu.
 * null : cercle avec l'initiale du fondateur (brand.founder dans content.ts).
 * Pour afficher une vraie photo : déposer deux carrés WebP de 96 et 192 px dans /public et renseigner leurs chemins,
 * par exemple { src96: "/a-propos/profil-96.webp", src192: "/a-propos/profil-192.webp" }.
 * Ne mettre qu'une photo de la personne nommée comme fondateur sur le site.
 */
export const FOUNDER_AVATAR: { src96: string; src192: string } | null = null;
