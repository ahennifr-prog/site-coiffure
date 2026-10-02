import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export function clientIp(req: Request): string {
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const b = await req.json();
    return b && typeof b === "object" ? (b as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function requireAdmin(): Promise<NextResponse | null> {
  return (await isAdmin()) ? null : json({ ok: false, error: "non_connecte" }, 401);
}

/** Le commerce connecté à l'espace, ou une réponse 401. */
export async function requireShop(): Promise<{ shop: import("@/lib/shops").Shop; denied: null } | { shop: null; denied: NextResponse }> {
  const { currentShop } = await import("@/lib/espace");
  const shop = await currentShop();
  return shop ? { shop, denied: null } : { shop: null, denied: json({ ok: false, error: "non_connecte" }, 401) };
}
