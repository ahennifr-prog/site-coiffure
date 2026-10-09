# Notes du projet Rouelia (mises à jour le 9 octobre 2026)

À lire en premier en reprenant le travail, avec `rouelia/REPRISE.md` (historique technique détaillé),
`AUDIT-ROUELIA.md` (audit complet) et `CONVERSION-ROUELIA.md` (analyse de conversion).

## État des branches

- **Production** : `claude/great-lovelace-lpyydk`. Chaque push déploie rouelia.fr (Cloudflare Workers). Dernier commit
  déployé : `6edc835` (page Pour qui, bandeau défilant, retour en haut de page, boutons sans doublon).
- **Travail** : `claude/inspiring-mccarthy-13gj1h`. Production + documents (audit, conversion, notes) + le lot
  « modifications ciblées » du 9 octobre (14 points de conversion). **Ce lot attend « go prod »**.
- Règle : on travaille sur la branche de travail, on vérifie, puis Aymen dit « go prod » et on avance la branche de production
  (avance rapide, sans réécrire l'historique).

## Décisions prises par Aymen

- **Essai de 14 jours** : ouvert à la main par Aymen dans `/admin` (pas d'ouverture automatique). Le site doit annoncer un délai
  (à préciser) au lieu de « On vous écrit très vite ».
- **« Créez-la pour moi »** : essai sur le pack Essentiel (formulation à ajouter sur le formulaire).
- **Rentabilité** : « 2 clients » partout (aujourd'hui `content.ts` dit encore « 3 clients » : à corriger).
- **SMS et relances clients** : prévus mais **non codés**. Ne jamais les promettre (retirer ou reformuler la case « offres par SMS »
  et le rappel e-mail affiché aux clients des commerçants en Essentiel).
- **Roue d'ALIA** (`alia-roue/`, Netlify, avis demandé avant le jeu) : traitée par Aymen lui-même.
- **Vidéo** : on garde la vidéo et la voix off telles quelles. Aperçu : scène « 100 % gagnant ».
- **Roue d'offres** : gardée avant le contact en fin d'accueil.
- **Avis de commerçants** : les 4 (Alia Coiffure, Pizza Time, Bangkok Factory 94, Elsa Beauty) validés par écrit selon Aymen
  (8 octobre 2026), affichés avec logos, date et encadré « Comment ces avis sont recueillis ».
- **TVA** : franchise en base (art. 293 B du CGI), prix nets sans TVA. Le jour du passage à la TVA : `company.vatExempt = false`
  dans `content.ts` (affichage « Prix hors taxes »), Stripe en hors taxes, CGV et mentions à mettre à jour.
- **Pages légales** : modifications acceptées par Aymen le 8 octobre (page Cookies, confidentialité, phrase des CGV).
  Pour toute autre modification des pages légales : demander d'abord.

## Règles de conformité (à ne jamais enfreindre)

- Aucun lien entre le jeu ou le cadeau et un avis. Le cadeau est gagné quoi que fasse le client.
- L'invitation « Partager votre avis, c'est facultatif » apparaît **après** le gain, identique pour tous, sans demande de note,
  sans tri ni filtrage (`components/jeu/ShopGame.tsx`, démo `components/demo/PhoneScreen.tsx`).
- Jamais de promesse « plus d'avis », ni sur le site, ni dans le JSON-LD, ni dans `llms.txt`, ni dans les e-mails.
- Avis de commerçants : `valide: true` seulement avec l'accord écrit du commerçant (`rouelia/textes/avis-commercants.ts`).
- Aucun chiffre ni témoignage inventé, aucune fausse urgence ni rareté, aucun compte à rebours.
- Rédaction : vouvoiement, aucun tiret cadratin ou demi-cadratin, aucun emoji (contrôle : `npm run check-copy`).
- Secrets : jamais dans le dépôt ni demandés dans le chat ; ce sont des secrets Cloudflare posés par Aymen.

## Constantes

- `rouelia/config.ts` : `EMAIL` = contact@rouelia.fr ; `WHATSAPP_NUMBER` = 33672780326 (provisoire, une ligne à changer pour
  le numéro business) ; créneaux d'appel `BOOKING` (lundi à vendredi, plages `WEEKDAY_HOURS` : 9 h à 12 h, 12 h à 14 h, 14 h à 17 h,
  18 h à 20 h ; 5 minutes, 14 jours, délai 2 h, jours bloqués) ; `FOUNDER_AVATAR` (photo de la pastille « À propos »,
  null = initiale du fondateur).
- Mesure sans cookie : `lib/mesure-events.ts` (liste des événements), compteurs par jour dans la table `stats`
  (commerce `_site`), lecture dans `/admin` (« Mesure du site »). Aucun bandeau cookies : ne pas ajouter de traceur
  sans remettre un consentement.
- E-mails : Resend si le secret `RESEND_API_KEY` est posé, sinon Brevo (`BREVO_API_KEY`, déjà en place) ; voir
  `rouelia/DEPLOIEMENT.md`, section 3 quinquies.
- Textes : `rouelia/content.ts` (accueil, tarifs, légal), `rouelia/textes/*.ts` (pages SEO, formulaires, avis, Pour qui).
- Fondateur affiché : Enzo (nom d'usage) ; éditeur légal : Aymen Henni (lien entre les deux à décider, voir audit I3).

## Ce qui reste à fournir par Aymen

0. Lot du 9 octobre : une vraie photo de profil (carré, visage centré) si vous voulez une photo dans la pastille ;
   les champs `metier`, `ville`, `ficheGoogle` de chaque témoignage ; la règle « Créez-la pour moi » et Essentiel ;
   le prénom affiché (Enzo ou Aymen, `brand.founder`).

1. SIREN et adresse (domiciliation possible) : `company.siren` et `company.address` dans `content.ts`.
2. Clé `RESEND_API_KEY` (facultative, Brevo fonctionne) et numéro WhatsApp business.
3. Délai promis pour l'ouverture de l'essai.
4. Réponses aux questions Q3 à Q7 de `CONVERSION-ROUELIA.md` (haut de page mobile, WhatsApp, présence humaine et photo,
   page comparative, nouveaux créneaux d'appel).
5. Décision Enzo / Aymen Henni, et lien éventuel entre Alia Coiffure et l'éditeur (à indiquer près du témoignage s'il existe).
6. Villes et liens des fiches Google des commerçants témoins ; plus tard, un cas chiffré ALIA avec accord écrit.
7. Clés Stripe en mode réel (après le SIREN) et accès à l'API Google Business Profile.
8. Relecture juridique : CGV (sous-traitance RGPD, pénalités B2B), confidentialité (Anthropic, Stripe), règlement du jeu.

## Prochaines étapes proposées (rien n'est commencé)

- Corrections sûres de l'audit (si Aymen écrit « MODE : AUDIT + CORRECTIONS SÛRES ») : textes du jeu exacts selon le pack et
  le réglage, « 2 clients », coquilles, en-têtes de sécurité, limite de débit sur l'inscription et la connexion admin.
- Les 5 actions de conversion : haut de page mobile, retrait du bandeau cookies et mesure sans cookie, « Ensuite : … » sous
  chaque bouton d'envoi, créneaux d'appel et lien WhatsApp, témoignages vérifiables.
