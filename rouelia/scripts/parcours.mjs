/**
 * Parcours de bout en bout dans Chromium, sur téléphone (375 px) et ordinateur (1440 px) :
 * captures des sections, démo (tirage, puis invitation facultative à l'avis), « Créez-la pour moi », rendez-vous, inscription.
 * Usage : npm run build && npm start, puis BASE_URL=http://localhost:3000 npm run e2e
 */
import { chromium } from "playwright";
const S = process.argv[2] ?? ".captures";
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
import { mkdirSync } from "node:fs";
mkdirSync(S, { recursive: true });
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const [name, w, h] of [["m", 375, 812], ["d", 1440, 900]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  await ctx.addInitScript(() => localStorage.setItem("rouelia-cookies", "refused"));
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await p.goto(BASE, { waitUntil: "networkidle" });
  for (const id of ["video", "fonctionnement", "pour-qui-teaser", "tarifs-title", "faq-title", "final-title"]) {
    await p.locator(`#${id}`).scrollIntoViewIfNeeded();
    await p.evaluate((id) => { const el = document.getElementById(id); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90); }, id);
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${S}/${name}-${id}.png` });
  }
  // Démo (parcours « Je crée ma roue moi-même ») : on joue directement, l'avis n'est proposé qu'après le gain.
  await p.goto(`${BASE}/creer-ma-roue#moi-meme`, { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.getByLabel("Nom du commerce").filter({ visible: true }).first().fill("Salon Martine");
  await p.getByRole("button", { name: "Tester comme un client" }).first().click();
  await p.waitForTimeout(600);
  if (await p.getByText("Partager votre avis, c'est facultatif").first().isVisible()) throw new Error("invitation à l'avis avant la roue");
  await p.getByRole("button", { name: "Tourner la roue" }).last().click();
  await p.waitForTimeout(7000);
  await p.screenshot({ path: `${S}/${name}-win.png` });
  console.log(name, "avis après le gain :", await p.getByText("Partager votre avis, c'est facultatif").first().isVisible());
  const live = await p.locator(`[aria-live="assertive"]`).filter({ hasText: "gagné" }).first().textContent();
  console.log(name, "annonce:", live);
  // « Créez-la pour moi » : erreurs puis envoi.
  await p.goto(`${BASE}/creer-ma-roue#pour-moi`, { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Envoyer ma demande" }).click();
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${S}/${name}-pour-moi-erreurs.png` });
  await p.locator("#pm-shopName").fill("Salon Martine");
  await p.locator("#pm-phone").fill("06 12 34 56 78");
  await p.locator("#pm-email").fill("martine@exemple.fr");
  await p.locator("#pm-address").fill("1 rue de Paris, 94500 Champigny");
  await p.locator("#pm-google").fill("Salon Martine Champigny");
  await p.locator("#pm-consent").check();
  await p.getByRole("button", { name: "Envoyer ma demande" }).click();
  await p.waitForTimeout(1500);
  console.log(name, "pour moi :", await p.getByText(/Vous recevrez votre QR code par e.mail/).isVisible());
  // Rendez-vous : premier créneau libre.
  await p.goto(`${BASE}/rendez-vous`, { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  await p.locator('ul button[aria-pressed="false"]:not([disabled])').filter({ hasText: " h " }).nth(name === "m" ? 2 : 4).click();
  await p.locator("#rdv-name").fill("Martine");
  await p.locator("#rdv-phone").fill("06 12 34 56 78");
  await p.locator("#rdv-email").fill("martine@exemple.fr");
  await p.locator("#rdv-consent").check();
  await p.getByRole("button", { name: "Réserver ce créneau" }).click();
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${S}/${name}-rdv.png` });
  console.log(name, "rendez-vous :", await p.getByText("C'est réservé.").isVisible());
  await p.goto(BASE, { waitUntil: "networkidle" });
  // Inscription
  await p.evaluate(() => document.getElementById("tarifs").scrollIntoView());
  await p.getByRole("button", { name: /Essayer Croissance, 49/ }).click();
  await p.waitForTimeout(400);
  await p.getByRole("button", { name: "Créer mon compte d'essai" }).click();
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${S}/${name}-signup-errors.png` });
  await p.getByRole("textbox", { name: "Prénom" }).fill("Martine");
  await p.getByRole("textbox", { name: "E-mail" }).fill("martine@exemple.fr");
  await p.getByRole("textbox", { name: "Téléphone" }).fill("06 12 34 56 78");
  await p.locator('input[type="checkbox"]').last().check();
  await p.getByRole("button", { name: "Créer mon compte d'essai" }).click();
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${S}/${name}-signup-ok.png` });
  console.log(name, "errors", errors, "sw", await p.evaluate(() => document.documentElement.scrollWidth));
  await ctx.close();
}
await b.close();
