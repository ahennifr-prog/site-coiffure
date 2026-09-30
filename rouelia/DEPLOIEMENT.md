# Mettre Rouelia en ligne sur Cloudflare (environ 15 minutes)

Gratuit, sans badge, usage commercial autorisé. La base des inscriptions (D1) est créée automatiquement.

## 1. Importer le projet
1. Tableau de bord Cloudflare → **Calculer (Workers)** → **Workers & Pages** → **Créer une application**.
2. Choisir **Importer un référentiel** (Import a repository), connecter **GitHub** (compte `ahennifr-prog`),
   autoriser le dépôt `site-coiffure`, puis le choisir.
3. Écran de configuration :
   | Réglage | Valeur |
   | --- | --- |
   | Nom du projet | `rouelia` |
   | Commande de build | `npx opennextjs-cloudflare build` |
   | Commande de déploiement | `npx opennextjs-cloudflare deploy` |
   | Répertoire racine (paramètres avancés, « Path ») | `rouelia` |
4. **Créer et déployer**. Le premier déploiement prend 3 à 5 minutes.

## 2. Choisir la bonne branche
Si le premier build échoue parce que le dossier `rouelia` est introuvable, le projet a pris la branche par défaut.
1. Dans le Worker `rouelia` → **Paramètres → Build → Contrôle des branches** (Branch control).
2. Branche de production : `claude/great-lovelace-lpyydk`, enregistrer.
3. **Déploiements** → relancer le dernier build.

## 3. Le mot de passe de l'espace admin
1. Worker `rouelia` → **Paramètres → Variables et secrets → Ajouter**.
2. Type **Secret**, nom `ADMIN_PASSWORD`, valeur : votre mot de passe. Enregistrer (déployer).
3. Ajouter aussi un secret `SESSION_SECRET` avec la longue suite de caractères donnée par Claude.

## 4. Vérifier
1. Ouvrir l'adresse donnée par Cloudflare (`https://rouelia.<votre-sous-domaine>.workers.dev`).
2. Faire une inscription test (bouton « Créer ma roue », puis choisir un pack).
3. Ouvrir `/admin`, se connecter : l'inscription test doit apparaître, **sans bandeau jaune** en haut.
   Un bandeau jaune signifie que la base D1 n'est pas liée : voir ci-dessous.

## Si la base n'a pas été créée automatiquement
1. **Stockage et bases de données → D1 → Créer une base**, nom `rouelia`.
2. Worker `rouelia` → **Paramètres → Liaisons → Ajouter → Base de données D1** :
   nom de variable `DB`, base `rouelia`. Enregistrer.
3. Ou envoyer l'identifiant de la base à Claude, qui l'ajoutera dans `wrangler.jsonc`.

## Nom de domaine (plus tard)
Worker `rouelia` → **Paramètres → Domaines et routes → Ajouter un domaine personnalisé** (ex. `rouelia.fr`).
