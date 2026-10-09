import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/http";
import { shopCookie, shopSessionToken } from "@/lib/espace";
import { getShop, sessionVersion } from "@/lib/shops";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Ouvre l'espace du commerçant depuis l'admin, pour préparer sa roue (« Créez-la pour moi ») ou l'aider.
 * Le navigateur de l'admin devient connecté à cet espace (le commerçant, lui, garde sa propre connexion).
 */
export async function GET(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const id = (await params).id;
  const shop = await getShop(id);
  const version = shop ? await sessionVersion(shop.id) : null;
  if (!shop || version === null) return NextResponse.redirect(new URL("/admin", req.url));
  const res = NextResponse.redirect(new URL("/espace#roue", req.url));
  res.cookies.set(shopCookie(shopSessionToken(shop.id, version)));
  return res;
}
