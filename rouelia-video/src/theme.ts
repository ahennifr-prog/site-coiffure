import { staticFile } from "remotion";

export const C = {
  tomette: "#C4401F",
  deep: "#A33317",
  soft: "#F6D9CE",
  cream: "#FBF6EE",
  paper: "#FFFFFF",
  ink: "#1D1A16",
  inkSoft: "#5E564E",
  line: "#E8DFD2",
  safran: "#F3B23C",
  sauge: "#2E6150",
};

export const fontCss = `
@font-face { font-family: "Fraunces"; src: url("${staticFile("fonts/fraunces.woff2")}") format("woff2"); font-weight: 100 900; font-display: block; }
@font-face { font-family: "Figtree"; src: url("${staticFile("fonts/figtree.woff2")}") format("woff2"); font-weight: 300 900; font-display: block; }
`;

export const display = "Fraunces, Georgia, serif";
export const sans = "Figtree, Arial, sans-serif";

export interface Shop {
  name: string;
  short: string;
  colors: string[];
  rim: string;
  hub: string;
  prizes: string[];
  logo?: string;
  monogram: string;
  bg: string;
}

export const SHOPS: Shop[] = [
  { name: "ALIA coiffure", short: "Coiffure", colors: ["#1D1A16", "#E9C9B9", "#B5835A", "#FBF6EE"], rim: "#1D1A16", hub: "#1D1A16", prizes: ["Brushing offert", "Soin profond", "-10 % coupe", "Masque offert", "Échantillon", "Produit offert"], logo: "logo-ac.png", monogram: "AC", bg: "#F3E6DE" },
  { name: "Sushi Kai", short: "Restaurant", colors: ["#B8272E", "#F4EDE4", "#111111", "#D9A441"], rim: "#111111", hub: "#B8272E", prizes: ["Mochi offert", "Edamame", "-10 %", "Thé vert", "Maki offert", "Dessert"], monogram: "K", bg: "#F4E3DF" },
  { name: "Matcha Bar", short: "Coffee shop", colors: ["#5B8C3E", "#DDE8C8", "#2F4A24", "#F5F1E6"], rim: "#2F4A24", hub: "#5B8C3E", prizes: ["Matcha latte", "Cookie", "-15 %", "Taille XL", "Topping", "Mochi"], monogram: "M", bg: "#E6EEDB" },
  { name: "Studio Pilates", short: "Pilates", colors: ["#E8B4B8", "#F7EDE6", "#C98A8F", "#6E5A5C"], rim: "#6E5A5C", hub: "#C98A8F", prizes: ["Séance offerte", "Chaussettes", "-20 % carte", "Boisson", "Cours duo", "Serviette"], monogram: "P", bg: "#F6E4E5" },
  { name: "La Boutique", short: "Commerce", colors: ["#22324A", "#E9DCC3", "#C79A4B", "#FFFFFF"], rim: "#22324A", hub: "#C79A4B", prizes: ["-10 % achat", "Tote bag", "Paquet cadeau", "Accessoire", "-5 €", "Surprise"], monogram: "B", bg: "#E4E7EC" },
];

export const ROUELIA_WHEEL = {
  colors: [C.tomette, C.cream, C.safran, C.sauge],
  prizes: ["Café offert", "-10 %", "Dessert", "Soin offert", "Cadeau", "Surprise", "-20 %", "Boisson"],
};
