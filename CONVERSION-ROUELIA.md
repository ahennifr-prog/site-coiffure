# Analyse de conversion et de neuromarketing de rouelia.fr (9 octobre 2026)

Mode : analyse seule, aucun fichier du site modifié. Version analysée : celle en production (commit `6edc835`).

Méthode :
- parcours du site réel, en build local identique à la production, à 375 × 667 px (iPhone SE ou 8) et à 1440 × 900 px ;
- lecture du code pour l'ordre exact des sections, des boutons et des animations ;
- mesure de la position de chaque élément clé.

Je n'ai aucune donnée de trafic réel. Tout ce qui touche au comportement des visiteurs est donc une **hypothèse à tester**, sauf mention « fait mesuré ».

Légende :
- **[Fait]** : mesuré ou lu dans le code.
- **[Principe]** : mécanisme documenté en psychologie ou en ergonomie.
- **[Opinion]** : mon avis.

---

## 1. Verdict global

Le site est **au-dessus de la moyenne** des sites de SaaS pour commerçants : message clair, bénéfice formulé du point de vue du commerçant, prix publics, essai sans carte, ton humain, aucune pression artificielle.

Il perd probablement des conversions à trois endroits :
- **le premier écran sur téléphone**, où le bouton et le sous-titre sont sous la ligne de flottaison, en partie cachés par le bandeau cookies ;
- **la preuve**, honnête mais encore légère et tardive ;
- **le flou sur « ce qui se passe après » chaque action**, puisque l'essai n'est pas ouvert tout de suite.

L'ordre des sections est globalement bon. Il faut des ajustements, pas une refonte.

| Axe | Note | Justification |
|---|---|---|
| 1. Premier écran | 7/10 | Excellent sur ordinateur ; sur téléphone, le bouton du haut de page est à 810 px pour un écran de 667 px [Fait]. |
| 2. Structure et ordre | 7,5/10 | Logique comprendre, croire, décider, agir respectée ; la preuve arrive tard et la timeline est longue. |
| 3. Psychologie | 7/10 | Gamification, réciprocité et réduction du risque bien exploitées ; preuve sociale et autorité sous-exploitées. |
| 4. Copywriting | 7,5/10 | Titres orientés bénéfice, langage simple ; deux objections clés absentes de l'accueil. |
| 5. Design et attention | 8/10 | Hiérarchie nette, bouton principal contrasté, rythme agréable ; photo du fondateur qui fait « banque d'images ». |
| 6. Parcours et friction | 6/10 | Formulaires courts, mais l'après-action reste flou et les créneaux d'appel tombent pendant les coups de feu. |
| 7. Preuves et confiance | 5,5/10 | 4 témoignages et des logos, mais génériques, sans ville ni chiffre ; mentions légales incomplètes. |
| 8. Prix et offres | 7,5/10 | Offre recommandée au centre, prix ramené à la journée ; position tardive sur téléphone. |
| 9. Mobile | 6,5/10 | Pas de bug, mais 16,5 écrans de défilement [Fait] et une section tarifs de 3 250 px. |
| 10. Entrées multiples | 7/10 | Pages métiers, blog et FAQ ont tous un appel à l'action ; rien de prévu pour le visiteur qui vient de jouer chez un autre commerçant. |
| 11. Mesure | 1/10 | Aucun indicateur en place [Fait] : impossible de valider quoi que ce soit aujourd'hui. |

---

## 2. Le parcours du visiteur, étape par étape (téléphone 375 px)

Position mesurée du haut de chaque élément [Fait] : page de **10 986 px, soit 16,5 écrans**.

