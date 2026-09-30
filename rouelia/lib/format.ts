const NBSP = " ";
const NNBSP = " ";

/** Rend insécables les espaces qui précèdent la ponctuation haute et suivent les guillemets. */
export function fr(text: string): string {
  return text
    .replace(/ ([%€:;?!»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/(\d) (\d{3})\b/g, `$1${NNBSP}$2`)
    // Trait d'union insécable dans les mots composés (« Tournez-la », « week-end »).
    .replace(/(\p{L})-(\p{L})/gu, "$1\u2011$2");
}

const euro0 = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const euro2 = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const int = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export const formatEuro = (v: number) => euro0.format(Math.round(v));
export const formatEuroCents = (v: number) => euro2.format(v);
export const formatInt = (v: number) => int.format(Math.round(v));
export const formatPercent = (v: number) => `${int.format(Math.round(v))}${NBSP}%`;

/** Prix : sans décimales s'il est rond, avec centimes sinon. */
export const formatPrice = (v: number) => (Number.isInteger(v) ? formatEuro(v) : formatEuroCents(v));

export function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(d);
}
