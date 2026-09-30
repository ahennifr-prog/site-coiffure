/** Normalise un numéro français au format +33XXXXXXXXX, ou null s'il n'est pas valide. */
export function normalizeFrenchPhone(input: string): string | null {
  let digits = input.replace(/[\s.\-()]/g, "");
  if (digits.startsWith("+33")) digits = digits.slice(3);
  else if (digits.startsWith("0033")) digits = digits.slice(4);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.length === 10 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length !== 9 || digits.startsWith("0")) return null;
  return `+33${digits}`;
}

/** « 06 12 34 56 78 » */
export function displayPhone(e164: string): string {
  const n = "0" + e164.replace("+33", "");
  return n.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
