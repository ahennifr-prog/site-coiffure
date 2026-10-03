/**
 * Parcours complet du produit dans un vrai navigateur (moteur Cloudflare local : npm run preview).
 * Inscription, ouverture de l'essai dans /admin, mot de passe, réglages, partie client, caisse, pause.
 * Usage : BASE=http://localhost:8787 ADMIN_PASSWORD=... node scripts/parcours-produit.mjs [dossier-captures]
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:8787";
const OUT = process.argv[2] ?? null;
const exe = process.env.CHROME ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath: exe });
const errors = [];
const mobile = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true };
const shot = async (page, name) => OUT && page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
const watch = (page, who) => {
  page.on("pageerror", (e) => errors.push(`${who} : ${e.message}`));
  page.on("console", (m) => m.type() === "error" && !/401|404/.test(m.text()) && errors.push(`${who} : ${m.text()}`));
};
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
const ok = (cond, msg) => {
  if (!cond) throw new Error(`Échec : ${msg}`);
  console.log(`ok  ${msg}`);
};

const stamp = Date.now().toString(36).slice(-4);
const shopName = `Salon Test ${stamp}`;
const email = `test-${stamp}@exemple.fr`;

// 1. Inscription d'un commerçant
const admin = await browser.newPage();
watch(admin, "admin");
const signup = await admin.request.post(`${BASE}/api/inscription`, {
  data: {
    firstName: "Martine", email, phone: "06 12 34 56 78", establishment: { name: shopName }, pack: "croissance", utm: {},
    consent: { accepted: true, text: "J'accepte" },
    wheel: {
      shopName, trade: "coiffeur", paletteId: "poudre", primaryColor: null, logo: null, noLogo: false, averageCost: 2,
      prizes: [
        { name: "Soin profond offert", icon: "goutte", cost: 2.5, percent: 40, hasImage: false },
        { name: "-10 % sur la coupe", icon: "pourcent", cost: 3.5, percent: 35, hasImage: false },
        { name: "Échantillon", icon: "flacon", cost: 0.8, percent: 20, hasImage: false },
        { name: "Brushing offert", icon: "etoile", cost: 6, percent: 5, hasImage: false },
      ],
    },
  },
});
ok(signup.status() === 201, "inscription enregistrée");

// 2. Ouverture de l'essai dans /admin
await admin.goto(`${BASE}/admin`);
await admin.getByLabel("Mot de passe", { exact: true }).fill(process.env.ADMIN_PASSWORD ?? "");
await admin.getByRole("button", { name: "Se connecter" }).click();
const card = admin.locator("li", { hasText: shopName });
await card.getByRole("button", { name: "Ouvrir l'essai" }).click();
const linkEl = card.locator("p.font-mono", { hasText: "/espace/invitation#" });
await linkEl.waitFor();
const link = (await linkEl.innerText()).trim();
ok(link.includes("/espace/invitation#"), "essai ouvert, lien d'invitation affiché");
await card.screenshot({ path: OUT ? `${OUT}/admin-essai.png` : undefined });
const slug = (await card.getByText(/^Roue : \/j\//).innerText()).replace("Roue : /j/", "").trim();
ok(slug.startsWith("salon-test"), `adresse du jeu /j/${slug}`);

// 3. Le commerçant choisit son mot de passe
const ctxM = await browser.newContext(mobile);
const merchant = await ctxM.newPage();
watch(merchant, "commerçant");
await merchant.goto(link);
await merchant.getByLabel("Mot de passe", { exact: true }).fill("court");
await merchant.getByRole("button", { name: "Accéder à mon espace" }).click();
ok(await merchant.getByText("Choisissez au moins 8 caractères.").isVisible(), "mot de passe trop court refusé");
await merchant.getByLabel("Mot de passe", { exact: true }).fill("motdepasse-test");
await merchant.getByRole("button", { name: "Accéder à mon espace" }).click();
await merchant.waitForURL(/\/espace#roue/);
await merchant.getByText("Les cadeaux", { exact: true }).waitFor();
ok(await merchant.getByText(/Essai gratuit du pack Croissance : 14 jours restants/).isVisible(), "espace ouvert, bandeau d'essai");
ok((await merchant.locator('input[id^="nom-"]').first().inputValue()) === "Soin profond offert", "la roue de la démo est reprise");

// 4. Réglages : lien d'avis, utilisable tout de suite, réservation, téléphone
await merchant.getByLabel("Lien « Laisser un avis Google »").fill("https://g.page/r/exemple/review");
await merchant.getByLabel("Utilisable après").fill("0");
await merchant.getByLabel("Lien de réservation (affiché après le jeu)").fill("https://www.planity.com/exemple");
await merchant.getByLabel("Téléphone affiché").fill("01 23 45 67 89");
await merchant.getByRole("button", { name: "Enregistrer" }).click();
await merchant.getByText("Enregistré. La roue est à jour pour vos clients.").waitFor();
ok(true, "réglages enregistrés");
ok(!(await overflow(merchant)), "espace sans débordement horizontal (téléphone)");
await shot(merchant, "espace-roue");

// Le lien d'invitation ne sert qu'une fois
const reuse = await merchant.request.post(`${BASE}/api/espace/activation`, { data: { token: link.split("#")[1], password: "autremotdepasse" } });
ok(reuse.status() === 410, "le lien d'invitation ne sert qu'une fois");

// 5. Un client joue
const ctxC = await browser.newContext(mobile);
const client = await ctxC.newPage();
watch(client, "client");
await client.goto(`${BASE}/j/${slug}`);
ok(await client.getByRole("heading", { name: "Tentez votre chance" }).isVisible(), "page du jeu");
ok(await client.getByText("Propulsé par Rouelia").isVisible(), "mention Propulsé par Rouelia (pack Croissance)");
await shot(client, "jeu-accueil");
await client.getByRole("button", { name: "Jouer" }).click();
const dialog = client.getByRole("dialog");
await dialog.waitFor();
await client.waitForTimeout(600);
ok(await dialog.getByText(/Votre avis compte beaucoup pour nous/).isVisible(), "invitation à l'avis neutre");
const closeBox = await dialog.getByRole("button", { name: "Fermer" }).boundingBox();
ok(closeBox && closeBox.width >= 44 && closeBox.height >= 44, "croix de fermeture de 44 px");
await dialog.getByRole("button", { name: "Fermer" }).click();
await client.getByRole("button", { name: "Accéder à la roue" }).click();
ok(await client.getByText("Indiquez votre prénom.").isVisible(), "erreurs du formulaire affichées");
await client.getByLabel("Prénom", { exact: true }).fill("Léa");
await client.getByLabel("Téléphone", { exact: true }).fill("06 11 22 33 44");
await client.getByText(/J'accepte que .* enregistre mon prénom/).click();
await shot(client, "jeu-infos");
await client.getByRole("button", { name: "Accéder à la roue" }).click();
await client.getByRole("button", { name: "Tourner la roue" }).last().click();
await client.getByRole("heading", { name: "Bravo Léa" }).waitFor({ timeout: 20000 });
const code = (await client.locator("p.font-mono").first().innerText()).trim();
ok(/^SAL-[2-9A-Z]{5}$/.test(code), `code gagné ${code}`);
ok(await client.getByRole("link", { name: "Prendre rendez-vous" }).isVisible(), "lien de réservation après le jeu");
ok(!(await overflow(client)), "jeu sans débordement horizontal");
await client.waitForTimeout(800);
await shot(client, "jeu-gain");

// Rejouer avec le même numéro renvoie le même code
const again = await client.request.post(`${BASE}/api/j/${slug}/jouer`, { data: { firstName: "Léa", phone: "+33611223344", consent: true, consentText: "x" } });
const againJson = await again.json();
ok(againJson.already === true && againJson.play.code === code, "une partie par téléphone");
ok(!("phone" in againJson.play), "le téléphone n'est pas renvoyé au navigateur");

// 6. Caisse
await merchant.getByRole("button", { name: "Caisse" }).last().click();
await merchant.getByLabel("Code cadeau").fill(code.slice(4).toLowerCase());
await merchant.getByRole("button", { name: "Vérifier le code" }).click();
await merchant.getByRole("button", { name: "Valider le retrait" }).click();
await merchant.getByText(/Cadeau validé : .* pour Léa\./).waitFor();
ok(true, "cadeau validé en caisse");
await shot(merchant, "espace-caisse");
const twice = await merchant.request.post(`${BASE}/api/espace/caisse`, { data: { code, action: "valider" } });
ok((await twice.json()).error === "deja", "un code ne sert qu'une fois");

await merchant.getByRole("button", { name: "Suivi" }).last().click();
await merchant.getByText("Parties jouées").waitFor();
ok((await merchant.getByText("Parties jouées").locator("..").innerText()).includes("1"), "suivi : 1 partie");
await shot(merchant, "espace-suivi");
const csv = await merchant.request.get(`${BASE}/api/espace/export`);
ok((await csv.text()).includes(code), "export Excel des clients");
await merchant.getByRole("button", { name: "QR code" }).last().click();
await merchant.getByRole("img", { name: /QR code du jeu/ }).waitFor();
ok(true, "QR code généré");
await shot(merchant, "espace-qr");

// 7. Sécurité : sans session, pas d'accès ; un autre commerce ne voit pas ce code
const anon = await browser.newContext();
const anonRes = await anon.request.get(`${BASE}/api/espace/parties`);
ok(anonRes.status() === 401, "API de l'espace fermée sans connexion");
const anonPage = await anon.newPage();
await anonPage.goto(`${BASE}/espace`);
ok(anonPage.url().endsWith("/espace/connexion"), "espace renvoie vers la connexion");
await anonPage.getByLabel("E-mail").fill(email);
await anonPage.getByRole("button", { name: "Mot de passe oublié" }).click();
await anonPage.getByText(/Si un compte existe pour cette adresse/).waitFor();
ok(true, "mot de passe oublié");
await anonPage.getByLabel("Mot de passe", { exact: true }).fill("motdepasse-test");
await anonPage.getByRole("button", { name: "Se connecter" }).click();
await anonPage.waitForURL(/\/espace$/);
ok(true, "connexion par e-mail et mot de passe");

// 8. Mise en pause par Rouelia : le jeu affiche la pause, la caisse marche toujours
await admin.reload();
const card2 = admin.locator("li", { hasText: shopName });
await card2.getByLabel("Offre du commerce").selectOption("paused");
await admin.waitForTimeout(800);
await client.goto(`${BASE}/j/${slug}`);
ok(await client.getByText("Le jeu est en pause pour le moment. Revenez très bientôt.").isVisible(), "jeu en pause");
ok((await client.getByRole("button", { name: "Jouer" }).count()) === 0, "bouton Jouer masqué en pause");
await merchant.reload();
ok(await merchant.getByText(/Votre compte est en pause/).isVisible(), "bandeau de pause dans l'espace");
await card2.getByLabel("Offre du commerce").selectOption("active");
await admin.waitForTimeout(800);


// 9. Fonctions des packs : passage en Premium, puis parrainage, équipe, heures creuses, réseaux, rentabilité
await card2.getByLabel("Pack du commerce").selectOption("premium");
await admin.waitForTimeout(800);
await merchant.goto(`${BASE}/espace`);
await merchant.getByRole("button", { name: "Roue" }).last().click();
await merchant.getByText("Les cadeaux", { exact: true }).waitFor();
await merchant.getByRole("switch", { name: "Parrainage actif" }).click();
await merchant.getByLabel("Bonus du parrain").fill("Café offert");
await merchant.getByLabel("Prénom à ajouter").fill("Sonia");
await merchant.getByRole("button", { name: "Ajouter", exact: true }).click();
await merchant.getByLabel("Instagram (affiché après le jeu)").fill("https://www.instagram.com/exemple");
await merchant.getByRole("button", { name: "Heures creuses" }).click();
const sched = merchant.locator("li", { has: merchant.getByLabel("Nom de la roue") });
await sched.getByLabel("Nom de la roue", { exact: true }).fill("Happy hour");
for (const d of ["Lun", "Ven", "Sam", "Dim"]) await sched.getByRole("button", { name: d, exact: true }).click();
await sched.getByLabel("De", { exact: true }).fill("00:00");
await sched.getByLabel("À", { exact: true }).fill("23:59");
await sched.locator('input[id*="-nom-"]').first().fill("Lot happy hour");
await merchant.getByLabel("Panier moyen").fill("35");
await merchant.getByRole("button", { name: "Enregistrer" }).click();
await merchant.getByText("Enregistré. La roue est à jour pour vos clients.").waitFor();
ok(true, "parrainage, équipe, Instagram, heures creuses et rentabilité enregistrés");
await shot(merchant, "espace-roue-premium");

const ctxF = await browser.newContext(mobile);
const friend = await ctxF.newPage();
watch(friend, "ami");
await friend.goto(`${BASE}/j/${slug}?parrain=${code}`);
await friend.getByText("Un ami vous a invité : à vous de jouer.").waitFor({ timeout: 5000 });
ok(true, "page ouverte par un lien de parrainage");
ok((await friend.getByText("Propulsé par Rouelia").count()) === 0, "pas de mention Rouelia en Premium");
await friend.getByRole("button", { name: "Jouer" }).click();
await friend.getByRole("dialog").getByRole("button", { name: "Fermer" }).click();
await friend.getByLabel("Prénom", { exact: true }).fill("Nora");
await friend.getByLabel("Téléphone", { exact: true }).fill("06 55 44 33 22");
await friend.getByLabel("E-mail (facultatif)").fill("pas-un-mail");
await friend.getByText(/J'accepte que .* enregistre mon prénom/).click();
await friend.getByRole("button", { name: "Accéder à la roue" }).click();
ok(await friend.getByText(/Cet e-mail semble incomplet/).isVisible(), "e-mail client invalide signalé");
await friend.getByLabel("E-mail (facultatif)").fill("nora@exemple.fr");
await friend.getByText(/J'accepte que .* enregistre mon prénom/).click();
await friend.getByText(/J'accepte que .* enregistre mon prénom/).click();
await friend.getByRole("button", { name: "Accéder à la roue" }).click();
await friend.getByRole("button", { name: "Tourner la roue" }).last().click();
await friend.getByRole("heading", { name: "Bravo Nora" }).waitFor({ timeout: 20000 });
const code2 = (await friend.locator("p.font-mono").first().innerText()).trim();
ok(await friend.getByRole("button", { name: "Inviter un ami" }).isVisible(), "invitation d'un ami après le jeu");
ok(await friend.getByRole("link", { name: "Instagram" }).isVisible(), "lien Instagram après le jeu");
await friend.waitForTimeout(800);
await shot(friend, "jeu-gain-premium");
const hh = await friend.request.post(`${BASE}/api/j/${slug}/jouer`, { data: { firstName: "Test", phone: "0677665544", consent: true, consentText: "x" } });
const hhJson = await hh.json();
ok(hhJson.play.wheelName === "Happy hour" && hhJson.prizes[0].name === "Lot happy hour", "la roue des heures creuses est en vigueur");

await merchant.getByRole("button", { name: "Caisse" }).last().click();
await merchant.getByLabel("Validé par").selectOption("Sonia");
await merchant.getByLabel("Code cadeau").fill(code2);
await merchant.getByRole("button", { name: "Vérifier le code" }).click();
await merchant.getByText(`Invité par le client ${code}.`, { exact: false }).waitFor({ timeout: 5000 });
ok(true, "la caisse montre le parrain");
await merchant.getByRole("button", { name: "Valider le retrait" }).click();
await merchant.getByText(/Cadeau validé : .* pour Nora\./).waitFor();
await merchant.getByLabel("Code cadeau").fill(code);
await merchant.getByRole("button", { name: "Vérifier le code" }).click();
await merchant.getByText("Bonus de parrainage à remettre : Café offert").waitFor();
await merchant.getByRole("button", { name: "Remettre le bonus" }).click();
await merchant.getByText("Bonus de parrainage remis à Léa.").waitFor();
ok(true, "bonus de parrainage remis au parrain");
await shot(merchant, "espace-caisse-bonus");

await merchant.getByRole("button", { name: "Suivi" }).last().click();
await merchant.getByText("Retraits par employé").waitFor();
ok(await merchant.getByRole("cell", { name: "Sonia" }).isVisible(), "statistiques par employé");
ok(await merchant.getByText("Rentabilité ce mois-ci").isVisible(), "suivi de la rentabilité");
ok((await merchant.getByText("Amis venus grâce au parrainage").locator("..").innerText()).includes("1"), "compteur de parrainages");
await shot(merchant, "espace-suivi-premium");

await merchant.goto(`${BASE}/espace/flyer`);
await merchant.getByRole("img", { name: "" }).count();
await merchant.getByRole("button", { name: "Imprimer" }).waitFor();
ok(await merchant.getByText("Tentez votre chance").isVisible(), "flyer et chevalet à imprimer");
await shot(merchant, "flyer-a5");
await merchant.getByRole("radio", { name: "4 flyers A6 sur une feuille A4" }).click();
ok((await merchant.getByText("Tentez votre chance").count()) === 4, "4 flyers A6 sur A4");
await shot(merchant, "flyer-a6");

// 10. Tâche quotidienne : protégée par le secret, et elle tourne sans erreur
const cronNo = await admin.request.post(`${BASE}/api/cron`);
ok(cronNo.status() === 401, "tâche quotidienne fermée sans secret");
if (process.env.SESSION_SECRET) {
  const cron = await admin.request.post(`${BASE}/api/cron`, { headers: { "x-cron-secret": process.env.SESSION_SECRET } });
  ok(cron.status() === 200 && (await cron.json()).ok === true, "tâche quotidienne exécutée");
}

console.log(errors.length ? `\nErreurs de console :\n${errors.join("\n")}` : "\nAucune erreur de console.");
await browser.close();
if (errors.length) process.exit(1);
