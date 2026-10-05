# Prospectia : définition du projet et montage de la SAS

> Document de travail, version du 4 octobre 2026.
> Les chiffres (tarifs, frais, seuils) sont des **hypothèses à valider**, notamment avec
> un expert-comptable avant la signature des statuts.

---

## 0. Journal des décisions

| Sujet | Décision | Statut |
|---|---|---|
| Activité | Prospection B2B par IA | ✅ validé |
| Ambition produit | À terme un **logiciel (SaaS)** | ✅ validé |
| Chemin vers le SaaS | **Service + moteur IA maison construit avec Claude Code** ; le même moteur devient le SaaS (bêta entre les mois 4 et 6). Voir `OFFRE.md` et `MOTEUR-IA.md` | ✅ validé |
| Emploi actuel | À côté de l'emploi ; **pas de clause d'exclusivité** | ✅ vérifié |
| Facturation | **Abonnement mensuel + garantie de résultat** (un mois offert si l'objectif de RDV n'est pas atteint) | ✅ validé |
| Gamme | **3 packs** : Réveil (990 €), Agenda plein (1 490 € / mois), Intégral (1 990 € / mois), avec anti-absence et automatisations simples. Voir `OFFRE.md` | ⏳ proposé |
| Cible de départ | À valider par entretiens (kit à préparer plus tard) | ⏳ plus tard |
| Associés | **SAS à 2 associés** : toi opérationnel et président, et un **associé investisseur** (apport de capital, non opérationnel) | ✅ validé |
| Site web | Plus tard, une fois l'offre stabilisée (thème sombre, nom Prospectia) | ⏸ en pause |

---

## 1. Le projet en une phrase

**Prospectia remplit l'agenda commercial des PME B2B avec des rendez-vous qualifiés, en
combinant l'IA (ciblage, enrichissement, personnalisation des messages) et un
pilotage humain.**

Le client paie pour des **conversations avec des décideurs**, pas pour des fichiers ni
pour des outils.

---

## 2. Le marché

### Client cible (ICP)

| Critère | Cible prioritaire |
|---|---|
| Taille | PME de 5 à 250 salariés |
| Modèle | B2B, panier moyen de 5 k€ ou plus, cycle de vente court à moyen |
| Secteurs de départ | ESN et intégrateurs, éditeurs SaaS, cabinets de conseil, agences, industrie et services aux entreprises |
| Situation | Pas de SDR interne, ou une équipe commerciale qui manque de pipeline |
| Interlocuteur | Dirigeant·e, directeur·rice commercial·e, head of sales |
| Zone | France (puis Belgique, Suisse et Québec, en français) |

### Problème résolu

- Les commerciaux passent 40 à 60 % de leur temps à chercher des prospects au lieu de
  vendre.
