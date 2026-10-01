import { listSignups } from "@/lib/db";
import { requireAdmin } from "@/lib/http";
import { offerSummary } from "@/lib/offers";

const STATUS: Record<string, string> = { essai_en_attente: "Essai à ouvrir", essai_en_cours: "Essai en cours", client: "Client", perdu: "Perdu" };

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const rows = await listSignups(5000);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    ["Date", "Prénom", "E-mail", "Téléphone", "Commerce", "Métier", "Pack", "Statut", "Lots", "Coût moyen par partie", "Cadeau de la roue", "Source", "Campagne"],
    ...rows.map((r) => [
      r.createdAt.slice(0, 16).replace("T", " "),
      r.firstName,
      r.email,
      r.phone,
      r.shopName,
      r.trade ?? "",
      r.pack,
      STATUS[r.status] ?? r.status,
      r.wheelConfig?.prizes.map((p) => `${p.name} (${p.percent} %)`).join(" / ") ?? "",
      r.wheelConfig ? String(r.wheelConfig.averageCost).replace(".", ",") : "",
      r.offer ? offerSummary(r.offer) : "",
      r.utm.source ?? r.utm.referrer ?? "",
      r.utm.campaign ?? "",
    ]),
  ];
  const csv = "﻿" + lines.map((l) => l.map(esc).join(";")).join("\r\n");
  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="rouelia-inscriptions.csv"', "Cache-Control": "no-store" },
  });
}
