# Audit complet de rouelia.fr (9 octobre 2026)

Mode : audit seul. Aucun fichier du site n'a été modifié. Version auditée : commit `6edc835` (celle en production).
Méthode : lecture du code, build Cloudflare, serveur local (moteur Cloudflare, `opennextjs-cloudflare preview`), 22 pages
visitées dans Chromium à 360, 375, 414, 768, 1024 et 1440 px (défilement complet, console, réseau, zones tactiles,
débordements), Lighthouse mobile sur 8 pages, HTML brut sans JavaScript, vérification des 48 liens et ressources internes,
analyse JSON des données structurées, envoi réel de chaque formulaire en local, 98 tests automatiques, et deux relectures
indépendantes du code (textes, puis conformité et sécurité).

Je ne suis pas juriste : tout point juridique ci-dessous est à faire valider par un professionnel.


## Suivi (mis à jour le 9 octobre 2026, lot « finalisation »)

Appliqué sur la branche de travail `claude/inspiring-mccarthy-13gj1h`, **pas encore en production** (attend « go prod ») :

- [x] Roue d'ALIA (C2) : traitée par Aymen lui-même, hors de ce dépôt.
- [x] I4 Rentabilité : « Rentable dès 2 clients » partout, calculée par `visitsToCoverPack` (source unique
      `profitability` dans `content.ts`, reprise par les tarifs, le JSON-LD Product et llms.txt).
- [x] Essai : délai annoncé « en général en quelques minutes (24 h maximum) » sur le site et dans l'e-mail.
- [x] Pack Essentiel : essai gratuit sur tous les packs ; « Créez-la pour moi » inclus à partir de Croissance
      (`doneForYou` dans `content.ts`, tableau des tarifs, /creer-ma-roue, formulaire avec choix du pack, e-mails, FAQ, llms.txt).
- [x] C4 Participation : la mention « Une participation par personne » ne s'affiche (jeu, flyer, règlement) que si le
      commerçant limite les parties (`participationRule` dans `lib/shop-config.ts`).
- [x] I11 « dix minutes » remplacé par « 5 minutes » dans les e-mails de fin d'essai ; heures creuses décrites comme le
      produit les fait (roue programmée sur des jours et heures) sur la page institut.
- [x] I3 Enzo / Aymen Henni : décision d'Aymen, le site garde « Enzo » (`brand.founder`).
- [x] I9 Mesure des conversions : compteurs sans cookie (lot conversion).
- [x] Coquilles « besoin,. » et « dites-le moi » corrigées.
- [ ] C3 Rappel e-mail promis aux clients en Essentiel : laissé tel quel (fonctions prévues, consigne D du 9 octobre).
- [ ] SMS et relances : prévus mais non codés, textes laissés tels quels (liste dans NOTES-PROJET.md).
- [ ] C1 SIREN, adresse, contact : en attente d'Aymen.
- [ ] I1, I2 confidentialité (Anthropic, Stripe, « Autre activité ») et relecture juridique : à faire.
- [ ] I5, I6, I7 en-têtes de sécurité, limites de débit : à faire.
- [ ] I8 purge des données, I10 performance de l'accueil : à faire.

---

## 1. Synthèse

**Verdict.** Le site est techniquement propre : aucune erreur de console, aucun lien cassé, aucun débordement réel, un seul H1
par page, données structurées valides, accessibilité et SEO à 100 sur Lighthouse. Le parcours est clair et la conformité « avis »
est réellement respectée dans la logique du jeu. Les vrais risques sont ailleurs : **pages légales incomplètes (SIREN, adresse)
alors que le site vend**, **l'ancienne roue ALIA (Netlify) qui demande encore l'avis avant le jeu**, quelques **textes du jeu
client inexacts selon le pack**, et **aucune mesure des conversions**. La performance mobile de l'accueil (76) reste en dessous
de l'objectif de 90.