| Écran | Ce qu'il voit | Ce qu'il pense | Risque ou levier |
|---|---|---|---|
| 0 à 1 (0 à 667 px) | Menu avec « Créer ma roue », surtitre « Pour les commerces de quartier », H1 « Offrez un jeu à vos clients. Ils reviennent. », grande roue colorée. À la première visite, **le bandeau cookies couvre le bas de l'écran** [Fait, capture]. | « Un jeu pour mes clients ? C'est un gadget ? Ça coûte combien ? » | Le *pourquoi* (« ils reviennent ») est clair. Le *comment* (QR code, cadeau pour la prochaine visite) n'est pas visible, puisque le sous-titre est à 715 px. Le premier geste demandé est « Refuser ou Accepter », pas « Créer ma roue ». |
| 1 à 1,5 | Sous-titre, boutons « Créer ma roue » et « Réserver un appel » (810 px), puis « 14 jours gratuits, Sans carte bancaire, Sans engagement » (946 px). | « D'accord, un cadeau pour qu'ils reviennent. Gratuit 14 jours, pas de carte. » | Bon moment de réassurance, mais il n'arrive qu'après un défilement. |
| 1,5 à 2 | Titre « Voyez la roue en action. », vidéo (son) et bandeau des avantages. | Le curieux lance la vidéo, le pressé fait défiler. | La vidéo concrétise très bien. Le bandeau répète la réassurance. |
| 2 à 4,4 | « Comment ça marche » : 3 étapes avec illustrations (environ 1 500 px). | « Simple, sans appli. » | Clair, mais long pour 3 idées : c'est l'endroit où le pressé décroche. |
| 4,4 à 5,2 | Avis de commerçants (4 cartes, logos) et « Comment ces avis sont recueillis ». | Le sceptique : « 4 avis, tous à 5 étoiles, tous d'octobre… » | La preuve arrive après plus de 4 écrans. Les logos rassurent par familiarité locale. |
| 5,2 à 6 | Bloc « Coiffeur, restaurant, institut… ? » avec les métiers. | « Ça marche pour moi. » | Bonne identification. |
| 6 à 11 | Tarifs : rentabilité, puis 3 cartes empilées (Essentiel d'abord), garanties (4 120 à 7 378 px). Premier prix visible à **7 écrans** (4 682 px). | Celui qui est sensible au prix : « Enfin le prix. 29 €, ça va. » | Très long sur téléphone : chaque carte fait environ un écran. |
| 11 à 12,5 | FAQ (5 questions). | Objections : légalité, coût des cadeaux, après l'essai. | Bien placée, au moment où l'on doute avant de décider. |
| 12,5 à 15 | Roue d'offres, puis contact (WhatsApp, e-mail, appel) à 9 480 px. | « Je tente ma chance. » Puis : « Je préfère en parler à quelqu'un. » | Bonne fin de parcours. Mais **WhatsApp, le canal le plus naturel pour ce public, est à 14 écrans**. |

Sur ordinateur, le premier écran est presque parfait. H1, sous-titre, deux boutons, réassurance et roue sont visibles sans défiler, et la vidéo commence à 747 px [Fait]. En revanche, la timeline épinglée demande environ **3 000 px de défilement pour 3 étapes** [Fait], et les tarifs commencent à 6 écrans.

**Par profil (hypothèses) :**
- **Le pressé** : bien servi sur ordinateur. Sur téléphone, il risque de partir pendant la timeline sans avoir vu le prix.
- **Le sceptique** : il trouve la page « Utilisation responsable », les prix publics et l'essai sans carte. Il bute sur des témoignages peu vérifiables et sur le nom du fondateur qui diffère dans les mentions légales.
- **Le curieux** : la mini roue et la vidéo le gardent, et la roue d'offres finale récompense sa curiosité. C'est le profil le mieux servi.
- **Le comparateur** : rien ne situe Rouelia face à une carte à tampons ou une appli de fidélité, alors que c'est sa vraie question.
- **Le visiteur venu d'un QR code chez un autre commerçant**, via le lien « Propulsé par Rouelia » : il arrive sur l'accueil générique (`href="/"` dans `ShopGame.tsx`), sans reconnaissance de ce qu'il vient de vivre. C'est le visiteur le plus chaud, et il est accueilli comme un inconnu.
- **Le visiteur venu de Google** (pages métiers) : bien servi, avec un H1 de son métier, des boutons en haut et en bas, et des exemples de lots.
- **Le visiteur venu d'une IA** : il arrive souvent sur une page profonde (FAQ, blog, utilisation responsable), qui a un appel final. Correct.

---

## 3. Ordre des sections : actuel et recommandé

**Mon verdict : l'ordre actuel est bon dans sa logique** (comprendre, croire, se projeter, décider, agir). Je ne propose que trois ajustements, des hypothèses à tester une par une.

```
ACTUEL                                    RECOMMANDÉ
1. Haut de page (H1, roue, boutons)       1. Haut de page, téléphone réordonné :
                                             H1, sous-titre, boutons, réassurance, puis roue
2. Vidéo                                  2. NOUVEAU : bande de preuve compacte
                                             (4 logos + « Ils l'utilisent déjà », lien vers les avis)
3. Bandeau des avantages                  3. Vidéo
4. Comment ça marche (timeline)           4. Bandeau des avantages
5. Avis des commerçants                   5. Comment ça marche (plus court sur ordinateur)
6. Bloc « Pour qui »                      6. Avis des commerçants (complets)
7. Tarifs                                 7. Bloc « Pour qui »
8. FAQ                                    8. Tarifs
9. Roue d'offres + contact                9. FAQ
                                          10. Roue d'offres + contact (inchangé)
```

**Raisonnement :**

1. **Haut de page sur téléphone** : sous-titre et boutons avant la roue.
   - [Fait] Le bouton est à 810 px pour 667 px visibles.
   - [Principe] Ce qui est visible sans défiler concentre l'attention : la majorité du temps de lecture d'une page se passe dans le premier écran. Le *comment* et l'action doivent y être.
   - La roue reste juste dessous, toujours jouable. Une autre option est de la réduire à environ 240 px pour que tout tienne.
   - Hypothèse à tester.

2. **Une bande de logos tout de suite après le haut de page.**
   - [Principe] Preuve sociale et biais de familiarité : voir tôt des commerces réels et voisins (Alia Coiffure, Pizza Time, Bangkok Factory) baisse la méfiance avant même de lire.
   - Aujourd'hui, la preuve arrive à 4,4 écrans.
   - Coût faible : les logos existent déjà. Les avis complets restent à leur place.

3. **Timeline plus courte sur ordinateur.**
   - [Fait] 3 000 px de défilement épinglé pour 3 étapes.
   - [Principe] Effort perçu : l'effet de mise en scène est réussi, mais le défilement demandé dépasse ce que mérite le contenu.
   - Ramener le trajet à environ 1 500 px garde l'effet.

**Ce que je ne déplacerais pas (et pourquoi) :**
- **Les tarifs plus haut** : non. [Principe] Montrer le prix avant d'avoir montré la valeur fait juger le prix sans repère. 29 € paraît cher tant qu'on ne sait pas ce que ça rapporte. La réassurance « 14 jours gratuits, sans carte » répond déjà à la peur du prix dès le haut de page.
- **« Comment ça marche » avant la vidéo** : non. La vidéo fait la même chose en mieux pour ceux qui la lancent, et la timeline la complète pour les autres.
- **La FAQ juste après les tarifs** : c'est le bon endroit. Les objections surgissent au moment de décider.
- **La roue d'offres en fin de page** : à garder. [Principe] Règle du pic et de la fin : on retient surtout le moment le plus intense et le dernier. Finir sur un jeu gagnant est un très bon dernier moment.

---

## 4. Ce qui est déjà très bien (à ne pas toucher)

- **Le H1 « Ils reviennent. »** parle du résultat pour le commerçant, pas du produit. C'est court et mémorable. [Principe] Cadrage par le bénéfice.
- **« Vos clients gagnent un cadeau. Vous gagnez leur prochaine visite. »** : la symétrie rend le mécanisme et le bénéfice compréhensibles en une phrase.
- **La mini roue jouable dès le haut de page** : [Principe] gamification et micro-engagement. Toucher la roue, c'est un premier « oui » sans risque, et une démonstration du produit par le produit.
- **La réassurance immédiate « 14 jours gratuits, sans carte bancaire, sans engagement »** : [Principe] réduction du risque perçu. Elle répond aux trois peurs principales de ce public.
- **L'offre recommandée au centre, avec un fond sombre et le badge « Recommandé »** : [Principe] effet de l'option centrale et effet d'appât. Essentiel sert de point d'entrée et Premium d'ancre haute.
- **Le prix ramené à la journée** (« soit environ 1,60 € par jour ») : [Principe] cadrage par petites unités.
- **La rentabilité exprimée en clients** (« Rentable dès 3 clients qui reviennent ») : bon cadrage, à condition d'harmoniser le chiffre (voir l'audit technique).
- **« Réserver un appel » en action secondaire** : [Principe] il faut une option pour chaque niveau de maturité. Le commerçant hésitant a une porte de sortie humaine.
- **La transparence** : « Comment ces avis sont recueillis », la page « Utilisation responsable » et des prix publics. [Principe] Autorité et crédibilité par l'honnêteté, ce qui compte beaucoup pour un public méfiant envers le marketing.
- **Aucune fausse urgence, aucun compte à rebours** : la confiance est préservée.
- **La roue d'offres finale** : [Principe] réciprocité (un cadeau d'abord) et gamification.
- **Les pages métiers** : H1 du métier, lots du métier et appel à l'action. [Principe] Identification : « c'est pour moi ».

