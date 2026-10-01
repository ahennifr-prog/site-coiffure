import { admin, offerWheel, type OfferId, type PackId } from "@/content";
import { generateCode, pickWeighted } from "@/lib/wheel";
import type { SignupOffer } from "@/lib/signup";

export const OFFER_IDS = offerWheel.offers.map((o) => o.id);
const DAY = 24 * 60 * 60 * 1000;

export function offerById(id: OfferId) {
  return offerWheel.offers.find((o) => o.id === id) ?? offerWheel.offers[0];
}

/** Cadeau tiré par le serveur, tel qu'il est gardé dans le navigateur. */
export interface WonOffer {
  id: OfferId;
  code: string;
  wonAt: string;
  expiresAt: string;
  /** Jeton signé par le serveur : seul lui fait foi à l'inscription. */
  token: string;
}

/**
 * Ce que devient le cadeau selon le pack choisi :
 * - applied : appliqué tel quel (ou remplacé, voir `id`) ;
 * - needs_croissance : pack Essentiel, le cadeau n'est valable que sur Croissance et Premium ;
 * - needs_premium : « Premium au prix de Croissance » choisi avec le pack Croissance.
 */
export type OfferStatus = "applied" | "needs_croissance" | "needs_premium";

export interface ResolvedOffer {
  status: OfferStatus;
  /** Cadeau réellement appliqué (l'audit devient l'installation en Premium). */
  id: OfferId;
  substituted: boolean;
}

export function resolveOffer(id: OfferId, pack: PackId): ResolvedOffer {
  if (pack === "essentiel") return { status: "needs_croissance", id, substituted: false };
  if (id === "premium_prix_croissance" && pack !== "premium") return { status: "needs_premium", id, substituted: false };
  // L'audit de la fiche Google est déjà inclus dans Premium : on offre l'installation à la place.
  if (id === "audit" && pack === "premium") return { status: "applied", id: "installation", substituted: true };
  return { status: "applied", id, substituted: false };
}

/** Pack conseillé à l'ouverture de l'inscription après un gain. */
export function suggestedPack(id: OfferId): PackId {
  return id === "premium_prix_croissance" ? "premium" : "croissance";
}

/** Tirage pondéré selon les chances de content.ts. */
export function drawOffer(rand: () => number, now: Date): Omit<WonOffer, "token"> {
  const offer = offerWheel.offers[pickWeighted(offerWheel.offers, rand)];
  return {
    id: offer.id,
    code: generateCode(offerWheel.codePrefix, rand),
    wonAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + offerWheel.validityDays * DAY).toISOString(),
  };
}

type Signer = { sign: (payload: string) => string; check: (payload: string, sig: string) => boolean };

export function offerToken(o: Omit<WonOffer, "token">, signer: Signer): string {
  const payload = Buffer.from(JSON.stringify({ i: o.id, c: o.code, w: o.wonAt, e: o.expiresAt })).toString("base64url");
  return `${payload}.${signer.sign(payload)}`;
}

/** Vérifie un jeton de cadeau. Renvoie null s'il est faux, modifié ou expiré. */
export function readOfferToken(token: unknown, signer: Signer, now: Date): Omit<WonOffer, "token"> | null {
  if (typeof token !== "string" || token.length > 600) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !signer.check(payload, sig)) return null;
  try {
    const d = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Record<string, unknown>;
    if (!OFFER_IDS.includes(d.i as OfferId) || typeof d.c !== "string" || typeof d.w !== "string" || typeof d.e !== "string") return null;
    if (new Date(d.e).getTime() < now.getTime()) return null;
    return { id: d.i as OfferId, code: d.c, wonAt: d.w, expiresAt: d.e };
  } catch {
    return null;
  }
}

/** Rattache le cadeau à l'inscription si le jeton est valide, en appliquant les règles du pack. */
export function offerForSignup(token: unknown, pack: PackId, signer: Signer, now: Date): SignupOffer | null {
  const won = readOfferToken(token, signer, now);
  if (!won) return null;
  const r = resolveOffer(won.id, pack);
  return { wonId: won.id, id: r.id, code: won.code, wonAt: won.wonAt, expiresAt: won.expiresAt, status: r.status };
}

/** Résumé d'un cadeau pour l'espace admin et l'export. */
export function offerSummary(o: SignupOffer): string {
  const date = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long" }).format(new Date(o.expiresAt));
  const parts = [offerById(o.id).label];
  if (o.id !== o.wonId) parts.push(admin.offer.substituted);
  parts.push(admin.offer.status[o.status], o.code, admin.offer.until(date));
  return parts.join(" · ");
}
