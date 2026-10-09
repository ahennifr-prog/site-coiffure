/**
 * Données de l'espace admin en dehors des inscriptions : demandes reçues (« Créez-la pour moi », « Autre activité »)
 * et appels réservés. Chaque élément peut être marqué « traité » et recevoir des notes privées.
 */
import type { PackId } from "@/content";
import { formatSlot, type Booking } from "@/lib/bookings";
import { database, getSignup, saveSignup } from "@/lib/db";
import type { SignupRecord } from "@/lib/signup";
import { consentText } from "@/textes/formulaires";

/** Suivi ajouté par l'admin à une demande ou à un appel. */
export interface AdminFollow {
  done?: boolean;
  notes?: string;
}

/** Demande « Créez-la pour moi » telle qu'enregistrée par /api/roue-pour-moi. */
export interface WheelRequestData extends AdminFollow {
  kind?: undefined;
  shopName: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  google: string;
  prizes: string;
  message: string;
  logoName: string | null;
  pack?: PackId;
  signupId?: string;
}

/** Demande « Autre activité » (page /pour-qui). */
export interface OtherActivityData extends AdminFollow {
  kind: "autre-activite";
  name: string;
  description: string;
  prizes: string;
  phone: string;
  email: string;
}

export type AdminRequest = (WheelRequestData | OtherActivityData) & { id: string; createdAt: string };
export type AdminCall = Booking & AdminFollow & { slot: string; when: string };

/** Inscription « essai à ouvrir » tirée d'une demande « Créez-la pour moi ». */
export function wheelRequestSignup(p: WheelRequestData, requestId: string, now: Date, hasLogo: boolean): SignupRecord {
  const at = now.toISOString();
  return {
    id: crypto.randomUUID(),
    createdAt: at,
    firstName: p.name || p.shopName,
    email: p.email,
    phone: p.phone,
    shopName: p.shopName,
    establishment: { name: p.shopName, placeId: null, address: p.address || null, googleMapsUrl: /^https?:\/\//.test(p.google) ? p.google : null },
    trade: null,
    pack: p.pack ?? "croissance",
    wheelConfig: null,
    utm: { source: "Créez-la pour moi", medium: null, campaign: null, term: null, content: null, referrer: null, landingPath: "/creer-ma-roue#pour-moi" },
    consent: { accepted: true, date: at, text: consentText },
    status: "essai_en_attente",
    trialStartedAt: null,
    firstPlayAt: null,
    stripeCustomerId: null,
    offer: null,
    request: { requestId, address: p.address, google: p.google, prizes: p.prizes, message: p.message, logoName: p.logoName, hasLogo },
  };
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

/** Ne garde que les champs de suivi valides. */
export function parseFollow(b: Record<string, unknown> | null): AdminFollow {
  const out: AdminFollow = {};
  if (typeof b?.done === "boolean") out.done = b.done;
  const notes = clean(b?.notes, 2000);
  if (notes !== undefined) out.notes = notes;
  return out;
}

/* Demandes ------------------------------------------------------------------------------------- */

export async function listRequests(limit = 500): Promise<AdminRequest[]> {
  const db = await database();
  const { results } = await db.prepare("SELECT id, created_at, data FROM wheel_requests ORDER BY created_at DESC LIMIT ?").bind(limit).all<{ id: string; created_at: string; data: string }>();
  return results.map((r) => ({ ...(JSON.parse(r.data) as WheelRequestData | OtherActivityData), id: r.id, createdAt: r.created_at }));
}

async function getRequest(id: string): Promise<AdminRequest | null> {
  const db = await database();
  const r = await db.prepare("SELECT id, created_at, data FROM wheel_requests WHERE id = ?").bind(id).first<{ id: string; created_at: string; data: string }>();
  return r ? { ...(JSON.parse(r.data) as WheelRequestData | OtherActivityData), id: r.id, createdAt: r.created_at } : null;
}

async function writeRequest(r: AdminRequest): Promise<void> {
  const { id, createdAt: _c, ...data } = r;
  const db = await database();
  await db.prepare("UPDATE wheel_requests SET data = ? WHERE id = ?").bind(JSON.stringify(data), id).run();
}

export async function followRequest(id: string, follow: AdminFollow): Promise<boolean> {
  const r = await getRequest(id);
  if (!r) return false;
  await writeRequest({ ...r, ...follow } as AdminRequest);
  return true;
}

export async function deleteRequest(id: string): Promise<void> {
  const db = await database();
  await db.prepare("DELETE FROM wheel_requests WHERE id = ?").bind(id).run();
}

/**
 * Ajoute une ancienne demande « Créez-la pour moi » aux inscriptions (essai à ouvrir).
 * Sans effet si elle y est déjà. Renvoie l'identifiant de l'inscription.
 */
export async function requestToSignup(id: string, now = new Date()): Promise<string | null> {
  const r = await getRequest(id);
  if (!r || r.kind === "autre-activite") return null;
  if (r.signupId && (await getSignup(r.signupId))) return r.signupId;
  const signup = wheelRequestSignup(r, r.id, now, false);
  await saveSignup(signup);
  await writeRequest({ ...r, signupId: signup.id });
  return signup.id;
}

/* Appels réservés ----------------------------------------------------------------------------- */

export async function listCalls(limit = 500): Promise<AdminCall[]> {
  const db = await database();
  const { results } = await db.prepare("SELECT slot, data FROM bookings ORDER BY slot DESC LIMIT ?").bind(limit).all<{ slot: string; data: string }>();
  return results.map((r) => ({ ...(JSON.parse(r.data) as Booking & AdminFollow), slot: r.slot, when: formatSlot(r.slot) }));
}

export async function followCall(slot: string, follow: AdminFollow): Promise<boolean> {
  const db = await database();
  const row = await db.prepare("SELECT data FROM bookings WHERE slot = ?").bind(slot).first<{ data: string }>();
  if (!row) return false;
  await db.prepare("UPDATE bookings SET data = ? WHERE slot = ?").bind(JSON.stringify({ ...JSON.parse(row.data), ...follow }), slot).run();
  return true;
}

/** Annule un appel : le créneau redevient libre sur /rendez-vous. */
export async function deleteCall(slot: string): Promise<void> {
  const db = await database();
  await db.prepare("DELETE FROM bookings WHERE slot = ?").bind(slot).run();
}