---

## 5. Améliorations classées par impact

### Impact FORT

**F1. Haut de page sur téléphone : sous-titre, bouton et réassurance visibles sans défiler.**
- **Où** : `components/sections/Hero.tsx`, ordre téléphone.
- **Problème** [Fait] : bouton à 810 px pour 667 px visibles, réassurance à 946 px.
- **Principe** : ce qui est visible sans défiler concentre l'attention. Il faut un appel à l'action proche de la promesse.
- **Modification** : sur téléphone, l'ordre devient H1, sous-titre, boutons, réassurance, roue, ou bien la roue est réduite. L'ordinateur ne change pas.
- **Effort** : faible.
- **Risque** : la roue, très séduisante, passe au second plan. À mesurer avec le taux de clic sur le bouton du haut de page.

**F2. Supprimer le bandeau cookies tant qu'aucune mesure d'audience n'est branchée.**
- **Problème** [Fait] : à la première visite, le bandeau couvre le bas du premier écran, alors que le site ne dépose aucun traceur.
- **Principe** : charge cognitive. La première décision demandée est un choix sans valeur pour le visiteur.
- **Modification** : ne l'afficher que lorsqu'une mesure le rend nécessaire. Une mesure sans cookie, voir la section 8, permet de s'en passer durablement.
- **Effort** : faible.
- **Risque** : aucun, s'il n'y a pas de traceur.

