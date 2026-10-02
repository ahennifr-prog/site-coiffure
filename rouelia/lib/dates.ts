const TZ = "Europe/Paris";

/** Date du jour à Paris, au format AAAA-MM-JJ. */
export function parisDay(d: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

/** « 1 octobre 2026 » */
export function formatDay(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  const txt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
  // En français, on écrit « 1er octobre ».
  return d === 1 ? txt.replace(/^1 /, "1er ") : txt;
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export type CodeStatus = "retire" | "expire" | "pas_encore" | "valable";

export function codeStatus(p: { validFrom: string; expiresOn: string; redeemedAt: string | null }, today = parisDay()): CodeStatus {
  if (p.redeemedAt) return "retire";
  if (today > p.expiresOn) return "expire";
  if (today < p.validFrom) return "pas_encore";
  return "valable";
}
