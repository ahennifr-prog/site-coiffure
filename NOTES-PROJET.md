# Notes du projet Rouelia (mises à jour le 9 octobre 2026)

À lire en premier en reprenant le travail, avec `rouelia/REPRISE.md` (historique technique détaillé),
`AUDIT-ROUELIA.md` (audit complet) et `CONVERSION-ROUELIA.md` (analyse de conversion).

## État des branches

- **Production** : `claude/great-lovelace-lpyydk`. Chaque push déploie rouelia.fr (Cloudflare Workers). Dernier commit
  déployé : `6edc835` (page Pour qui, bandeau défilant, retour en haut de page, boutons sans doublon).
- **Travail** : `claude/inspiring-mccarthy-13gj1h`. Production + documents (audit, conversion, notes) + le lot
  « modifications ciblées » (14 points de conversion) + le lot « finalisation » du 9 octobre. **Les deux lots attendent « go prod »**.
- Règle : on travaille sur la branche de travail, on vérifie, puis Aymen dit « go prod » et on avance la branche de production
  (avance rapide, sans réécrire l'historique).

## Décisions prises par Aymen

- **Essai de 14 jours** : gratuit sur tous les packs, Essentiel compris. Ouvert à la main par Aymen dans `/admin` ; le site
  annonce « en général en quelques minutes (24 h maximum) ».
- **« Créez-la pour moi »** (création de la roue par Aymen) : PAS incluse dans l'Essentiel (le commerçant crée sa roue
  lui-même en 5 minutes), incluse à partir de Croissance. Source unique : `doneForYou` dans `content.ts`. Le formulaire
  demande le pack de l'essai (Croissance ou Premium) et renvoie les visiteurs de l'Essentiel vers l'outil libre.
  Chaque demande crée aussi un « essai à ouvrir » dans `/admin` (source « Créez-la pour moi », pack choisi) : on prépare la roue,
  puis le bouton habituel crée le commerce et envoie l'accès.
- **Rentabilité** : « Rentable dès 2 clients », calculée (`profitability` dans `content.ts`, test dans `tests/simulator.test.ts`).
- **Fondateur** : le site garde « Enzo » (`brand.founder`, source unique). La photo de /a-propos est une vraie photo du
  fondateur (alt et JSON-LD rétablis). Pastille « À propos » : photo de profil du Drive (9 octobre), recadrée en 96 et 192 px
  (`FOUNDER_AVATAR`, `scripts/photo-profil.sh`).
- **Avis de commerçants** : sans date ni ville pour l'instant ; d'autres avis seront ajoutés petit à petit.
  10 octobre : 4 avis ajoutés et publiés (Yoga Sens, Coffee Shop Paris, Spa Traditionnel, Cleans Cars), logos du Drive, sans note sur 5.
  Nails Studio publié aussi, avec son nouveau logo « L'Art de l'Ongle » et un texte reformulé sans « note Google qui augmente »
  (« Nos clientes repartent ravies, et ça se voit sur notre fiche Google. ») : choix d'Aymen le 10 octobre, validé par le commerçant le jour même
  (accord à garder avec les autres).
- **Participation au jeu** : mention affichée seulement si le commerçant limite les parties (réglage « Rejouer après »).
- **Fonctions prévues, en cours de développement** : leurs textes restent affichés tels quels (consigne du 9 octobre).
  Liste à jour ci-dessous, section « Fonctions affichées non codées ».
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

## Espace admin (/admin), refait le 9 octobre 2026

