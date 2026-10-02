import { getLogo, getShopBySlug } from "@/lib/shops";

/** Logo du commerce, mis en cache longtemps (l'adresse change à chaque nouveau logo). */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const shop = await getShopBySlug((await params).slug);
  const data = shop?.settings.hasLogo ? await getLogo(shop.id) : null;
  const m = data?.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
  if (!m) return new Response("Introuvable", { status: 404 });
  const type = m[1].toLowerCase();
  return new Response(Buffer.from(m[2], "base64"), {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable",
      // Un SVG envoyé par un commerçant ne doit jamais exécuter de script.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