| Axe | Note | Justification |
|---|---|---|
| 1. Design et identité | 8/10 | Charte cohérente sur toutes les pages, premier écran soigné ; pages légales et 404 plus pauvres que le reste. |
| 2. Expérience et parcours | 7,5/10 | Parcours clair, retour en haut vérifié ; 404 sans menu, calendrier qui décale la page. |
| 3. Mobile et responsive | 8,5/10 | Aucun débordement réel sur 6 largeurs ; quelques zones tactiles entre 32 et 40 px. |
| 4. Marketing et valeur | 7/10 | Message compris vite, objections traitées ; preuves encore légères et chiffre de rentabilité incohérent. |
| 5. Copywriting | 7/10 | Ton homogène, typographie soignée ; textes du jeu inexacts selon le pack, deux coquilles, quelques promesses de résultat. |
| 6. Conformité et juridique | 5,5/10 | Jeu conforme, mais SIREN et adresse absents, sous-traitants manquants, ancienne roue ALIA non conforme. |
| 7. SEO technique | 8,5/10 | HTML complet sans JS, balises uniques, sitemap à jour ; `/favicon.ico` en 404, metas courtes sur les pages légales. |
| 8. SEO éditorial | 7,5/10 | Pages métiers et blog profonds et uniques ; peu de pages au total, intentions « prix » et « comparatif » peu couvertes. |
| 9. GEO (IA) | 8,5/10 | llms.txt complet, robots IA autorisés, réponses courtes en tête de section ; quelques faits divergents entre sources. |
| 10. Accessibilité | 8/10 | Lighthouse 100, labels et focus présents ; bandeau d'avis sans pause au toucher, vidéo sans sous-titres. |
| 11. Fonctionnel | 8/10 | Formulaires, double réservation, .ics, honeypot : tout marche en local ; envois d'e-mails réels non vérifiables d'ici. |
| 12. Sécurité et fiabilité | 6,5/10 | Pas de secret dans le dépôt, SQL préparé, webhook signé ; aucun en-tête de sécurité, inscription sans limite, données non purgées. |
| 13. Analytique | 2/10 | Aucune mesure d'audience ni de conversion sur le site vitrine. |

---

## 2. Problèmes classés par gravité

### CRITIQUE

**C1. Mentions légales incomplètes alors que le site vend un abonnement.**
- Où : `rouelia/content.ts:69-70` (`siren: ""`, `address: ""`), rendu sur `/mentions-legales`, `/confidentialite`, `/cgv`.
- Preuve : les pages affichent « [à compléter] » et un bandeau jaune « Certaines informations légales sont encore à compléter ». `brand.phone` est vide (`content.ts:55`).
- Impact : obligation légale d'identification de l'éditeur (nom, adresse, SIREN, moyen de contact) ; nuit à la confiance juste avant l'achat.
- Correction : renseigner SIREN et adresse (domiciliation possible) dès réception. Effort faible.

**C2. L'ancienne roue ALIA (Netlify) propose l'avis Google AVANT le jeu.**
- Où : `alia-roue/components/Game.tsx:198-206` (hors rouelia.fr, même dépôt ; en ligne sur `jeu-aliacoiffure.netlify.app` selon `REPRISE.md`).
- Preuve : `start()` ouvre `setReviewOpen(true)` (« Souhaitez-vous laisser un avis Google ? »), puis le formulaire et la roue.
- Impact : c'est le schéma que Google considère comme une sollicitation liée à une récompense ; or Alia Coiffure est le premier témoignage affiché sur rouelia.fr. Risque de suppression d'avis sur la fiche du salon et de contradiction publique.
- Correction : basculer le salon sur la roue Rouelia (`/j/alia-coiffure`), ou déplacer l'invitation après le gain dans `alia-roue`. Effort faible.