- **Inscriptions** : filtres À ouvrir, Essai en cours, Clients, Perdus, Tous ; recherche (y compris dans les notes) ; export Excel.
  Chaque fiche se modifie (crayon : commerce, prénom, e-mail, téléphone, pack ; l'e-mail, le prénom et le téléphone du commerce
  suivent si l'essai est ouvert), a des notes privées enregistrées toutes seules, et des boutons Appeler, WhatsApp, E-mail.
- **« Créez-la pour moi »** : la fiche montre lots souhaités, message, adresse, fiche Google et logo (téléchargeable). Trois étapes :
  « Créer sa roue » (sans prévenir le commerçant ; le logo envoyé est posé sur la roue), « Préparer sa roue » (ouvre son espace,
  onglet Roue, dans un nouvel onglet), « Envoyer son accès ». Le bouton « Ouvrir l'essai et envoyer l'accès tout de suite » reste possible.
- **Appels** : réservations de /rendez-vous, à venir d'abord ; « Appel fait », notes, annulation (le créneau redevient libre).
- **Demandes** : formulaires « Créez-la pour moi » et « Autre activité » ; « Traitée », notes, suppression ; « Ajouter aux inscriptions »
  pour une ancienne demande « Créez-la pour moi » (celles d'avant le 9 octobre au soir, dont le test d'Aymen).
- **Mesure** : compteurs sans cookie.
- Pastilles rouges sur les onglets : essais à ouvrir, appels à venir non faits, demandes non traitées.
- Code : `components/admin/*`, `lib/admin.ts`, routes `app/api/admin/*`. Tests : `tests/admin.test.ts`.

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

## Fonctions affichées non codées (état au 9 octobre 2026)

| Fonction | Où elle apparaît | Pack |
|---|---|---|
| Envoi d'offres par SMS aux clients | Case « Recevoir les offres par SMS » du jeu, règlement du jeu, tuile « Clients joignables par SMS » de l'espace | Tous (consentement recueilli, aucun envoi) |
| Relances des clients (SMS ou autres) | Notes et audit ; aucune page ne les vend explicitement | Non défini |
| Publication des réponses aux avis sur Google | « Vous répondez à vos avis en un clic », tableau « Réponses aux avis en un clic » | Croissance, Premium (seul le brouillon de réponse par IA est codé, à copier à la main ; l'API Google Business Profile n'est pas branchée) |
| Domaine personnalisé | Tableau des tarifs, ligne « Sans mention Propulsé par Rouelia, domaine personnalisé » | Premium |
| Rappel e-mail aux clients en Essentiel | Pied de l'e-mail du code « Un seul rappel vous sera envoyé » et règlement, affichés quel que soit le pack | Essentiel (le rappel n'est envoyé qu'en Croissance et Premium, et seulement si le client a laissé un e-mail) |

Codé et automatique : rappel e-mail avant expiration (Croissance, Premium), e-mails de fin d'essai, rapport du lundi,
parrainage, roues saisonnières, roue des heures creuses, liens après le jeu, statistiques par employé, suivi de rentabilité,
brouillons de réponses aux avis par IA (clé `ANTHROPIC_API_KEY` requise).
Services rendus à la main (pas du code) : création « Créez-la pour moi », visio de configuration, point mensuel, audit de
fiche Google, refonte saisonnière, chevalet offert, support sous 24 h, installation sur place.

## Ce qui reste à fournir par Aymen

0. Plus tard, pour chaque témoignage : métier, ville, lien de fiche Google, date (champs prêts, vides).

1. SIREN et adresse (domiciliation possible) : `company.siren` et `company.address` dans `content.ts`.
2. Clé `RESEND_API_KEY` (facultative, Brevo fonctionne) et numéro WhatsApp business.
3. Lien éventuel entre Alia Coiffure et l'éditeur (à indiquer près du témoignage s'il existe).
4. Plus tard, un cas chiffré ALIA avec accord écrit.
5. Clés Stripe en mode réel (après le SIREN) et accès à l'API Google Business Profile.
6. Relecture juridique : CGV (sous-traitance RGPD, pénalités B2B), confidentialité (Anthropic, Stripe), règlement du jeu.

## Prochaines étapes proposées (rien n'est commencé)

- Corrections sûres de l'audit (si Aymen écrit « MODE : AUDIT + CORRECTIONS SÛRES ») : textes du jeu exacts selon le pack et
  le réglage, « 2 clients », coquilles, en-têtes de sécurité, limite de débit sur l'inscription et la connexion admin.
- Les 5 actions de conversion : haut de page mobile, retrait du bandeau cookies et mesure sans cookie, « Ensuite : … » sous
  chaque bouton d'envoi, créneaux d'appel et lien WhatsApp, témoignages vérifiables.
