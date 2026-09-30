import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "rouelia_admin";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret(): string | null {
  const s = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  return s ? `rouelia:${s}` : null;
}

export function passwordConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sign(payload: string): string {
  return createHmac("sha256", secret() ?? "").update(payload).digest("base64url");
}

export function createSessionToken(now = Date.now()): string {
  const exp = String(now + MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < now) return false;
  const expected = sign(exp);
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return verifySessionToken(c.get(SESSION_COOKIE)?.value);
}

export const sessionCookie = (token: string) => ({
  name: SESSION_COOKIE,
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: MAX_AGE,
});
