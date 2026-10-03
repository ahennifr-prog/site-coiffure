import { codeStatus, formatDay } from "@/lib/dates";
import { listPlays } from "@/lib/game";
import { requireShop } from "@/lib/http";

const STATUS = { retire: "Retiré", expire: "Expiré", pas_encore: "Pas encore utilisable", valable: "Valable" };

/** Export des parties pour Excel (séparateur point-virgule). */
export async function GET() {
  const { shop, denied } = await requireShop();
  if (denied) return denied;
  const plays = await listPlays(shop);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const phone = (e164: string) => "0" + e164.replace("+33", "");
  const rows = [
    ["Date", "Prénom", "Téléphone", "Accepte d'être recontacté", "Cadeau", "Gros cadeau", "Code", "Valable du", "Jusqu'au", "Statut", "Retiré le", "Validé par", "Invité par", "Roue"],
    ...plays.map((p) => [
      p.createdAt.slice(0, 16).replace("T", " "),
      p.firstName,
      phone(p.phone),
      p.marketing ? "Oui" : "Non",
      p.prizeName,
      p.big ? "Oui" : "Non",
      p.code,
      formatDay(p.validFrom),
      formatDay(p.expiresOn),
      STATUS[codeStatus(p)],
      p.redeemedAt ? p.redeemedAt.slice(0, 16).replace("T", " ") : "",
      p.redeemedBy ?? "",
      p.referredBy ?? "",
      p.wheelName ?? "",
    ]),
  ];
  const csv = "﻿" + rows.map((r) => r.map(esc).join(";")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${shop.slug}-parties.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
