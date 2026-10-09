import { getSignupLogo } from "@/lib/db";
import { requireAdmin } from "@/lib/http";

/** Logo envoyé avec une demande « Créez-la pour moi » (?id=inscription, &telecharger=1 pour l'enregistrer). */
export async function GET(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const url = new URL(req.url);
  const data = await getSignupLogo(url.searchParams.get("id") ?? "");
  const m = data ? /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(data) : null;
  if (!m) return new Response(null, { status: 404 });
  const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
  const ext = m[1].split("/")[1].replace("svg+xml", "svg").replace("jpeg", "jpg");
  return new Response(bytes, {
    headers: {
      "Content-Type": m[1],
      "Cache-Control": "private, no-store",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
      ...(url.searchParams.get("telecharger") ? { "Content-Disposition": `attachment; filename="logo.${ext}"` } : {}),
    },
  });
}
