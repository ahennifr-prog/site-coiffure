import { listPlays } from "@/lib/game";
import { requireAdmin } from "@/lib/http";
import { codeStatus } from "@/lib/dates";
import { displayPhone } from "@/lib/phone";

const STATUS = { retire: "Retiré", expire: "Expiré", pas_encore: "Pas encore valable", valable: "Valable" };

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const plays = await listPlays(5000);
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = [
    ["Date", "Prénom", "Téléphone", "Cadeau", "Type", "Code", "Valable du", "Jusqu'au", "Statut", "Retiré le"],
    ...plays.map((p) => [
      p.createdAt.slice(0, 16).replace("T", " "),
      p.firstName,
      displayPhone(p.phone),
      p.prizeName,
      p.tier === "gros" ? "Gros cadeau" : "Petit cadeau",
      p.code,
      p.validFrom,
      p.expiresOn,
      STATUS[codeStatus(p)],
      p.redeemedAt ? p.redeemedAt.slice(0, 16).replace("T", " ") : "",
    ]),
  ];
  const csv = "﻿" + rows.map((r) => r.map((c) => esc(String(c))).join(";")).join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="alia-cadeaux.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
