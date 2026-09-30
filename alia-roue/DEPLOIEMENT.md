# Mettre la roue ALIA coiffure en ligne sur Netlify (environ 10 minutes)

Gratuit. Le stockage des parties et des codes (Netlify Blobs) est intégré : aucune base à créer.

## 1. Créer le compte
1. Aller sur https://app.netlify.com/signup et choisir **Sign up with GitHub** (compte `ahennifr-prog`).
2. Choisir l'offre gratuite (**Free**).

## 2. Importer le projet
1. **Add new project → Import an existing project → GitHub**.
   Autoriser Netlify à voir le dépôt `site-coiffure` si demandé, puis le choisir.
2. Sur l'écran de configuration :
   | Réglage | Valeur |
   | --- | --- |
   | Project name | `alia-coiffure-jeu` (donnera `alia-coiffure-jeu.netlify.app`) |
   | Branch to deploy | `claude/great-lovelace-lpyydk` |
   | Base directory | `alia-roue` |
   | Build command | `npm run build` (prérempli) |
   | Publish directory | `alia-roue/.next` (prérempli) |
3. **Add environment variables** (laisser « All scopes ») :
   | Key | Value |
   | --- | --- |
   | `ADMIN_PASSWORD` | le mot de passe de l'espace gestion (celui donné à Claude) |
   | `SESSION_SECRET` | la longue suite de caractères donnée par Claude dans la conversation |
4. **Deploy**. Compter 2 à 3 minutes. Le site est en ligne sur `https://alia-coiffure-jeu.netlify.app`.

## 3. Vérifier et préparer le salon
1. Ouvrir `https://alia-coiffure-jeu.netlify.app/gestion` et se connecter.
2. Onglet **Suivi** : aucun bandeau rouge ne doit s'afficher.
3. Onglet **Roue** : vérifier cadeaux, chances et dates. Coller le lien direct d'avis Google
   (fiche Google du salon → **Demander des avis** → copier le lien `g.page/r/…`). **Enregistrer**.
4. Faire une partie test avec son propre téléphone, puis valider le code dans l'onglet **Caisse**.
5. Onglet **QR code** : télécharger le PNG (ouvert depuis l'adresse `.netlify.app`, le QR code pointe au bon endroit).
   Le placer sur le flyer à 3 cm minimum, sur fond blanc.
6. Imprimer, tester le flyer avec deux téléphones, poser au comptoir.

## Si quelque chose coince
- **La connexion à /gestion dit que le mot de passe n'est pas réglé** : Project configuration → Environment variables,
  vérifier `ADMIN_PASSWORD`, puis **Deploys → Trigger deploy → Deploy project**.
- **Le build échoue** : vérifier que **Base directory** vaut `alia-roue` et la branche `claude/great-lovelace-lpyydk`
  (Project configuration → Build & deploy).
- **Changer le mot de passe** : modifier `ADMIN_PASSWORD` puis redéployer.

## Au quotidien
- **Caisse** : la cliente montre son code, on le tape, **Valider le retrait**. Une erreur ? **Annuler ce retrait**.
- **Suivi** : scans, parties, clics vers les avis, cadeaux retirés, export Excel.
- **Roue** : tout se règle sans toucher au code, les changements s'appliquent aux nouvelles parties.
- Astuce : ajouter `https://alia-coiffure-jeu.netlify.app/gestion` à l'écran d'accueil du téléphone du salon.