**C3. Le jeu client promet un rappel par e-mail que le pack Essentiel n'envoie pas.**
- Où : `components/jeu/ShopGame.tsx:478`, `app/j/[slug]/reglement/page.tsx:36`, `lib/mail-templates.ts:90` ; logique `lib/notify.ts:87` (`!packFeatures(shop.pack).reminders` → pas d'envoi) et `lib/shop-config.ts:253`.
- Impact : information inexacte au consommateur dans le règlement d'un jeu, chez tout commerçant Essentiel.
- Correction : n'afficher la mention du rappel que si le pack l'inclut. Effort faible.

**C4. « Une participation par personne » est affiché même quand le commerçant autorise les parties illimitées.**
- Où : `components/espace/Flyer.tsx:134` (texte fixe), `ShopGame.tsx:418`, `reglement/page.tsx:21` ; logique `lib/game.ts:134` et `:189` (limite seulement si `replayDays > 0`).
- Impact : règlement de jeu faux dans ce réglage (le flyer imprimé le dit toujours).
- Correction : conditionner le texte au réglage. Effort faible.

### IMPORTANT

**I1. Sous-traitants absents de la politique de confidentialité.**
- Où : `content.ts:895-901` ne cite que Cloudflare, Brevo et Resend.
- Manquent : Anthropic (`lib/reviews.ts:98-109` envoie le texte et le prénom de l'auteur de l'avis aux États-Unis) et Stripe (paiement). Le formulaire « Autre activité » de `/pour-qui` n'est pas décrit.
- Correction : ajouter ces traitements. Effort faible. À valider par un juriste.

**I2. Pas de contrat de sous-traitance (article 28 du RGPD) ni de mentions B2B obligatoires dans les CGV.**
- Où : `content.ts:904-907` dit que Rouelia est sous-traitant des données des clients des commerçants, mais les CGV n'ont aucune clause de sous-traitance. Il manque aussi les pénalités de retard et l'indemnité de 40 € (article L441-10 du Code de commerce).
- Correction : à rédiger avec un juriste. Effort moyen.

**I3. Fondateur « Enzo » et éditeur « Aymen Henni » sans lien expliqué.**
- Où : `/a-propos` (« Je m'appelle Enzo », photo « Le fondateur de Rouelia… »), et `content.ts:895` (« Seul Aymen Henni a accès à vos données »), mentions légales.
- Impact : si Enzo est un nom d'usage, présenter un personnage comme une personne réelle peut être jugé trompeur, et un visiteur attentif voit deux noms. Ton brief d'audit dit « Fondateur : Aymen ».
- Correction : choisir un nom unique, ou écrire une fois « Enzo, nom d'usage d'Aymen Henni ». Effort faible.

**I4. Chiffre de rentabilité incohérent.**
- Où : `content.ts:513` et `:543` disent « 3 clients ». Le calcul de référence `visitsToCoverPack(49, 35, 0.75)` donne 2 (`lib/simulator.ts:59`, test `tests/simulator.test.ts:35`), et `textes/tarifs.ts:78` raisonne avec 2.
- Correction : harmoniser (3 est prudent, il suffit alors d'expliquer pourquoi, ou passer à 2). Effort faible.

**I5. Aucun en-tête de sécurité.**
- Preuve : `curl -I` sur le serveur local ne renvoie ni HSTS, ni CSP, ni X-Frame-Options, ni Referrer-Policy. `next.config.ts` ne pose que X-Robots-Tag sur `*.workers.dev`.
- Impact : l'espace commerçant (caisse) et l'admin peuvent être intégrés dans un cadre (détournement de clic).
- Correction : en-têtes de base dans `next.config.ts` (`headers()`). Effort faible. HSTS est peut-être activé dans Cloudflare, je n'ai pas pu le vérifier.

**I6. `/api/inscription` sans limite de débit.**
- Où : `app/api/inscription/route.ts` (aucun `hit()`), alors que les autres formulaires en ont.
- Impact : un robot peut faire envoyer des accusés de réception à n'importe quelle adresse (quota e-mail, réputation du domaine).
- Correction : `hit("inscription:" + ip)` comme les autres routes. Effort faible.

**I7. Limite des essais de connexion admin inefficace.**
- Où : `app/api/admin/login/route.ts:6` utilise une `Map` en mémoire, propre à chaque instance du Worker.
- Correction : utiliser `hit()` sur D1. Effort faible.

**I8. Durées de conservation annoncées mais non appliquées.**
- Où : la purge des parties n'a lieu qu'à l'ouverture de la liste par le commerçant (`lib/game.ts:284`). `bookings`, `wheel_requests`, `play_locks`, `rates` (adresses IP) et `signups` ne sont jamais purgés, alors que le règlement promet une suppression automatique (`reglement/page.tsx:37`).
- Correction : purge dans la tâche du matin (`lib/notify.ts`). Effort moyen.

**I9. Aucune mesure des conversions.**
- Preuve : `NEXT_PUBLIC_ANALYTICS_SRC` est vide ; il n'y a aucun événement sur « Créer ma roue », rendez-vous, demandes ou inscriptions.
- Impact : impossible de savoir ce qui convertit.
- Correction : mesure sans cookie (Plausible, ou Matomo configuré en exemption), plus 4 événements. Effort faible à moyen.

**I10. Performance mobile de l'accueil en dessous de l'objectif.**
- Preuve : Lighthouse mobile local sur `/` : performance 76, LCP 4,8 s, 928 Kio. Les autres pages font entre 84 et 93.
- Causes principales relevées : JavaScript non utilisé (environ 25 Kio par page), CSS bloquant, travail du fil principal.
- Les mesures sont faites sur le serveur local, à confirmer sur rouelia.fr avec PageSpeed Insights.
- Correction : charger la roue d'offres et la roue du hero plus tard, mesurer en production avant d'aller plus loin. Effort moyen.

**I11. Promesses ou fonctions annoncées qui ne correspondent pas au produit.**
- **SMS** : la case « Recevoir les offres par SMS » (`ShopGame.tsx:32`, règlement) recueille un accord pour des envois qu'aucun pack ne fait.
- **Rapport** : « Pour vous envoyer votre rapport » sur le champ téléphone de l'inscription (`content.ts:766`), alors que le rapport part par e-mail.
- **E-mails de fin d'essai** : ils proposent un appel de « dix minutes » (`mail-templates.ts:260`, `:281`, `:335`), contre 5 minutes partout ailleurs.
- **Heures creuses** : décrites comme « un cadeau valable seulement l'après-midi » (`textes/metiers.ts:274`), alors que le produit joue une autre roue pendant ces créneaux.
- Correction : aligner les textes sur le produit. Effort faible.

### MINEUR

- **M1. Calendrier de `/rendez-vous`** : le formulaire est décalé quand les créneaux arrivent (CLS 0,107, Lighthouse). Les boutons de jour ont un nom accessible différent du texte affiché (`label-content-name-mismatch`). Correction : réserver la hauteur du calendrier. Effort faible.
- **M2. `/favicon.ico` en 404** : seul `icon.svg` est déclaré. Pas d'icône Apple (`apple-touch-icon`). Effort faible.
- **M3. Page 404 sans menu ni pied de page**, avec un seul lien. Effort faible.
- **M4. Metas des pages légales très courtes** (35 à 94 caractères) et titres génériques. Effet sans importance pour le référencement, les compléter reste cohérent. Effort faible.
- **M5. Zones tactiles sous 44 px** : fil d'Ariane (32 px), puces métiers du bloc compact (40 px), lien WhatsApp de `/rendez-vous` (39 px). Les liens dans le texte sont exemptés par la norme WCAG. Effort faible.
- **M6. Coquilles** : « quand vous en avez besoin,. » (`textes/tarifs.ts:122`) et « dites-le moi » au lieu de « dites-le-moi » (`textes/a-propos.ts:39`). Effort faible.
- **M7. Tutoiement** dans le texte de parrainage partagé par le client : « Tente ta chance toi aussi » (`ShopGame.tsx:39`). Le choix peut se défendre, puisque c'est un client qui écrit à un ami. Effort faible.
- **M8. Petites incohérences** :
  - « Un cadeau par compte » (`content.ts:674`) contre « par commerce » dans les CGV ;
  - « à deux minutes d'ici » (blog, CTA finaux) contre « 5 minutes » ailleurs ;
  - « Votre roue, prête aujourd'hui » alors que le parcours « Créez-la pour moi » prend 24 à 48 h ;
  - « au téléphone » dans la section contact, sans numéro affiché.

  Effort faible.
- **M9. Bandeau cookies affiché alors qu'aucun traceur n'existe**, et choix gardé sans durée alors que la page Cookies promet de le redemander après 6 mois (`CookieBanner.tsx:52`). Effort faible.
- **M10. Exports Excel sans neutralisation des formules** (`app/api/espace/export/route.ts`) : un prénom commençant par « = » est interprété par Excel. Effort faible.
- **M11. Déconnexion de l'espace commerçant** : la session n'est pas invalidée côté serveur, le cookie reste valable 60 jours. Effort faible.
- **M12. Débordement de 8 px sur `/a-propos` à 360-414 px** (fond décoratif de la photo). Il est rogné, je n'ai mesuré aucun défilement horizontal réel ; à confirmer sur iPhone. Effort faible.

### AMÉLIORATION

- **A1.** Le bandeau des avis ne s'arrête qu'au survol : ajouter la pause au toucher, comme le bandeau des avantages.
- **A2.** La vidéo n'a pas de sous-titres. Le résumé texte existe mais ne reprend pas la voix off mot pour mot. Ajouter une transcription complète, ou des sous-titres facultatifs.
- **A3.** Les témoignages n'ont ni ville (Pizza Time, Bangkok Factory, Elsa Beauty) ni lien vers la fiche Google du commerce. Une preuve plus vérifiable rassure davantage.
- **A4.** Les clics vers Google sont présentés comme un « résultat de la roue » dans les e-mails et l'espace commerçant (`mail-templates.ts:220`, `:373`, `Suivi.tsx:80`). C'est légal, mais cela rapproche jeu et avis dans l'esprit du commerçant. Les présenter comme une statistique neutre.
- **A5.** Quelques promesses de résultat formulées comme certaines (« Plus de clients fidèles », « ramène au comptoir dès le lendemain »). Les nuancer, en restant dans le ton.

---

## 3. Ce qui fonctionne bien (à ne pas toucher)

- **Conformité du jeu, vérifiée dans le code** :
  - le cadeau est tiré par le serveur sans aucune donnée d'avis (`lib/game.ts`) ;
  - l'invitation n'apparaît qu'après le gain, identique pour tous, sans demande de note ni tri (`ShopGame.tsx`) ;
  - la démo fait exactement pareil ;
  - seuls les avis de commerçants marqués `valide: true` s'affichent, avec leur date et l'encadré « Comment ces avis sont recueillis » ;
  - aucun texte du site, du JSON-LD ou de llms.txt ne promet « plus d'avis ».
- **Technique** :
  - 0 erreur de console sur les 22 pages et 6 largeurs ;
  - 0 lien interne cassé sur 48 ;
  - 0 défilement horizontal réel ;
  - un seul H1 par page, aucun saut de niveau de titre, titres et descriptions uniques ;
  - JSON-LD valide sur toutes les pages ;
  - sitemap à jour (21 URL) ;
  - robots.txt avec les robots IA autorisés ;
  - llms.txt (6 Ko) et llms-full.txt (90 Ko) exacts ;
  - Lighthouse accessibilité, bonnes pratiques et SEO à 100 sur les 8 pages mesurées, CLS 0 partout sauf `/rendez-vous`.
- **Navigation** : chaque nouvelle page s'ouvre en haut (vérifié), le menu mobile se referme, les ancres s'arrêtent sous le menu.
- **Formulaires, testés en local** :
  - validation des champs et case RGPD ;
  - piège anti-robots ;
  - limite de débit ;
  - message de succès et d'erreur.
- **Rendez-vous** :
  - double réservation refusée (409) ;
  - heure de Paris, été comme hiver ;
  - délai de 2 h respecté ;
  - fichier .ics correct (tests automatiques).
- **Sécurité** :
  - aucun secret dans le dépôt ni dans l'historique git ;
  - requêtes SQL préparées ;
  - échappement HTML des e-mails ;
  - webhook Stripe signé ;
  - mots de passe en PBKDF2.
- **Bandeau cookies** : refuser est aussi simple qu'accepter, et rien n'est chargé avant l'accord.
- **Charte et ton** : identiques sur toutes les pages. Vouvoiement, aucun tiret cadratin, espaces insécables gérées automatiquement.

---

## 4. Éléments manquants importants

1. SIREN, adresse et moyen de contact de l'éditeur (C1).
2. Mesure des conversions, sans cookie de préférence (I9).
3. Preuves plus vérifiables : ville et lien vers la fiche Google des commerçants, et un cas chiffré réel (le bloc « pilotes » est prêt dans `content.ts`, désactivé).
4. Clause de sous-traitance RGPD dans les CGV (I2).
5. En-têtes de sécurité (I5).
6. Une page qui compare Rouelia aux autres solutions (carte à tampons, application de fidélité). C'est une intention de recherche fréquente qui n'est pas couverte aujourd'hui.

**En trop ou en double** :
- le bandeau cookies tant qu'aucune mesure n'est branchée ;
- la case « offres par SMS » tant que le SMS n'existe pas ;
- les deux délais concurrents, « 2 minutes » et « 5 minutes ».

---

## 5. Plan d'action (10 actions, par rentabilité)

**Erreurs à corriger**
1. Renseigner SIREN, adresse et contact de l'éditeur (C1). Effort faible.
2. Mettre l'ancienne roue ALIA en conformité, ou basculer le salon sur Rouelia (C2). Effort faible.
3. Rendre exacts les textes du jeu client : rappel selon le pack, participation selon le réglage, flyer (C3, C4). Effort faible.
4. Compléter la politique de confidentialité (Anthropic, Stripe, formulaire « Autre activité ») et faire relire CGV et RGPD par un juriste (I1, I2). Effort faible, puis moyen.
5. Ajouter les en-têtes de sécurité, la limite de débit sur l'inscription et sur la connexion admin (I5, I6, I7). Effort faible.
6. Harmoniser les faits : 2 ou 3 clients, 5 minutes, Enzo ou Aymen, SMS, « dix minutes », heures creuses, deux coquilles (I3, I4, I11, M6, M8). Effort faible.
7. Purge automatique des données selon les durées annoncées (I8). Effort moyen.

**Idées facultatives**

8. Brancher une mesure sans cookie avec 4 événements de conversion (I9).
9. Mesurer l'accueil sur rouelia.fr avec PageSpeed, puis charger les roues plus tard si le score réel reste sous 90 (I10).
10. Renforcer les preuves (ville et fiche Google des témoignages, un cas chiffré ALIA), puis ajouter une page comparative.

---

## 6. Ce que je n'ai pas pu tester ou vérifier

- **rouelia.fr en production** : mon réseau ne l'atteint pas. Tous les tests ont été faits sur un build local identique, avec le moteur Cloudflare. Les en-têtes ajoutés par Cloudflare (HSTS, compression, cache), la redirection www et HTTPS et les vrais Core Web Vitals restent donc à vérifier.
- **Réception réelle des e-mails** sur contact@ et chez le client : aucune clé Brevo ni Resend n'est disponible en local. Les routes répondent correctement et les messages sont construits, mais l'envoi n'est pas prouvé. À tester toi-même avec ton e-mail.
- **Safari sur iPhone réel**, et le clavier qui masque les champs sur un vrai téléphone.
- **Paiement Stripe, espace commerçant, QR code et caisse** : non retestés dans cet audit, faute de comptes de test.
- **Validateur officiel de Google** (Rich Results Test) : inaccessible d'ici. Le JSON-LD a été vérifié par analyse JSON et par cohérence avec le contenu visible.
- **Sources juridiques officielles** (Légifrance, Google, DGCCRF) : bloquées par mon réseau.

---

## 7. À faire valider par un juriste, ou à me confirmer

1. Mentions légales, CGV (sous-traitance RGPD, pénalités B2B) et politique de confidentialité, une fois le SIREN obtenu.
2. Le régime du jeu : loterie publicitaire gratuite et règlement. La base légale « consentement » pour des données indispensables pour jouer pourrait plutôt relever de l'exécution du contrat.
3. Enzo, nom d'usage ou personne distincte : comment le présenter (I3).
4. Le lien éventuel entre Alia Coiffure et l'éditeur du site. S'il y en a un, il doit être indiqué à côté du témoignage.
5. La ville de Pizza Time (aucun Pizza Time trouvé dans le 94, seulement à Champs-sur-Marne, dans le 77) et celles de Bangkok Factory 94 et Elsa Beauty.
6. Les chiffres de la DGCCRF cités sur `/utilisation-responsable` (2 ans, 300 000 €) : confirmés par deux sources secondaires et par le guide d'avocat fourni, mais pas lus sur Légifrance.
