import { cookies } from "next/headers";
import { checkWith, signWith } from "@/lib/auth";
import { getShop, sessionVersion, type Shop } from "@/lib/shops";

export const SHOP_COOKIE = "rouelia_espace";
const MAX_AGE = 60 * 60 * 24 * 60;

/** Jeton de session : commerce, version de session (changée à chaque nouveau mot de passe) et date de fin. */
export function shopSessionToken(shopId: string, version: number, now = Date.now()): string {
  const payload = `${shopId}.${version}.${now + MAX_AGE * 1000}`;
  return `${payload}.${signWith("espace", payload)}`;
}

export function readShopSession(token: string | undefined, now = Date.now()): { shopId: string; version: number } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [shopId, version, exp, sig] = parts;
  const payload = `${shopId}.${version}.${exp}`;
  if (!checkWith("espace", payload, sig) || Number(exp) < now) return null;
  return { shopId, version: Number(version) };
}

export const shopCookie = (token: string) => ({
  name: SHOP_COOKIE,
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE,
});

/** Le commerce connecté, ou null. */
export async function currentShop(): Promise<Shop | null> {
  const c = await cookies();
  const s = readShopSession(c.get(SHOP_COOKIE)?.value);
  if (!s) return null;
  if ((await sessionVersion(s.shopId)) !== s.version) return null;
  return getShop(s.shopId);
}
