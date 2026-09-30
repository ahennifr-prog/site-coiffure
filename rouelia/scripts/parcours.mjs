/**
 * Parcours de bout en bout dans Chromium, sur téléphone (375 px) et ordinateur (1440 px) :
 * captures de chaque section, démo (invitation à l'avis, tirage, écran de gain), inscription.
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
  for (const id of ["probleme-title", "demo-title", "fonctionnement-title", "fonctions-title", "simulateur-title", "fondateur-title", "tarifs-title", "accompagnement-title", "faq-title", "final-title"]) {
    await p.locator(`#${id}`).scrollIntoViewIfNeeded();
    await p.evaluate((id) => { const el = document.getElementById(id); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90); }, id);
    await p.waitForTimeout(700);
    await p.screenshot({ path: `${S}/${name}-${id}.png` });
  }
  // Démo
  await p.evaluate(() => document.getElementById("demo").scrollIntoView());
  await p.waitForTimeout(500);
  await p.getByLabel("Nom du commerce").fill("Salon Martine");
  await p.getByRole("button", { name: "Tester comme un client" }).first().click();
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${S}/${name}-review.png` });
  await p.getByRole("button", { name: "Fermer" }).first().click();
  await p.getByRole("button", { name: "Tourner la roue" }).last().click();
  await p.waitForTimeout(7000);
  await p.screenshot({ path: `${S}/${name}-win.png` });
  const live = await p.locator(`[aria-live="assertive"]`).last().textContent();
  console.log(name, "annonce:", live);
  if (name === "m") await p.getByRole("button", { name: "Revenir aux réglages" }).first().click();
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
