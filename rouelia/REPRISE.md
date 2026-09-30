# Point de reprise : Rouelia et ALIA coiffure (30 septembre 2026, soir)

Dépôt `ahennifr-prog/site-coiffure`, tout le travail est sur la branche **`claude/great-lovelace-lpyydk`**.
Attention : la branche par défaut du dépôt est `claude/confident-pasteur-0plw48` et ne contient pas ces projets.
Aucune pull request ouverte.

Le dépôt contient trois dossiers :
- `alia-coiffure/` : ancien site vitrine statique du salon (template Site Immersif), non modifié.
- `alia-roue/` : roue à cadeaux du salon ALIA coiffure, en ligne sur Netlify.
- `rouelia/` : landing page commerciale Rouelia, en ligne sur Cloudflare.

## Rouelia (`rouelia/`)

### Validé par Aymen
- Identité visuelle Tomette (rouge tomette #C4401F, crème, encre, Fraunces et Figtree, motif store banne).
- Ton franc et chaleureux. Titre du hero : « Vos clients gagnent un cadeau. Vous gagnez leur prochaine visite. »
- Pages et sections : « parfaitement la vision ».
- Hébergeur : Cloudflare (gratuit, sans badge, usage commercial autorisé). Vercel gratuit interdit l'usage commercial,
  Netlify affiche un badge « Powered by Netlify ».

### En ligne
- Cloudflare Workers, projet `rouelia`, adresse en `.workers.dev` (sous-domaine du compte Cloudflare d'Aymen).
- Réglages du build : commande `npx opennextjs-cloudflare build`, déploiement `npx opennextjs-cloudflare deploy`,
  commande de version `npx opennextjs-cloudflare upload`, répertoire racine `rouelia`,
  branche de production `claude/great-lovelace-lpyydk`.
- Secrets Cloudflare réglés (type Secret) : `ADMIN_PASSWORD`, `SESSION_SECRET`. Ne jamais les écrire dans le dépôt.
- Base D1 `rouelia` (liaison `DB`), créée automatiquement au déploiement ; la table `signups` se crée au premier usage.
- Espace `/admin` validé par Aymen : liste des inscriptions, statut (essai à ouvrir, en cours, client, perdu),
  appel, e-mail, suppression, export Excel.
- Chaque push sur la branche relance automatiquement le build Cloudflare.

### Questions en attente (réponses d'Aymen à intégrer)
1. Mot du fondateur (`founder` dans `content.ts`) : texte écrit par Claude, à garder, modifier ou remplacer.
2. Photo d'Aymen : le site affiche un grand « A » à la place (`founder.photo` vide).
3. Contact : e-mail et téléphone à afficher (actuellement `bonjour@rouelia.fr`, peut-être inexistant).
4. Installation sur place : confirmer « 49 €, ou 79 € si le déplacement est fait uniquement pour vous ».
5. Nom de domaine : `rouelia.fr` acheté ou non ; si oui, le brancher (Worker → Paramètres → Domaines et routes).
Déjà tranché : la mention « données hébergées en Europe » a été retirée de la FAQ (non garantie).

### Plus tard
- Stripe (paiement à la fin de l'essai, `stripeCustomerId` prévu dans `SignupRecord`) et e-mails automatiques
  (bienvenue, alerte interne), quand les premiers commerçants passent en payant. Demande des comptes au nom d'Aymen.
- Saisie assistée Google Places (`lib/places.ts` prêt).
- Activer le bloc « Résultat d'un pilote » (`pilots` dans `content.ts`) avec les vrais chiffres d'ALIA coiffure,
  l'accord écrit de la gérante et le lien de sa fiche Google.

### Vérifications à relancer après une modification
`npm run check` (typage, tests, contrôle des textes : aucun tiret de ponctuation, emoji ou formule interdite),
`npm run cf-build` (build Cloudflare), `npm run preview` (moteur Cloudflare local, mot de passe dans `.dev.vars`).

## ALIA coiffure (`alia-roue/`)

- En ligne sur Netlify : `https://jeu-aliacoiffure.netlify.app`, gestion sur `/gestion`.
- Réglages Netlify : base directory `alia-roue`, branche `claude/great-lovelace-lpyydk`, adaptateur Next.js déclaré
  dans `netlify.toml` (sans lui : « Page not found »). Secrets `ADMIN_PASSWORD` et `SESSION_SECRET` réglés.
- Stockage : Netlify Blobs (automatique). Upstash possible via variables, mémoire en local.
- Lien d'avis Google du salon : `https://search.google.com/local/writereview?placeid=ChIJV3ER3hoN5kcRXu6wMO8hfYI`
  (par défaut dans le code, à coller aussi dans `/gestion` → Roue si la configuration avait déjà été enregistrée).
- Logo officiel intégré (`public/logo-alia.png`, monogramme `public/logo-ac.png` au centre de la roue, icônes).
- Salon : 17 avenue du Général de Gaulle, 94500 Champigny-sur-Marne, 01 43 97 39 89, 7 j/7 de 10 h à 19 h, Planity.
- Le badge « Powered by Netlify » est ajouté par Netlify ; passage sur Cloudflare possible si Aymen le souhaite
  (même méthode que Rouelia, en remplaçant Netlify Blobs par D1 dans `lib/store.ts`).

## Pièges déjà rencontrés
- L'environnement de Claude ne peut joindre ni l'API Netlify ni l'API Cloudflare : les mises en ligne se font
  par import GitHub depuis le tableau de bord d'Aymen. Inutile de créer un jeton d'API pour Claude.
- La traduction automatique du navigateur traduit les noms et commandes affichés (« construction de npx… »,
  « coiffure de chantier », « ADMIN_MOT DE PASSE ») : les vraies valeurs sont correctes, ne pas retaper la traduction.
- Sur Cloudflare, « Réessayer » relance l'ancien build sur l'ancienne branche : pousser un commit pour un nouveau build.
- Tuer un processus avec `pkill -f "<motif>"` peut interrompre le shell de Claude si le motif figure dans la commande.
