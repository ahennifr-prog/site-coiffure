import { beforeEach, describe, expect, it } from "vitest";
import { setTestDb } from "@/lib/db";
import { countEvent, siteCounts } from "@/lib/mesure";
import { isClientEvent } from "@/lib/mesure-events";
import { eventForHref } from "@/components/ui/Mesure";
import { sqliteD1 } from "./sqlite";

beforeEach(() => setTestDb(sqliteD1()));

describe("mesure sans cookie", () => {
  it("reconnaît les liens à compter", () => {
    expect(eventForHref("/creer-ma-roue")).toBe("creer_ma_roue_clic");
    expect(eventForHref("https://wa.me/33600000000?text=Bonjour")).toBe("whatsapp_clic");
    expect(eventForHref("#tarifs")).toBe("tarifs_clic");
    expect(eventForHref("/tarifs")).toBe("tarifs_clic");
    expect(eventForHref("/blog")).toBeNull();
    expect(eventForHref("https://exemple.fr/creer-ma-roue")).toBeNull();
  });

  it("n'accepte du navigateur que les événements autorisés", () => {
    expect(isClientEvent("scroll_50")).toBe(true);
    expect(isClientEvent("essai_envoye")).toBe(false);
    expect(isClientEvent("<script>")).toBe(false);
  });

  it("compte par jour, sans autre donnée", async () => {
    const now = new Date("2026-10-09T10:00:00Z");
    await countEvent("whatsapp_clic", now);
    await countEvent("whatsapp_clic", now);
    await countEvent("rdv_reserve", now);
    const counts = await siteCounts(30, now);
    expect(counts.find((c) => c.id === "whatsapp_clic")).toMatchObject({ last7: 2, last30: 2 });
    expect(counts.find((c) => c.id === "rdv_reserve")?.last30).toBe(1);
  });
});
