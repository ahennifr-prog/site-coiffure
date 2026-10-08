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
export const BOOKING = {
  /** Durée d'un créneau, en minutes. */
  slotMinutes: 5,
  /** Nombre de jours affichés à partir d'aujourd'hui. */
  daysAhead: 14,
  /** Délai minimum avant un créneau, en heures. */
  minNoticeHours: 2,
  /** Plages ouvertes par jour de la semaine. Un jour absent est fermé. */
  hours: {
    1: [["12:00", "14:00"], ["18:00", "20:00"]],
    2: [["12:00", "14:00"], ["18:00", "20:00"]],
    3: [["12:00", "14:00"], ["18:00", "20:00"]],
    4: [["12:00", "14:00"], ["18:00", "20:00"]],
    5: [["12:00", "14:00"], ["18:00", "20:00"]],
  } as Record<number, [string, string][]>,
  /** Jours bloqués (congés, jours fériés), au format AAAA-MM-JJ. */
  blockedDays: [] as string[],
};
