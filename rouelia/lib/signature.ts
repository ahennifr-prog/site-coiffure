/** « L'équipe d'ALIA coiffure », « L'équipe de Salon Martine ». */
export const defaultSignature = (name: string) => `L'équipe ${/^[aeiouyhàâäéèêëîïôöûüAEIOUYHÀÂÉÈÊÎÔÛ]/.test(name) ? "d'" : "de "}${name}`;
