import { beforeEach, describe, expect, it } from "vitest";
import { setTestDb } from "@/lib/db";
import { bookingIcs, buildCalendar, formatSlot, parisToDate, parseBooking, reserve, takenSlots } from "@/lib/bookings";
import { sqliteD1 } from "./sqlite";

// Jeudi 8 octobre 2026, 10 h à Paris (heure d'été, UTC+2).
const now = new Date("2026-10-08T08:00:00Z");
const input = { name: "Martine", phone: "06 12 34 56 78", email: "martine@salon.fr", shop: "Salon", consent: true };

beforeEach(() => setTestDb(sqliteD1()));

describe("rendez-vous", () => {
  it("convertit l'heure de Paris, été comme hiver", () => {
    expect(parisToDate("2026-10-08", "12:00").toISOString()).toBe("2026-10-08T10:00:00.000Z");
    expect(parisToDate("2026-11-10", "12:00").toISOString()).toBe("2026-11-10T11:00:00.000Z");
  });

  it("propose 14 jours, du lundi au vendredi, 12 h à 14 h et 18 h à 20 h, par 5 minutes", () => {
    const days = buildCalendar(now, new Set());
    expect(days).toHaveLength(14);
    const thu = days[0];
    expect(thu.slots[0].id).toBe("2026-10-08T12:00");
    expect(thu.slots).toHaveLength(48);
    expect(thu.slots.at(-1)?.time).toBe("19:55");
    expect(days.find((d) => d.day === "2026-10-10")?.slots).toHaveLength(0); // samedi
  });

  it("respecte le délai minimum de 2 heures", () => {
    const at13 = new Date("2026-10-08T11:00:00Z"); // 13 h à Paris
    expect(buildCalendar(at13, new Set())[0].slots[0].id).toBe("2026-10-08T18:00");
  });

  it("empêche la double réservation d'un créneau", async () => {
    const a = await reserve({ ...input, slot: "2026-10-09T12:05" }, now);
    expect(a.ok).toBe(true);
    const b = await reserve({ ...input, email: "autre@x.fr", slot: "2026-10-09T12:05" }, now);
    expect(b).toEqual({ ok: false, error: "taken" });
    expect((await takenSlots(now)).has("2026-10-09T12:05")).toBe(true);
    expect(buildCalendar(now, await takenSlots(now))[1].slots.find((s) => s.id === "2026-10-09T12:05")?.free).toBe(false);
  });

  it("refuse un créneau fermé ou passé", async () => {
    expect(await reserve({ ...input, slot: "2026-10-10T12:00" }, now)).toEqual({ ok: false, error: "closed" });
    expect(await reserve({ ...input, slot: "2026-10-08T09:00" }, now)).toEqual({ ok: false, error: "closed" });
  });

  it("valide les champs et produit un .ics", async () => {
    expect(parseBooking({ name: "", phone: "12", email: "x", slot: "demain", consent: false })).toEqual({ ok: false, errors: ["name", "phone", "email", "slot", "consent"] });
    const r = await reserve({ ...input, slot: "2026-10-12T18:30" }, now);
    if (!r.ok) throw new Error();
    const ics = bookingIcs(r.booking, now);
    expect(ics).toContain("DTSTART:20261012T163000Z");
    expect(ics).toContain("DTEND:20261012T163500Z");
    expect(formatSlot("2026-10-12T18:30")).toBe("lundi 12 octobre à 18 h 30");
  });
});
