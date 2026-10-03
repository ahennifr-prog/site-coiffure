# Point de reprise : Rouelia et ALIA coiffure (mis à jour le 3 octobre 2026, soir)

## Où on en est en une minute
- Site, admin, espace commerçant et jeu client en ligne sur `https://rouelia.fr` (Cloudflare Workers + D1).
- Produit multi-commerces fait (étape 1), groupe 1 des fonctions des packs fait, e-mails Brevo codés (groupe 2).
- Aymen est auto-entrepreneur, SIREN en attente (statut tout juste créé), Stripe en attente du SIREN.
- **En cours au moment du /compact** :
  1. Aymen lit les 9 e-mails et les 5 SMS proposés (images envoyées ; régénérer avec
     `npx tsx scripts/apercu-emails.ts sortie.html`) et doit dire ce qu'il change.
  2. Aymen doit poser le secret `BREVO_API_KEY` dans Cloudflare puis tester : inscription test (accusé + alerte),
     « Ouvrir l'essai » (e-mail d'invitation), partie avec son e-mail (code reçu). Vérifier aussi que le build
     Cloudflare passe avec la nouvelle entrée `worker.ts` (tâche du matin).
  3. Aymen a annoncé « d'autres demandes » après le test Brevo.
- Décisions récentes d'Aymen : case d'accord client raccourcie (fait) ; pas de QR code sur le ticket, la caisse
  tape le code à la main ; flyer redessiné validé à montrer (store banne, roue, lots, 3 étapes).

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
- Cloudflare Workers, projet `rouelia`, sur `https://rouelia.fr` (l'adresse `.workers.dev` marche encore, en noindex).
- Réglages du build : commande `npx opennextjs-cloudflare build`, déploiement `npx opennextjs-cloudflare deploy`,
  commande de version `npx opennextjs-cloudflare upload`, répertoire racine `rouelia`,
  branche de production `claude/great-lovelace-lpyydk`.
- Secrets Cloudflare réglés (type Secret) : `ADMIN_PASSWORD`, `SESSION_SECRET` ; `BREVO_API_KEY` à poser par Aymen.
  Ne jamais les écrire dans le dépôt ni les demander dans le chat.
- Entrée du Worker : `worker.ts` (reprend `.open-next/worker.js` + tâche planifiée `0 6 * * *` vers `/api/cron`).
- Base D1 `rouelia` (liaison `DB`), créée automatiquement au déploiement ; la table `signups` se crée au premier usage.
- Espace `/admin` validé par Aymen : liste des inscriptions, statut (essai à ouvrir, en cours, client, perdu),
  appel, e-mail, suppression, export Excel.
- Chaque push sur la branche relance automatiquement le build Cloudflare.

### Questions en attente (réponses d'Aymen à intégrer)
1. SIREN et adresse (domiciliation ou personnelle) : `company.siren` et `company.address` dans `content.ts`.
   Tant qu'ils sont vides, les pages légales affichent « [à compléter] » et un bandeau jaune.
2. Franchise de TVA confirmée ? (`company.vatExempt`, appliquée par défaut pour une micro-entreprise.)
3. Quantité de flyers offerts par la roue d'offres.
4. Mot du fondateur (`founder`) : garder, modifier ou remplacer. Photo d'Aymen (`founder.photo`, un « A » à la place).
5. Contact affiché : e-mail `contact@rouelia.fr` (choisi le 2 octobre) ; téléphone à confirmer.
6. Installation sur place : confirmer « 49 €, ou 79 € si le déplacement est fait uniquement pour vous ».
7. Décision pour chaque fonction non codée (liste plus bas) : « bientôt » ou retirée.
Déjà tranché : « données hébergées en Europe » retiré ; prix nets avec « TVA non applicable, art. 293 B du CGI » ;
conservation 3 ans après le dernier contact pour les non clients ; arrêt effectif à la fin du mois payé, non remboursé.

### Domaine rouelia.fr
Branché le 3 octobre 2026 : domaine acheté chez IONOS, serveurs de noms passés chez Cloudflare, domaine relié au
Worker. Le site et l'admin sont sur `https://rouelia.fr` (`/admin`, `/espace`, `/j/...`).
Boîte contact@rouelia.fr en place (routage des e-mails Cloudflare vers la boîte personnelle d'Aymen, testé).
Les anciens enregistrements DNS d'IONOS (MX, SPF, autodiscover, _dmarc, _domainconnect) ont été supprimés.

### Roue d'offres Rouelia (dernière section, fond orange)
- 100 % gagnante. Chances : essai prolongé à 21 jours 28 %, installation sur place offerte 24 %, flyers imprimés
  offerts 22 %, audit de la fiche Google offert 17 %, -50 % le premier mois 5 %, Premium au prix de Croissance le
  premier mois 3 %, premier mois offert 1 %. Réglages dans `offerWheel` (`content.ts`), logique dans `lib/offers.ts`.
- Tirage fait par le serveur (`/api/offre`), signé (HMAC avec `SESSION_SECRET`) : impossible d'inventer un cadeau.
  Le cadeau, son code `OFF-XXXX` et le jeton sont gardés 7 jours dans le navigateur, puis la roue peut être relancée.
- Après le tirage : code et « Créez votre compte pour activer votre cadeau (valable 7 jours) ». L'inscription envoie
  le jeton, le serveur le vérifie et l'applique selon le pack :
  - Essentiel : jamais appliqué, message « Votre cadeau est valable sur Croissance et Premium. Passez à Croissance
    pour l'activer. » avec un bouton qui change le pack ;
  - Premium et audit gagné : remplacé par l'installation sur place offerte (l'audit est inclus dans Premium) ;
  - Premium au prix de Croissance gagné avec Croissance : invitation à passer en Premium.
- Le cadeau apparaît dans `/admin` (« À appliquer » ou la raison du refus) et dans l'export. Il s'applique
  à la main tant que Stripe n'est pas branché. Limite connue : en vidant son navigateur, on peut retirer ;
  « un cadeau par commerce » se contrôle dans `/admin`.
- Règles reprises dans les CGV (section « Cadeaux de la roue d'offres Rouelia »).

### Plus tard
- Étape 2 Stripe (paiement à la fin de l'essai, portail client pour arrêter en un clic, application automatique des
  cadeaux de la roue d'offres) : dès que le SIREN arrive ; possible avant en mode test.
- Saisie assistée Google Places (`lib/places.ts` prêt).
- Activer le bloc « Résultat d'un pilote » (`pilots` dans `content.ts`) avec les vrais chiffres d'ALIA coiffure,
  l'accord écrit de la gérante et le lien de sa fiche Google.

### Vérifications à relancer après une modification
`npm run check` (typage, tests, contrôle des textes : aucun tiret de ponctuation, emoji ou formule interdite),
`npm run cf-build` (build Cloudflare), `npm run preview` (moteur Cloudflare local, mot de passe dans `.dev.vars`).

## Audit vitesse et SEO : 3 octobre 2026 (nuit)
- Mesuré sur un build local (le réseau de Claude ne joint pas rouelia.fr). Lighthouse bureau : 100 partout.
  Mobile : performance 91 à 95, accessibilité, bonnes pratiques et SEO 100. Le LCP simulé (environ 3 s) vient du
  temps d'exécution de React et Next.js sur un téléphone lent simulé ; mesuré réellement, le texte du hero
  s'affiche en 0,23 s. Essayés sans gain et annulés : CSS intégré (`inlineCss`), police Fraunces sans préchargement.
- Corrigé (invisible) : canonique et og:url posés page par page (`lib/seo.ts`). Avant, la 404 et les pages non
  indexées (`/espace`, `/j/...`) déclaraient l'accueil comme canonique, la 404 avait deux balises robots
  contradictoires, et les pages légales partageaient l'adresse de l'accueil en og:url.
- À décider par Aymen (changement visible) : alléger Fraunces (axe `opsz` retiré : 121 Ko vers 62 Ko, lettres des
  grands titres un peu moins contrastées) ; charger la roue d'offres et le simulateur seulement à l'approche.

## Étape 1 du produit : faite le 2 octobre 2026
Le produit multi-commerces est en place dans le site Rouelia (même Worker, même base D1, tables créées seules).
- **Aymen, dans `/admin`** : bouton « Ouvrir l'essai » sur une inscription. Il crée le commerce avec la roue de la
  démo (lots, chances, couleurs), passe l'inscription en « Essai en cours », ouvre 14 jours d'essai (21 avec le
  cadeau « essai prolongé ») et donne un lien d'invitation à envoyer (boutons WhatsApp, SMS, e-mail, copier).
  Ensuite : offre du commerce (essai, client payant, pause), « Prolonger de 7 jours », nouveau lien
  (sert aussi pour un mot de passe oublié). Passer en « Client » marque aussi l'inscription « Client ».
- **Le commerçant, `/espace`** : lien d'invitation (valable 14 jours, une seule fois) pour choisir son mot de passe,
  puis connexion par e-mail et mot de passe sur `/espace/connexion`. Onglets Caisse (chercher, valider, annuler un
  code), Suivi (scans, parties, avis, retraits, coût, gros cadeaux, export Excel des clients), Roue (lots, chances,
  gros cadeaux, validité, délai, rejouer, lien d'avis Google, réservation, coordonnées, couleurs, logo, aperçu) et
  QR code (PNG, SVG, lien ; avertit tant que le site n'est pas sur rouelia.fr).
- **Le client, `/j/nom-du-commerce`** : parcours d'ALIA aux couleurs du commerce (invitation neutre à l'avis avec
  croix, prénom, téléphone, accord, case facultative pour recevoir des offres par SMS, roue, code avec date limite).
  Tirage fait par le serveur, une partie par téléphone sur la période réglée, 60 parties par heure et par connexion.
  Règlement et données sur `/j/nom-du-commerce/reglement`. Pages non indexées.
- **Règles des packs** : fin d'essai sans passage en client, ou pause par Aymen : la roue affiche une pause, la
  caisse continue de valider les codes déjà gagnés. Lien de réservation après le jeu en Croissance et Premium
  seulement. Mention « Propulsé par Rouelia » sauf en Premium.
- **Vérifier** : `npm run check` (76 tests), puis `npm run preview` et, dans un autre terminal,
  `BASE=http://localhost:8787 ADMIN_PASSWORD=... npm run e2e-produit` (parcours complet dans un navigateur).
- ALIA reste sur Netlify ; la bascule sur Rouelia se fera quand le domaine sera branché (recréer ses lots et son logo).

## Groupe 1 des fonctions promises : fait le 3 octobre 2026
Tout est réglable dans l'onglet Roue de l'espace, avec les droits du pack (cadenas sinon) ; Aymen change le pack
d'un commerce dans `/admin`.
- Flyer et chevalet à imprimer (`/espace/flyer`) : chevalet A5 ou 4 flyers A6 sur A4, impression ou PDF. Tous packs.
- Roues saisonnières programmées (entre deux dates) : Croissance et Premium.
- Lots pour heures creuses (jours et créneau, priorité sur la saison) : Premium.
- Parrainage : le client partage un lien ; quand l'ami retire son cadeau, le parrain a un bonus remis en caisse
  sur son code. Croissance et Premium.
- Statistiques par employé (prénom choisi en caisse, tableau dans le Suivi) : Croissance et Premium.
- Liens Instagram et Facebook après le jeu : Croissance et Premium.
- Suivi de la rentabilité du mois (panier moyen et marge réglés dans l'onglet Roue) : Premium.
- Déjà faits à l'étape 1 : lien de réservation après le jeu, mention « Propulsé par Rouelia » retirée en Premium.

## Groupe 2, e-mails : codé le 3 octobre 2026 (Brevo, expéditeur contact@rouelia.fr)
- Client : champ e-mail facultatif sur la page du jeu ; code envoyé au nom du commerce (réponse au commerçant) ;
  un seul rappel 3 jours avant la date limite (Croissance et Premium).
- Commerçant : lien d'invitation envoyé tout seul à l'ouverture de l'essai et au « nouveau lien » ; mot de passe
  oublié sur `/espace/connexion` ; fin d'essai 3 jours avant puis le jour même ; rapport du lundi avec une action.
- Aymen : accusé de réception à chaque inscription et alerte interne sur contact@rouelia.fr.
- Tâche du matin : `worker.ts` (entrée du Worker) appelle `/api/cron` à 6 h UTC (`wrangler.jsonc`), protégée
  par `SESSION_SECRET`. Sans `BREVO_API_KEY`, rien n'est envoyé et rien ne casse.
- À tester en réel par Aymen une fois la clé posée : inscription test, ouverture d'essai, partie avec un e-mail.

## Promis sur le site mais pas encore codé (groupes 3 à 6, comptes à créer par Aymen)
- Groupe 3, SMS (Brevo, payant à l'envoi) : 50 ou 200 SMS par mois, rappels, relances, anniversaires, rapport SMS.
- Groupe 4, Google : veille de 3 concurrents (clé Places) ; alerte avis négatif, réponses aux avis, audit
  (accès API Business Profile, demande à faire tôt, validation par Google en plusieurs semaines).
- Groupe 5, IA (clé API Anthropic) : réponses aux avis en un clic, analyse des avis, mise en route et ajustement
  des lots « par IA ».
- Groupe 6, WhatsApp (compte vérifié par Meta, demande le SIREN) : rapport par WhatsApp.
- Domaine personnalisé (Premium) : sur demande, réglé à la main par Aymen dans Cloudflare.
- Espace client, côté abonnement : changer de pack, arrêter « en un clic », payer (étape 2, Stripe). L'export de la
  liste de clients existe ; la suppression d'un client se fait encore à la demande.
Services humains déjà possibles sans code : visio de 30 minutes, installation, point mensuel, audit de fiche Google,
refonte saisonnière, chevalet, support sous 24 h.

## Vérification légale et technique (1er octobre 2026)
- Mentions légales : complètes sauf SIREN et adresse. Hébergeur corrigé : Cloudflare, Inc. (et non Vercel).
- Confidentialité : complète (responsable, finalités, durées, Cloudflare et transfert hors UE, stockage local,
  droits). Manque l'adresse ; à compléter quand Stripe et un service d'e-mails seront ajoutés ; prévoir un accord
  de sous-traitance (RGPD, art. 28) avec chaque commerçant avant de traiter les données de ses clients.
- Cookies : bandeau conforme (Accepter et Refuser au même niveau, rien chargé avant accord, lien « Gérer les
  cookies »). Aucune mesure d'audience branchée (`NEXT_PUBLIC_ANALYTICS_SRC` vide). À ajouter si on en branche une :
  redemander le choix après 6 mois.
- Paiement Stripe : rien n'est codé (seul le champ `stripeCustomerId` est prévu). Les CGV disent seulement
  « paiement mensuel d'avance, une facture par paiement » : facturer à la main en attendant.
- Espace client : n'existe pas. Le site promet pourtant « Vous arrêtez en un clic » (tarifs, FAQ) : à coder avec
  Stripe (portail client Stripe) ou à reformuler.
- E-mails automatiques (bienvenue, « on vous prévient avant la fin de l'essai ») : pas codés.

## Pistes à creuser
- Paiement annuel avec remise (par exemple deux mois offerts), à prévoir dans Stripe et dans la section tarifs.
- Collecte des contacts clients avec consentement (case non cochée, lien de désinscription) et campagnes de retour
  (SMS ou e-mail aux clients qui ne sont pas revenus).
- Parrainage entre commerçants : un mois offert au parrain et au filleul. Il faudra un code de parrainage
  à l'inscription et l'application dans Stripe.
- Commerciaux à la commission : lien ou code par commercial (les UTM sont déjà enregistrés), suivi dans `/admin`,
  contrat d'agent commercial.
- Prospection par quartier avec démo en direct sur le téléphone du commerçant (la démo du site sert déjà à ça),
  QR code de démo dédié et `utm_source` par quartier.

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
- L'aperçu HTML avec des cadres (iframe) ne s'affiche pas sur le téléphone d'Aymen : lui envoyer des images PNG.
- Brevo : le bouton « Domaine embarqué » de Cloudflare = « Onboard domain » traduit ; Brevo propose une
  « Clé API MCP » à laisser désactivée.
- L'environnement de Claude ne peut joindre ni l'API Netlify ni l'API Cloudflare : les mises en ligne se font
  par import GitHub depuis le tableau de bord d'Aymen. Inutile de créer un jeton d'API pour Claude.
- La traduction automatique du navigateur traduit les noms et commandes affichés (« construction de npx… »,
  « coiffure de chantier », « ADMIN_MOT DE PASSE ») : les vraies valeurs sont correctes, ne pas retaper la traduction.
- Sur Cloudflare, « Réessayer » relance l'ancien build sur l'ancienne branche : pousser un commit pour un nouveau build.
- Tuer un processus avec `pkill -f "<motif>"` peut interrompre le shell de Claude si le motif figure dans la commande.
