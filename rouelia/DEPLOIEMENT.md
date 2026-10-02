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
   | Commande de version (branches de test) | `npx opennextjs-cloudflare upload` |
   | Répertoire racine (paramètres avancés, « Path ») | `rouelia` |
4. **Créer et déployer**. Le premier déploiement prend 3 à 5 minutes.

## 2. Choisir la bonne branche
Si le premier build échoue parce que le dossier `rouelia` est introuvable, le projet a pris la branche par défaut.
1. Dans le Worker `rouelia` → **Paramètres → Build → Contrôle des branches** (Branch control).
2. Branche de production : `claude/great-lovelace-lpyydk`, enregistrer.
3. « Réessayer » relance l'ancien build sur l'ancienne branche : il faut un nouveau commit sur
   `claude/great-lovelace-lpyydk` (Claude peut en pousser un) pour déclencher un build sur la bonne branche.

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

## Brancher rouelia.fr (à faire par Aymen, 10 minutes, puis jusqu'à 24 h de propagation)
Le code est prêt : canonical, og:url, sitemap et JSON-LD pointent déjà sur `https://rouelia.fr`,
`www.rouelia.fr` redirige vers `rouelia.fr`, et l'adresse `.workers.dev` est marquée « noindex ».

1. **Mettre le domaine dans Cloudflare** : tableau de bord → **Ajouter un domaine** → `rouelia.fr` → offre **Free**.
   - Domaine acheté chez Cloudflare : rien à faire, il y est déjà.
   - Domaine acheté ailleurs (OVH, Gandi, IONOS…) : Cloudflare affiche deux serveurs de noms
     (du type `xxx.ns.cloudflare.com`). Chez le registraire, remplacer les serveurs DNS par ces deux-là.
     Attendre l'e-mail « rouelia.fr est actif » (souvent moins d'une heure).
2. **Relier le domaine au site** : Worker `rouelia` → **Paramètres → Domaines et routes → Ajouter →
   Domaine personnalisé** → `rouelia.fr`. Recommencer avec `www.rouelia.fr`. Cloudflare crée les DNS et le certificat.
3. **Vérifier** : `https://rouelia.fr` affiche le site, `https://www.rouelia.fr` renvoie vers `https://rouelia.fr`.
4. **Facultatif, une fois que tout marche** : dans **Domaines et routes**, désactiver l'adresse `workers.dev`.

## Boîte contact@rouelia.fr
- **Recevoir (gratuit)** : domaine `rouelia.fr` → **E-mail → Routage des e-mails** → activer (Cloudflare ajoute les DNS),
  puis **Adresses personnalisées** : `contact` → transférer vers votre Gmail. Confirmer le lien reçu dans Gmail.
- **Envoyer depuis contact@** : le routage ne fait que recevoir. Pour répondre avec cette adresse, il faut une vraie
  boîte (Google Workspace, Zoho Mail, OVH…). Elle remplace alors le routage Cloudflare (une seule solution à la fois).
- Plus tard, pour les e-mails automatiques du site (bienvenue, fin d'essai), un service d'envoi (Resend, Brevo)
  demandera d'ajouter quelques DNS dans Cloudflare.
