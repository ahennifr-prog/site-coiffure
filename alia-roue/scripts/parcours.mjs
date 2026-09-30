/**
 * Parcours complet dans Chromium : cliente sur téléphone (scan, avis, infos, roue, cadeau),
 * puis gérante (connexion, caisse, validation, suivi, réglages, QR code).
 * Usage : BASE_URL=http://localhost:3000 ADMIN_PASSWORD=... node scripts/parcours.mjs [dossier-captures]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const S = process.argv[2] ?? ".captures";
mkdirSync(S, { recursive: true });
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const errors = [];

async function cliente(name, viewport, phone) {
  const ctx = await b.newContext({ viewport, hasTouch: name === "m", isMobile: name === "m" });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
  p.on("console", (m) => m.type() === "error" && errors.push(`${name}: ${m.text()}`));
  await p.goto(BASE, { waitUntil: "load" });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${S}/${name}-1-accueil.png` });
  await p.getByRole("button", { name: "Jouer" }).click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${S}/${name}-2-avis.png` });
  await p.getByRole("button", { name: "Fermer" }).click();
  await p.waitForTimeout(500);
  await p.getByRole("button", { name: "Accéder à la roue" }).click();
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${S}/${name}-3-erreurs.png` });
  await p.locator("#prenom").fill("Sarah");
  await p.locator("#tel").fill(phone);
  await p.locator("#accord").check();
  await p.getByRole("button", { name: "Accéder à la roue" }).click();
  await p.getByRole("button", { name: "Tourner la roue" }).last().waitFor();
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${S}/${name}-4-roue.png` });
  await p.getByRole("button", { name: "Tourner la roue" }).last().click();
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${S}/${name}-5-rotation.png` });
  await p.getByText("Voici votre cadeau.").waitFor({ timeout: 10000 });
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${S}/${name}-6-cadeau.png`, fullPage: true });
  const code = (await p.locator("p.font-mono.text-2xl, p.tabular.font-mono").first().textContent())?.trim();
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  // Rejouer avec le même numéro : même code
  await p.goto(BASE, { waitUntil: "load" });
  await p.screenshot({ path: `${S}/${name}-7-retour.png` });
  await ctx.close();
  return { code, sw };
}

const m = await cliente("m", { width: 390, height: 844 }, `06 11 22 ${String(Date.now()).slice(-4, -2)} ${String(Date.now()).slice(-2)}`);
const d = await cliente("d", { width: 1440, height: 900 }, `07 55 66 ${String(Date.now() + 7).slice(-4, -2)} ${String(Date.now() + 7).slice(-2)}`);
console.log("codes", m.code, d.code, "scrollWidth", m.sw, d.sw);

// Gérante, sur téléphone
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
p.on("pageerror", (e) => errors.push(`admin: ${e.message}`));
await p.goto(`${BASE}gestion`, { waitUntil: "load" });
await p.screenshot({ path: `${S}/a-1-connexion.png` });
await p.locator("#mdp").fill("mauvais");
await p.getByRole("button", { name: "Se connecter" }).click();
await p.getByText("Mot de passe incorrect.").waitFor();
await p.locator("#mdp").fill(process.env.ADMIN_PASSWORD ?? "");
await p.getByRole("button", { name: "Se connecter" }).click();
await p.getByRole("heading", { name: "Valider un cadeau" }).waitFor();
await p.locator("#code").fill(m.code);
await p.getByRole("button", { name: "Vérifier le code" }).click();
await p.waitForTimeout(500);
await p.screenshot({ path: `${S}/a-2-caisse.png` });
for (const [tab, file] of [["Suivi", "a-3-suivi"], ["Roue", "a-4-roue"], ["QR code", "a-5-qr"]]) {
  await p.getByRole("button", { name: tab }).last().click();
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${S}/${file}.png` });
}
await p.getByRole("button", { name: "Roue" }).last().click();
await p.waitForTimeout(500);
await p.locator("#bigrate").fill("25");
await p.getByRole("button", { name: "Enregistrer" }).click();
await p.getByText("Enregistré.").waitFor();
await p.screenshot({ path: `${S}/a-6-enregistre.png` });
console.log("erreurs", errors);
await b.close();