**F3. Dire clairement ce qui se passe après chaque action.**
- **Problème** [Fait] :
  - après l'inscription à l'essai, le message est « On vous écrit très vite pour ouvrir votre accès », sans délai. L'essai n'est pas ouvert tout de suite ;
  - « Créez-la pour moi » ne dit nulle part si c'est l'essai gratuit ni ce que ça coûte ensuite.
- **Principe** : réduction de l'incertitude. L'anxiété sur la suite (« je vais être engagé ? appelé ? facturé ? ») est une cause classique d'abandon. Après l'action, un délai inconnu fait retomber l'élan.
- **Modification** :
  - sous chaque bouton d'envoi, une ligne « Ensuite : … » (exemple : « Vous recevez votre QR code sous 24 à 48 h. C'est votre essai gratuit de 14 jours, sans carte bancaire. ») ;
  - un délai précis après l'inscription (« sous 24 h ») ;
  - à terme, une ouverture d'essai automatique.
- **Effort** : faible pour les textes, élevé pour l'ouverture automatique.
- **Risque** : promettre un délai qu'on ne tient pas. Ne l'écrire que s'il est tenable.

**F4. Une bande de preuve compacte juste sous le haut de page** (voir la section 3). Effort faible. Hypothèse à tester.

**F5. Rendre les témoignages vérifiables.**
- **Problème** [Fait] : 4 avis, tous à 5 étoiles, tous datés d'octobre 2026, 3 sans ville, textes courts et généraux (« reviennent plus souvent »).
- **Principe** : preuve sociale. Une preuve trop parfaite et invérifiable produit l'effet inverse chez un sceptique. Les avis précis et un peu imparfaits sont jugés plus crédibles.
- **Modification**, sans rien inventer :
  - ajouter la ville et le lien vers la fiche Google de chaque commerce ;
  - demander à chaque commerçant une phrase concrète sur ce qui a changé (un lot qui marche, une remarque d'un client) ;
  - dès qu'ALIA a 4 à 6 semaines d'usage, ajouter un cas chiffré mesuré dans Rouelia (parties, cadeaux retirés), avec son accord écrit.
- **Effort** : moyen, il dépend des commerçants.
- **Risque** : aucun si tout est réel.

### Impact MOYEN

**M1. Créneaux d'appel en dehors des coups de feu.**
- **Problème** [Fait] : `config.ts` propose 12 h à 14 h et 18 h à 20 h. Ce sont précisément les heures de service des restaurants et des pizzerias, et souvent les heures de pointe des salons et des boulangeries.
- **Principe** : friction. Le meilleur créneau est celui où le client est disponible.
- **Modification** : ajouter des créneaux du matin (9 h 30 à 11 h 30) et du milieu d'après-midi (14 h 30 à 17 h). Une ligne à changer dans `config.ts`.
- **Effort** : faible.
- **Risque** : ta propre disponibilité.

**M2. WhatsApp plus accessible sur téléphone.**
- **Problème** [Fait] : le lien WhatsApp est à 14 écrans sur l'accueil.
- **Principe** : la loi du moindre effort. Pour un commerçant, un message WhatsApp coûte moins qu'un formulaire ou un rendez-vous.
- **Modification**, au choix :
  - un lien « Une question ? WhatsApp » dans la réassurance du haut de page ;
  - un petit bouton flottant sur téléphone.
- **Effort** : faible.
- **Risque** : le bouton flottant encombre l'écran et entre en concurrence avec « Créer ma roue ». Je préfère le lien discret. Hypothèse à tester.

**M3. Répondre à l'objection « Est-ce que mes clients vont vraiment jouer ? »**
- **Problème** [Fait] : la question n'est traitée nulle part sur l'accueil, alors que c'est le premier doute d'un commerçant.
- **Principe** : traiter l'objection là où elle naît, après le « Comment ça marche ».
- **Modification** :
  - une phrase-réponse sous la timeline : « 20 secondes, sans appli, et toujours un cadeau : il n'y a rien à perdre pour eux. » ;
  - une question de FAQ.
- **Effort** : faible.
- **Risque** : aucun. Pas de chiffre inventé.

**M4. Ajouter le commerçant comparateur.**
- **Problème** : rien ne compare Rouelia à une carte à tampons, une appli de fidélité ou un jeu papier.
- **Principe** : cadrage par contraste. On juge mieux une option quand on la voit à côté d'une autre.
- **Modification** :
  - un petit tableau honnête en 3 colonnes (carte à tampons, appli de fidélité, Rouelia), sur des critères vérifiables : installation, appli à télécharger, coût, effort pour le client ;
  - ou une page dédiée, plus utile aussi pour Google.
- **Effort** : moyen.
- **Risque** : rester factuel, sans dénigrer de marque nommée.

**M5. Accueillir le visiteur qui vient de jouer chez un autre commerçant.**
- **Problème** [Fait] : le lien « Propulsé par Rouelia » mène à `/`, sans indication de provenance.
- **Principe** : continuité du message, et preuve vécue (il vient d'utiliser le produit).
- **Modification** :
  - ajouter `?ref=jeu` au lien ;
  - afficher en haut de l'accueil, pour ce cas seulement : « Vous venez de jouer chez un commerçant ? Offrez la même roue à vos clients. »
- **Effort** : faible.
- **Risque** : aucun.

**M6. Raccourcir la section tarifs sur téléphone.**
- **Problème** [Fait] : 3 250 px.
- **Principe** : charge cognitive et loi de Hick. Trois cartes longues à comparer de haut en bas fatiguent.
- **Modification** :
  - garder 3 bénéfices visibles par carte (c'est déjà le cas) ;
  - réduire les espacements ;
  - **tester** l'affichage de Croissance en premier sur téléphone.
- **Effort** : faible à moyen.
- **Risque** : mettre Croissance en premier fait perdre l'ancrage par le bas. À tester, ce n'est pas une certitude.

### Impact FAIBLE

- **L1. Une présence humaine sur l'accueil**, si tu l'acceptes, puisque tu as retiré la section fondateur. Une petite photo ronde et une ligne près du contact (« C'est moi qui vous réponds, Enzo ») suffiraient.
  - [Principe] Autorité et identification : face à un commerce de quartier, un visage rassure plus qu'une marque.
  - **Point d'attention [Opinion]** : la photo actuelle de /a-propos a un rendu « banque d'images ». Un sceptique peut la juger artificielle, alors que l'authenticité est le levier principal ici. Une vraie photo, même moins léchée, servirait mieux.
- **L2. Reformuler « Créer ma roue »** quand il mène au parcours « Créez-la pour moi ». Le visiteur clique pour « créer » et arrive sur un formulaire. Le texte « Votre roue, prête aujourd'hui. » est en plus inexact pour ce parcours (24 à 48 h). Effort faible.
- **L3. Le cadeau de la roue d'offres n'est valable qu'en Croissance et en Premium**, et on ne l'apprend qu'après avoir joué. Une petite déception est possible au moment le plus positif (pic et fin). Écrire « valable sur Croissance et Premium » avant le lancer, ce qui est déjà le cas dans le sous-titre, mais en plus petit. Effort faible.

---

## 6. Ce qui manque, et ce qui est en trop

**Manque :**
- **une preuve vérifiable** : villes, fiches Google, un cas chiffré réel ;
- **une réponse à « mes clients joueront-ils ? »** ;
- **une comparaison** avec les alternatives ;
- **un « ensuite »** clair après chaque action ;
- **une présence humaine sur l'accueil** ;
- **des captures du vrai produit** : l'espace commerçant, la caisse, le flyer imprimé. Ce serait une preuve honnête et concrète, car le visiteur se projette mieux avec ce qu'il utilisera vraiment.

**En trop ou en double :**
- **le bandeau cookies sans traceur** ;
- **la réassurance** (« 14 jours gratuits, sans engagement ») qui apparaît 4 à 5 fois : haut de page, bandeau, tarifs, roue d'offres, bloc final. La répétition en fin de parcours aide, mais le bandeau des avantages et la ligne du haut de page font doublon à un écran d'écart ;
- **la timeline** : longue sur ordinateur pour son contenu.

---

## 7. Plan : les 5 actions les plus rentables

1. **Haut de page sur téléphone** : sous-titre, boutons et réassurance visibles sans défiler (F1).
2. **Retirer le bandeau cookies** tant qu'il n'y a pas de traceur, et brancher une mesure sans cookie (F2 et section 8).
3. **Écrire l'« ensuite »** sous chaque bouton d'envoi, et donner un délai précis après l'inscription (F3).
4. **Ajouter des créneaux d'appel** hors des coups de feu, et un lien WhatsApp près du haut de page (M1, M2).
5. **Bande de logos sous le haut de page, et témoignages rendus vérifiables** (F4, F5).

**Idées facultatives** :
- la réponse à « mes clients joueront-ils ? » (M3) ;
- la page comparative (M4) ;
- l'accueil des visiteurs venus d'un QR code (M5) ;
- les tarifs plus courts sur téléphone (M6) ;
- une présence humaine sur l'accueil (L1) ;
- des captures du vrai produit.

---

## 8. Tests A/B et indicateurs

**La vérité sur les tests A/B au démarrage.** Avec quelques centaines de visiteurs par mois, un test A/B classique ne donne pas de résultat fiable. Pour détecter une hausse de 20 % d'un taux de conversion de 3 %, il faut de l'ordre de 10 000 visiteurs par version. La bonne méthode pour débuter :

1. **Mesurer d'abord**, pendant 3 à 4 semaines, sans rien changer : c'est le point de départ.
2. **Tester avec 5 commerçants réels.** Montre-leur le site sur ton téléphone 5 secondes, puis demande : « C'est quoi ? Pour qui ? Que feriez-vous ? » Regarde-les ensuite naviguer sans les aider. C'est la méthode la plus rentable à faible trafic.
3. **Changer une grosse chose à la fois**, d'abord F1, et comparer 4 semaines avant et 4 semaines après, en tenant compte des saisons.
4. **Passer aux vrais tests A/B** quand tu dépasses environ 3 000 visiteurs par mois.

**Ordre des tests quand le trafic le permettra** :
1. Haut de page sur téléphone : roue d'abord, ou texte et boutons d'abord.
2. Bande de logos présente ou absente.
3. Tarifs sur téléphone : Essentiel d'abord, ou Croissance d'abord.
4. Texte du bouton principal : « Créer ma roue » ou « Essayer 14 jours gratuits ».

**Indicateurs à mettre en place**, de préférence avec un outil sans cookie (Plausible ou équivalent), sans bandeau :
- **Clics** sur chaque bouton : haut de page, menu, tarifs (par pack), bloc final, WhatsApp, e-mail.
- **Profondeur de défilement** de l'accueil : 25, 50, 75 et 100 %, plus l'arrivée aux tarifs et à la FAQ.
- **Lecture de la vidéo** : lancée et terminée.
- **Mini roue tournée** au haut de page.
- **Parcours /creer-ma-roue** : choix du parcours, formulaire commencé, formulaire envoyé.
- **Rendez-vous** : calendrier vu, créneau choisi, réservation confirmée.
- **Essai** : inscription envoyée, essai ouvert, puis client payant (dans l'admin).
- **Provenance** : Google, IA, QR code (`?ref=jeu`), WhatsApp, pages métiers.

---

## 9. Les points où j'hésite, ou qui dépendent de toi

1. **L'essai** : peut-il être ouvert automatiquement après l'inscription, ou préfères-tu garder un contact humain avant ? Si c'est manuel, quel délai peux-tu promettre (2 h, 24 h) ?
2. **« Créez-la pour moi »** : est-ce l'essai gratuit de 14 jours ? Dans quel pack ? Il faut le dire au visiteur.
3. **Le haut de page sur téléphone** : texte et boutons d'abord, la roue ensuite, ou la roue réduite et tout visible ?
4. **Le bouton WhatsApp** : lien discret ou bouton flottant ?
5. **Une présence humaine sur l'accueil** : photo et une ligne, ou rien ? Et faut-il une vraie photo plutôt que l'actuelle ?
6. **La page comparative** : d'accord pour la créer ?
7. **Tes disponibilités pour les appels** : peux-tu ajouter des créneaux le matin et en milieu d'après-midi ?
