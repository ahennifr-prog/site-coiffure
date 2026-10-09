import { bookingIcs, buildCalendar, formatSlot, parseBooking, reserve, takenSlots } from "@/lib/bookings";
import { hit } from "@/lib/game";
import { clientIp, json, readJson } from "@/lib/http";
import { sendMail } from "@/lib/mail";
import { bookingAlertMail, bookingConfirmMail } from "@/lib/mail-templates";
import { countEvent } from "@/lib/mesure";

/** Créneaux des 14 prochains jours, heure de Paris. */
export async function GET() {
  const now = new Date();
  try {
    return json({ ok: true, days: buildCalendar(now, await takenSlots(now)) });
  } catch (e) {
    console.error("[rendez-vous] lecture impossible", e);
    return json({ ok: false, error: "storage" }, 500);
  }
}

/** Réservation d'un créneau : enregistrement, alerte à contact@ et confirmation au client avec .ics. */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return json({ ok: false, error: "invalid_json" }, 400);
  // Champ piège invisible : seuls les robots le remplissent.
  if (body.website) return json({ ok: true });

  const parsed = parseBooking(body);
  if (!parsed.ok) return json({ ok: false, errors: parsed.errors }, 422);

  const now = new Date();
  try {
    if ((await hit(`rdv:${clientIp(req)}`, now)) > 10) return json({ ok: false, error: "rate" }, 429);
    const r = await reserve(parsed.input, now);
    if (!r.ok) return json({ ok: false, error: r.error }, 409);
    const b = r.booking;
    const when = formatSlot(b.slot);
    await countEvent("rdv_reserve", now);
    await Promise.all([
      sendMail(bookingAlertMail({ name: b.name, phone: b.phone, email: b.email, shop: b.shop, when })),
      sendMail(bookingConfirmMail({ name: b.name, email: b.email, phone: b.phone, when, ics: bookingIcs(b, now) })),
    ]);
    return json({ ok: true, when }, 201);
  } catch (e) {
    console.error("[rendez-vous] réservation impossible", e);
    return json({ ok: false, error: "storage" }, 500);
  }
}
