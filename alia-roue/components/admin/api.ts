export async function api<T = Record<string, unknown>>(url: string, init?: RequestInit): Promise<T & { ok: boolean; error?: string }> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  if (res.status === 401) {
    window.location.reload();
    throw new Error("non_connecte");
  }
  return res.json();
}

export const STATUS_LABEL = {
  valable: { label: "Valable", cls: "bg-vert/15 text-vert" },
  pas_encore: { label: "Dès demain", cls: "bg-lilas/15 text-lilas" },
  retire: { label: "Retiré", cls: "bg-white/10 text-argent" },
  expire: { label: "Expiré", cls: "bg-alerte/15 text-alerte" },
} as const;
