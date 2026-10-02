import { SHOP_COOKIE } from "@/lib/espace";
import { json } from "@/lib/http";

export async function POST() {
  const res = json({ ok: true });
  res.cookies.set({ name: SHOP_COOKIE, value: "", path: "/", maxAge: 0 });
  return res;
}
