/** Appel à l'API de l'espace commerçant. Une session expirée renvoie vers la connexion. */
export async function api<T = Record<string, unknown>>(url: string, init?: RequestInit): Promise<T & { ok: boolean; error?: string }> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  if (res.status === 401) {
    window.location.href = "/espace/connexion";
    throw new Error("non_connecte");
  }
  return res.json();
}

export const STATUS_LABEL = {
  valable: { label: "Valable", cls: "bg-sauge-soft text-sauge" },
  pas_encore: { label: "Pas encore", cls: "bg-safran-soft text-ink" },
  retire: { label: "Retiré", cls: "bg-line text-ink-soft" },
  expire: { label: "Expiré", cls: "bg-danger/10 text-danger" },
} as const;

export const card = "rounded-xl bg-paper p-5 shadow-sm ring-1 ring-line sm:p-6";
export const input = "min-h-12 w-full rounded-lg bg-cream px-4 ring-1 ring-line outline-none focus:ring-2 focus:ring-tomette";
