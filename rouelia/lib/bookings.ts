/**
 * Appels de découverte de 5 minutes (page /rendez-vous).
 * Créneaux calculés à l'heure de Paris à partir de BOOKING (config.ts), réservations dans D1 (table bookings).
 */
import { BOOKING, EMAIL } from "@/config";
import { addDays, parisDay } from "@/lib/dates";
import { database } from "@/lib/db";
import { isEmail, normalizeFrenchPhone } from "@/lib/signup";

const TZ = "Europe/Paris";

/** Décalage de Paris par rapport à UTC (en minutes) à un instant donné. */
function parisOffset(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const wall = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return Math.round((wall - Math.floor(at.getTime() / 60000) * 60000) / 60000);
}

/** Instant UTC d'une heure de Paris (« 2026-10-09 », « 12:05 »). */
export function parisToDate(day: string, time: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  let at = new Date(guess - parisOffset(new Date(guess)) * 60000);
  at = new Date(guess - parisOffset(at) * 60000);
  return at;
}

const toMinutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const toTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** Jour de la semaine (1 = lundi) d'une date AAAA-MM-JJ. */
function weekday(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  return ((new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7) + 1;
}

export interface Slot {
  /** Identifiant : « AAAA-MM-JJTHH:MM », heure de Paris. */
  id: string;
  time: string;
  free: boolean;
}
export interface Day {
  day: string;
  slots: Slot[];
}

/** Les 14 prochains jours et leurs créneaux, pris ou non. Les jours sans créneau ouvert sont gardés (vides). */
export function buildCalendar(now: Date, taken: Set<string>, config = BOOKING): Day[] {
  const today = parisDay(now);
  const earliest = now.getTime() + config.minNoticeHours * 3_600_000;
  const days: Day[] = [];
  for (let i = 0; i < config.daysAhead; i++) {
    const day = addDays(today, i);
    const slots: Slot[] = [];
    if (!config.blockedDays.includes(day)) {
      for (const [from, to] of config.hours[weekday(day)] ?? []) {
        for (let m = toMinutes(from); m + config.slotMinutes <= toMinutes(to); m += config.slotMinutes) {
          const time = toTime(m);
          if (parisToDate(day, time).getTime() < earliest) continue;
          const id = `${day}T${time}`;
          slots.push({ id, time, free: !taken.has(id) });
        }
      }
    }
    days.push({ day, slots });
  }
  return days;
}

export function isOpenSlot(id: string, now: Date, config = BOOKING): boolean {
  return buildCalendar(now, new Set(), config).some((d) => d.slots.some((s) => s.id === id));
}

export async function takenSlots(now: Date): Promise<Set<string>> {
  const db = await database();
  const { results } = await db.prepare("SELECT slot FROM bookings WHERE slot >= ?").bind(`${parisDay(now)}T00:00`).all<{ slot: string }>();
  return new Set(results.map((r) => r.slot));
}

export interface BookingInput {
  name: string;
  phone: string;
  email: string;
  shop: string;
  slot: string;
  consent: boolean;
}
export type BookingField = "name" | "phone" | "email" | "slot" | "consent";

const str = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function parseBooking(body: Record<string, unknown>): { ok: true; input: BookingInput } | { ok: false; errors: BookingField[] } {
  const input: BookingInput = {
    name: str(body.name, 80),
    phone: str(body.phone, 30),
    email: str(body.email, 200).toLowerCase(),
    shop: str(body.shop, 120),
    slot: str(body.slot, 16),
    consent: body.consent === true,
  };
  const errors: BookingField[] = [];
  if (!input.name) errors.push("name");
  if (!normalizeFrenchPhone(input.phone)) errors.push("phone");
  if (!isEmail(input.email)) errors.push("email");
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input.slot)) errors.push("slot");
  if (!input.consent) errors.push("consent");
  return errors.length ? { ok: false, errors } : { ok: true, input };
}

export interface Booking extends BookingInput {
  createdAt: string;
  start: string;
  end: string;
}

/** Enregistre la réservation. « taken » si le créneau vient d'être pris, « closed » s'il n'est pas ouvert. */
export async function reserve(input: BookingInput, now = new Date()): Promise<{ ok: true; booking: Booking } | { ok: false; error: "taken" | "closed" }> {
  if (!isOpenSlot(input.slot, now)) return { ok: false, error: "closed" };
  const [day, time] = input.slot.split("T");
  const start = parisToDate(day, time);
  const booking: Booking = {
    ...input,
    phone: normalizeFrenchPhone(input.phone) ?? input.phone,
    createdAt: now.toISOString(),
    start: start.toISOString(),
    end: new Date(start.getTime() + BOOKING.slotMinutes * 60000).toISOString(),
  };
  const db = await database();
  try {
    await db.prepare("INSERT INTO bookings (slot, created_at, email, data) VALUES (?, ?, ?, ?)").bind(input.slot, booking.createdAt, booking.email, JSON.stringify(booking)).run();
  } catch {
    return { ok: false, error: "taken" };
  }
  return { ok: true, booking };
}

/** « vendredi 9 octobre à 12 h 05 » */
export function formatSlot(id: string): string {
  const [day, time] = id.split("T");
  const date = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${day}T12:00:00Z`));
  return `${date} à ${time.replace(":", " h ")}`;
}

const icsDate = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** Invitation de calendrier (.ics) pour le client. */
export function bookingIcs(b: Booking, now = new Date()): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rouelia//Rendez-vous//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${b.slot}@rouelia.fr`,
    `DTSTAMP:${icsDate(now.toISOString())}`,
    `DTSTART:${icsDate(b.start)}`,
    `DTEND:${icsDate(b.end)}`,
    `SUMMARY:${icsText("Appel découverte Rouelia (5 minutes)")}`,
    `DESCRIPTION:${icsText(`Nous vous appelons au ${b.phone}. Pour décaler : ${EMAIL}`)}`,
    `ORGANIZER;CN=Rouelia:mailto:${EMAIL}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