- Recruter un SDR coûte cher (45 à 55 k€ chargés par an) et prend du temps
  (3 à 6 mois avant qu'il soit productif).
- Les envois de masse non personnalisés ne marchent plus et abîment la délivrabilité.

### Concurrence

- **Agences de génération de leads** classiques : surtout humaines, chères, peu
  transparentes.
- **Outils en libre-service** (lemlist, La Growth Machine, Apollo…) : puissants, mais le
  client doit savoir s'en servir et y consacrer du temps.
- **Positionnement de Prospectia :** un service clé en main, un rendu humain sur le
  message, la vitesse de l'IA sur la production, et la conformité RGPD dès la
  conception.

---

## 3. L'offre

> ⚠️ **Première ébauche, remplacée par `OFFRE.md`** : service à 1 490 € / mois avec
> garantie, et App SaaS de 99 à 499 € / mois.

| Formule | Contenu | Prix indicatif HT |
|---|---|---|
| **Diagnostic** (ponctuel) | Atelier ICP et proposition de valeur, base de 300 à 500 comptes ciblés et enrichis, 3 séquences rédigées, recommandations | 1 200 à 1 800 € |
| **Croissance** (mensuel, engagement 3 mois) | Campagnes email et LinkedIn, jusqu'à 1 000 prospects par mois, personnalisation IA relue par un humain, gestion des réponses, reporting hebdomadaire | 1 800 à 2 500 € / mois |
| **Performance** (mensuel) | Petit fixe et paiement au rendez-vous qualifié (critères définis par contrat) | 600 à 900 € / mois + 150 à 300 € / RDV |
| Options | Relance téléphonique, paramétrage du CRM (HubSpot, Pipedrive), domaines d'envoi et warm-up, contenus LinkedIn | sur devis |

**Définition d'un RDV qualifié** (à figer dans les CGV) : un décideur correspondant à
l'ICP, un besoin exprimé, un rendez-vous tenu (et non simplement planifié).

### Le processus en 3 étapes (repris sur le site)

1. **Cibler** : atelier ICP, sélection des comptes, enrichissement des contacts.
2. **Engager** : séquences multicanales personnalisées par IA et relues par un humain.
3. **Convertir** : qualification des réponses, prise de RDV dans l'agenda du client,
   reporting.

### Socle technique (à arbitrer)

- **Données** : base Sirene (INSEE), Pappers, LinkedIn Sales Navigator.
- **Enrichissement** : Dropcontact (français, pensé pour le RGPD) ou équivalent.
- **Séquences** : lemlist ou La Growth Machine ; domaines d'envoi séparés et warm-up.
- **IA** : un LLM via API pour la recherche sur les comptes et le premier jet des
  messages, toujours relu avant l'envoi.
- **CRM interne** : HubSpot (version gratuite au départ) ou Pipedrive.

---

## 4. Conformité : un point clé du métier

- **Email B2B (position de la CNIL)** : on peut démarcher un professionnel sans son
  consentement préalable si le message porte sur son activité professionnelle, à
  condition de l'informer et de lui offrir un **désabonnement simple** dans chaque
  message.
- **Base légale** : l'intérêt légitime. Il faut une mention d'information au premier
  contact (source des données, finalité, droits).
- **Registre des traitements** et **durée de conservation** : au plus 3 ans après le
  dernier contact pour un prospect inactif.
- **Contrats clients** : préciser le rôle de chacun (Prospectia est en général
  **sous-traitant** au sens de l'article 28 du RGPD) et signer un DPA.
- **LinkedIn** : ses CGU interdisent le scraping et limitent l'automatisation. Il faut
  rester dans des volumes prudents, car c'est un risque pour les comptes.
- **Téléphone** : Bloctel ne concerne pas les numéros professionnels, mais il faut
  vérifier les règles en vigueur avant de lancer une offre d'appels.
- **AI Act** : transparence sur l'usage de l'IA. La relecture humaine des messages est
  aussi un argument commercial.

---

## 5. Montage juridique : la SAS Prospectia

### 5.1 SAS à 2 associés : toi et un associé investisseur ✅

Tu es l'associé opérationnel et le président ; le second associé apporte du capital
sans travailler dans la société. Les points à cadrer :

- **Garder le contrôle** : rester majoritaire (plus de 50 %, idéalement au moins 67 %
  pour les décisions extraordinaires). Si l'investisseur apporte beaucoup plus que toi,
  on peut combiner :
  - un **apport en capital** modeste, à parts proportionnelles ;
  - un **apport en compte courant d'associé** pour le reste : c'est un prêt à la
    société, remboursable, qui ne donne pas de droits de vote ;
  - ou des **actions de préférence** : plus de dividendes ou une priorité de
    remboursement pour lui, moins de droits de vote.
- **Statuts** : clause d'agrément, clause d'inaliénabilité éventuelle, règles de
  majorité.
- **Pacte d'associés** (confidentiel, à côté des statuts) :
  - droit de préemption ;
  - sortie conjointe (*tag along*) et sortie forcée (*drag along*) ;
  - information de l'investisseur (reporting trimestriel) ;
  - non-concurrence ;
  - modalités de sortie et de valorisation.
- **Le président reste seul aux commandes** : l'investisseur n'a pas de mandat social.
- Avec un associé, il faut adapter le projet de statuts (`STATUTS-PROJET.md` est
  rédigé pour une SASU) : articles 6, 8, 9 et 13 notamment.

### 5.2 Fiche d'identité (à compléter)

| Élément | Proposition |
|---|---|
| Dénomination | **Prospectia** (vérifications au §5.3) |
| Forme | SASU, ou SAS si plusieurs associés |
| Capital | 1 000 à 5 000 € en numéraire, au moins 50 % libéré à la constitution, le solde sous 5 ans |
| Siège | Domicile du président (autorisé 5 ans) ou société de domiciliation |
| Président | [Nom Prénom], seul représentant légal |
| Durée | 99 ans |
| Exercice | Du 1er janvier au 31 décembre ; premier exercice long possible (jusqu'à 24 mois au plus) |
| Code APE probable | 73.11Z (agences de publicité) ou 70.22Z (conseil pour les affaires et la gestion) |
| Régime fiscal | Impôt sur les sociétés : 15 % jusqu'à 42 500 € de bénéfice (taux PME), 25 % au-delà |
| TVA | **Opter pour le régime réel** : les clients B2B récupèrent la TVA, donc pas de surcoût pour eux, et Prospectia récupère la TVA sur ses outils |
| Statut social du président | Assimilé salarié s'il est rémunéré. Sans rémunération : pas de cotisations, mais pas de droits non plus |

**Objet social (projet) :**

> La société a pour objet, en France et à l'étranger : la conception et la réalisation
> de prestations de prospection commerciale, de génération de contacts et de prise de
> rendez-vous pour le compte de tiers ; le conseil en stratégie commerciale, marketing
> et développement des ventes ; la conception, l'édition, l'intégration et
> l'exploitation de solutions logicielles et d'outils d'intelligence artificielle
> appliqués à la vente et au marketing ; la formation dans ces domaines ; et plus
> généralement toutes opérations se rattachant directement ou indirectement à cet objet.

### 5.3 Vérifications avant de déposer quoi que ce soit

- [ ] **Marque** : recherche d'antériorité sur data.inpi.fr (et EUIPO) pour
      « Prospectia », en classes **35** (prospection, publicité), **42** (logiciels, SaaS)
      et **9**. Le nom est assez descriptif, il existe donc un vrai risque d'homonymie.
- [ ] **Sociétés** : recherche sur annuaire-entreprises.data.gouv.fr et Pappers.
- [ ] **Domaine** : prospectia.fr, .com, .io. Prévoir aussi 2 ou 3 domaines secondaires
      pour l'envoi d'emails (par exemple getprospectia.fr).
- [ ] **Réseaux** : comptes LinkedIn (page entreprise), X et Instagram.
- [ ] Si le nom est pris, garder une liste B : Prospekt.ia, Prospia, Leadia, Rdvia…
- [ ] Dépôt de marque à l'INPI une fois le nom validé : 190 € pour 1 classe, +40 € par
      classe supplémentaire.

### 5.4 Étapes de création

| # | Étape | Où | Coût indicatif |
|---|---|---|---|
| 1 | Vérifications du nom (§5.3) | INPI, annuaire des entreprises | gratuit |
| 2 | Rédaction des statuts (projet : `STATUTS-PROJET.md`) | toi, avec relecture par un expert-comptable ou un avocat | 0 à 800 € |
| 3 | Ouverture d'un compte pro et dépôt du capital, obtention de l'**attestation de dépôt des fonds** | banque en ligne (Qonto, Shine…) ou traditionnelle | 0 à 20 € / mois |
| 4 | Signature des statuts, et de l'acte de nomination du président si besoin | — | — |
| 5 | **Annonce légale** de constitution | journal habilité (département du siège) | environ 190 à 230 € (forfait SAS/SASU) |
| 6 | Dossier sur le **guichet unique** : statuts, attestation de dépôt, justificatif de siège, pièce d'identité, déclaration de non-condamnation, déclaration des bénéficiaires effectifs | formalites.entreprises.gouv.fr | environ 37 € (greffe) + 21 € (RBE) |
| 7 | Réception du **Kbis**, du SIREN et du n° de TVA intracommunautaire | — | — |
| 8 | Déblocage du capital, choix du régime de TVA, impots.gouv pro | banque, espace pro | — |

**Budget de création, hors capital : environ 300 à 1 200 €** selon qu'on se fait
accompagner ou non.

### 5.5 Juste après le Kbis

- [ ] Expert-comptable (environ 100 à 250 € HT / mois pour une SASU de services).
- [ ] **RC Pro** et cyber-risque (environ 300 à 800 € / an).
- [ ] CGV, modèle de contrat de prestation, DPA RGPD, mentions légales et politique de
      confidentialité du site.
- [ ] Registre des décisions de l'associé unique (coté et paraphé).
- [ ] Registre RGPD des traitements.
- [ ] Aides : **ARCE ou maintien de l'ARE** si tu es demandeur d'emploi, **ACRE** (à
      vérifier, l'éligibilité a été resserrée), prêt d'honneur (Initiative France,
      Réseau Entreprendre), BPI.

### 5.6 Rémunération du président : principe

- **Au démarrage**, souvent pas de salaire (et si tu touches l'ARE, la cumuler) :
  c'est simple et ça ne crée pas de charges.
- **Ensuite**, arbitrer entre salaire (charges élevées, mais retraite et prévoyance) et
  dividendes (flat tax, sans cotisations sociales, et sans droits à la retraite). À
  simuler avec l'expert-comptable chaque année.

---

## 6. Prévisionnel simplifié (année 1, hypothèse prudente)

| Poste | Hypothèse | Montant annuel |
|---|---|---|
| Clients Croissance | montée progressive jusqu'à 5 clients à 2 000 € / mois | ≈ 60 000 € |
| Diagnostics | 8 × 1 500 € | 12 000 € |
| **Chiffre d'affaires** | | **≈ 72 000 € HT** |
| Outils (séquences, enrichissement, IA, Sales Nav, CRM) | ≈ 600 € / mois | − 7 200 € |
| Comptable, assurance, banque | | − 4 500 € |
| Domaines, site, divers | | − 1 500 € |
| **Résultat avant rémunération du président** | | **≈ 58 800 €** |

Le seuil de rentabilité est atteint avec environ **1 client Croissance**, qui couvre les
frais fixes.

---

## 7. Feuille de route

| Horizon | Objectif |
|---|---|
| Semaines 1 et 2 | Nom validé, statuts finalisés, compte bancaire, dépôt du capital |
| Semaines 3 et 4 | Immatriculation, site Prospectia en ligne, domaines d'envoi en warm-up |
| Mois 2 | Prospection de Prospectia par Prospectia : la meilleure démonstration. 2 clients pilotes à prix réduit contre un témoignage |
| Mois 3 à 6 | 3 à 5 clients récurrents, études de cas, CGV stabilisées |
| Mois 6 à 12 | Premier recrutement (SDR ou freelance), ou productisation d'une partie de l'outil |

---

## 8. Décisions à prendre (par toi)

1. Répartition du capital avec l'associé investisseur, et montant qu'il apporte.
2. Montant du capital.
3. Adresse du siège : domicile ou domiciliation ?
4. Nom définitif, après les vérifications INPI et de domaine.
5. Statut actuel : salarié, demandeur d'emploi, autre ? Cela conditionne les aides et
   la rémunération.
6. Prix de lancement : les fourchettes du §3 conviennent-elles ?

---

## 9. Chemin vers le SaaS : les 3 options

| | A. Service + moteur IA maison | B. GoHighLevel en marque blanche | C. SaaS direct avec Claude Code |
|---|---|---|---|
| Premier chiffre d'affaires | mois 2 | mois 1 ou 2 | mois 4 à 6 au mieux |
| Coût de départ | environ 600 € / mois d'outils | environ 300 à 500 $ / mois | outils et hébergement environ 100 à 300 € / mois, plus ton temps sans revenus |
| Différenciation | forte (ton moteur IA) | faible (outil revendu, copiable) | forte, si ça marche |
| Risque | faible | moyen (dépendance à la plateforme, mal adaptée à l'emailing à froid en France) | élevé (technique, sécurité, RGPD, sans validation du marché) |
| Adapté à un fondateur seul, non développeur | ✅ | ✅ | ⚠️ |
| Valeur de l'entreprise à terme | élevée (produit et clients) | faible | élevée |

Délais estimés avec Claude Code, en solo : **outil interne en 3 à 6 semaines**, **SaaS
vendable en 3 à 6 mois**, puis de la maintenance en continu.

**Recommandation : option A.** GoHighLevel peut éventuellement servir de CRM, d'agenda
et de reporting client, mais pas pour l'envoi d'emails à froid.

---

## 10. Ton profil et ce qu'il implique

**Contraintes :** activité menée à côté d'un emploi ; 3 à 6 mois de marge
personnelle ; associé investisseur à moins de 10 k€ ; **objectif : plus de 300 k€ de CA
à 3-5 ans.**

### Conséquences

- **Le SaaS direct (C) devient trop lent.** 3 à 6 mois de développement à temps plein
  font **9 à 18 mois** en soirée et le week-end, sans revenus, ni validation, ni
  budget pour accélérer.
- **GoHighLevel (B) ne mène pas à 300 k€.** Revendre l'outil d'un autre, c'est des
  marges faibles et aucune barrière à l'entrée.
- **Le service classique (A) se heurte à ton emploi.** Les décideurs B2B se joignent
  en journée, et livrer du service prend du temps.
- La bonne réponse est donc **A en version « automatisée dès le départ »** : peu de
  clients, plutôt haut de gamme, et une livraison faite à 80 % par ton moteur IA.

### Ce que représentent 300 k€ de CA

| Modèle | Ce qu'il faut pour 300 k€ / an |
|---|---|
| Service à 2 000 € / mois | environ 13 clients actifs en permanence, donc une équipe (1 ou 2 personnes) ou une très forte automatisation |
| SaaS à 300 € / mois | environ 85 clients |
| SaaS à 99 € / mois | environ 250 clients |
| **Mix réaliste en année 3** | 6 à 8 clients du service (environ 170 k€) et 40 clients SaaS à 300 € (environ 145 k€) |

### Trajectoire retenue : le SaaS entre les mois 4 et 6

| Phase | Objectif |
|---|---|
| **Mois 0 à 2** | SAS créée ; moteur construit avec Claude Code (étapes ① à ⑥) ; **2 clients pilotes** du service |
| **Mois 3** | Moteur complet ; clients 3 et 4 du service ; première étude de cas |
| **Mois 4** | **Version SaaS** : inscription, Stripe, quotas ; ouverture de la bêta |
| **Mois 5 et 6** | 10 clients bêta de l'App, 4 clients du service : **environ 7 k€ de revenu mensuel récurrent** |
| **Mois 6 à 12** | Montée en puissance de l'App ; démission quand le revenu mensuel récurrent couvre ton salaire et 3 mois de charges |
| **Années 2 et 3** | **Plus de 300 k€** : environ 8 clients du service et environ 120 clients de l'App |

Les détails sont dans `OFFRE.md` (prix, garantie) et `MOTEUR-IA.md` (fonctionnement et
plan de construction).

### À vérifier tout de suite (emploi actuel)

- [x] **Clause d'exclusivité** : aucune dans ton contrat.
- [ ] **Obligation de loyauté** : pas de concurrence avec ton employeur, et pas
      d'utilisation de son matériel ni de ses clients.
- [ ] Comme tu es salarié, **ne pas te rémunérer comme président** au début : pas de
      charges sociales, tu restes couvert par ton emploi.
