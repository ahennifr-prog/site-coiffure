/**
 * Mesure des conversions du site, sans cookie ni donnée personnelle.
 * Chaque événement n'incrémente qu'un compteur par jour (table stats, commerce « _site ») :
 * ni adresse IP, ni identifiant, ni navigateur ne sont enregistrés.
 */
export const SITE_EVENTS = {
  creer_ma_roue_clic: "Clic « Créer ma roue »",
  whatsapp_clic: "Clic WhatsApp",
  tarifs_clic: "Clic « Voir les tarifs »",
  rdv_reserve: "Rendez-vous réservé",
  roue_pour_moi_envoye: "Formulaire « Créez-la pour moi » envoyé",
  essai_envoye: "Inscription à l'essai envoyée",
  autre_activite_envoye: "Formulaire « Autre activité » envoyé",
  arrivee_roue: "Visite depuis la roue d'un commerçant",
  scroll_25: "Accueil lu à 25 %",
  scroll_50: "Accueil lu à 50 %",
  scroll_75: "Accueil lu à 75 %",
  scroll_100: "Accueil lu jusqu'au bout",
} as const;

export type SiteEvent = keyof typeof SITE_EVENTS;

/** Événements que le navigateur peut envoyer ; les envois de formulaires sont comptés par le serveur. */
export const CLIENT_EVENTS: SiteEvent[] = ["creer_ma_roue_clic", "whatsapp_clic", "tarifs_clic", "arrivee_roue", "scroll_25", "scroll_50", "scroll_75", "scroll_100"];

export const isClientEvent = (v: unknown): v is SiteEvent => typeof v === "string" && (CLIENT_EVENTS as string[]).includes(v);
