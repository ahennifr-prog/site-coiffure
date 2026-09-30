# Mettre la roue ALIA coiffure en ligne (environ 15 minutes)

Tout est gratuit : Vercel (l'hébergement) et Upstash (la petite base qui garde les parties et les codes).

## 1. Créer le compte Vercel
1. Aller sur https://vercel.com/signup et choisir **Continue with GitHub** (compte `ahennifr-prog`).
2. Choisir l'offre **Hobby** (gratuite).

## 2. Importer le projet
1. Sur Vercel : **Add New… → Project**, puis **Import** à côté du dépôt `site-coiffure`
   (si le dépôt n'apparaît pas : **Adjust GitHub App Permissions** et autoriser ce dépôt).
2. **Root Directory** : cliquer sur **Edit** et choisir le dossier `alia-roue`.
3. Ouvrir **Environment Variables** et ajouter :
   | Name | Value |
   | --- | --- |
   | `ADMIN_PASSWORD` | le mot de passe de l'espace gestion (celui donné à Claude) |
   | `SESSION_SECRET` | la longue suite de caractères donnée par Claude dans la conversation |
4. Cliquer sur **Deploy**. Si ce premier déploiement échoue (« Root Directory not found »), c'est normal :
   la branche par défaut du dépôt ne contient pas encore le dossier. Passer à l'étape 3.

## 3. Choisir la bonne branche
1. Dans le projet : **Settings → Git → Production Branch**, écrire `claude/great-lovelace-lpyydk`, **Save**.
2. **Deployments** → sur le dernier déploiement de cette branche, menu **⋯ → Promote to Production**
   (ou **Redeploy**). Le site est en ligne sur une adresse du type `alia-roue.vercel.app`.

## 4. Brancher la base de données (indispensable pour le suivi)
1. Dans le projet : onglet **Storage → Create Database → Upstash for Redis** (Marketplace).
2. Offre **Free**, région **Frankfurt (eu-central-1)**, puis **Create**.
3. **Connect Project** : choisir ce projet, cocher tous les environnements, valider.
4. **Deployments → ⋯ → Redeploy** pour que le site prenne la base en compte.

## 5. Vérifier et préparer le salon
1. Ouvrir `https://VOTRE-ADRESSE.vercel.app/gestion` et se connecter.
2. Onglet **Suivi** : aucun bandeau rouge ne doit s'afficher (sinon, refaire l'étape 4).
3. Onglet **Roue** : vérifier les cadeaux, les chances, les dates. Coller le lien direct d'avis Google
   (fiche Google du salon → **Demander des avis** → copier le lien `g.page/r/…`). **Enregistrer**.
4. Faire une partie test avec son propre téléphone, puis valider le code dans l'onglet **Caisse**.
5. Onglet **QR code** : télécharger le PNG **depuis l'adresse définitive** (le QR code reprend l'adresse
   de la page ouverte). Le placer sur le flyer, à 3 cm minimum, sur fond blanc.
6. Imprimer, tester le flyer avec deux téléphones, poser au comptoir.

## Au quotidien
- **Caisse** : la cliente montre son code, on le tape, on appuie sur **Valider le retrait**.
  Une erreur ? **Annuler ce retrait** remet le code en service.
- **Suivi** : scans, parties, clics vers les avis, cadeaux retirés, export Excel.
- **Roue** : tout se règle sans toucher au code. Les changements s'appliquent immédiatement aux nouvelles parties ;
  les codes déjà gagnés gardent leurs dates.
- Astuce : ajouter `https://VOTRE-ADRESSE.vercel.app/gestion` à l'écran d'accueil du téléphone du salon.
