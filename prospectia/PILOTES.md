# Prospectia : lancer 2 pilotes sans structure ni automatisation

> Le principe : **faire à la main d'abord, automatiser ensuite.** Les pilotes ne
> dépendent ni du moteur ni du Kbis : ils se lancent en parallèle de la création de la
> SAS et de la construction du moteur.

---

## 1. Sans structure : caler les pilotes sur la création de la SAS

Un pilote commence par **2 à 3 semaines de préparation** (atelier, domaines, warm-up de
14 jours). C'est à peu près le temps qu'il faut pour obtenir le Kbis.

| Semaine | SAS | Pilotes |
|---|---|---|
| S1 | Statuts, compte bancaire, dépôt du capital | Trouver les 2 pilotes ; signature d'une **lettre d'engagement** |
| S2 | Annonce légale, dépôt sur le guichet unique | Ateliers ICP ; achat des domaines ; **début du warm-up** |
| S3 | Kbis attendu (souvent sous 1 à 3 semaines) | Listes et messages préparés et validés |
| S4 | SIREN et n° de TVA reçus, **première facture possible** | **Premiers envois** |

### Légalement

- Avant l'immatriculation, tu peux signer **au nom de la « société Prospectia en
  formation »**. Les engagements sont repris par la société à l'immatriculation : c'est
  l'article 18 du projet de statuts, avec la liste des actes en annexe.
- Pour le premier mois, le plus simple est un **mois offert** : pas de facture avant le
  Kbis, et les premiers envois tombent justement au moment où il arrive.
- Les domaines et les outils achetés avant l'immatriculation se notent dans l'annexe
  des actes ; la société te les rembourse ensuite.

**Tarif pilote proposé :** premier mois offert (préparation et lancement), puis **890 € /
mois pendant 2 mois**, sans garantie, en échange d'un témoignage et d'une étude de cas
chiffrée.

---

## 2. Sans automatisation : la boîte à outils prête à l'emploi

Environ **80 % du parcours existe déjà dans des outils du marché.** Le moteur Prospectia
apportera la qualité de la recherche et le gain de temps, pas le fonctionnement de base.

| Étape | Pendant les pilotes (à la main et outils) | Plus tard (moteur) |
|---|---|---|
| ① Cibler | Recherche filtrée sur **annuaire-entreprises.data.gouv.fr** ou **Pappers** (code NAF, effectif, département), avec export | API automatique |
| ② Rechercher les signaux | Toi, avec **Claude** : coller 20 à 30 entreprises par lot et lui demander signaux et résumé en tableau. Contrôler les offres d'emploi sur Indeed ou Welcome to the Jungle | Automatique |
| ③ Trouver les emails | Import du fichier dans **Dropcontact**, export enrichi | API |
| ④ Noter | Claude, sur le même lot (score de 0 à 100 avec ses raisons) | Automatique |
| ⑤ Rédiger | Claude, avec un **prompt type** (§4) ; résultat en CSV avec les colonnes de personnalisation | Automatique |
| ⑥ Valider | Relecture dans le tableur | Interface de validation |
| ⑦ Envoyer | **lemlist** : import du CSV, séquence email et LinkedIn, warm-up, arrêt automatique à la réponse | Envoi via API |
| ⑧ Réponses | Notifications lemlist sur ton téléphone ; réponses rédigées avec Claude | Tri par l'IA |
| Prise de RDV et anti-absence | **Cal.com** : rappels automatiques par email avant le RDV (natifs) ; relance des absents à la main | Automatique |
| A1 Alerte « prospect chaud » | Notification lemlist transférée au client (email ou WhatsApp) | Automatique |
| A2 Fiche avant RDV | Claude, à partir de la fiche du prospect (5 min par RDV) | Automatique |
| A3 CRM | Import HubSpot hebdomadaire, ou Google Sheet partagé | Synchronisation |
| A7 Rapport | Statistiques lemlist + 5 lignes écrites par toi, le lundi | Automatique |

**Volume des pilotes :** **300 prospects par mois et par client** au lieu de 600. On
travaille la qualité ; le volume reviendra avec le moteur.

### Budget mensuel des pilotes (estimation, payé par Prospectia)

| Poste | Coût |
|---|---|
| lemlist (1 compte qui gère 2 clients) | environ 70 à 100 € |
| Boîtes d'envoi : 2 clients × 4 boîtes | environ 55 € |
| Domaines : 4 au total, à l'année | environ 40 € la première fois |
| Dropcontact (environ 600 contacts) | selon le forfait, quelques dizaines d'euros |
| Abonnement Claude | environ 20 € |
| Cal.com, HubSpot gratuit | 0 € |
| **Total** | **environ 200 à 250 € / mois** |

C'est couvert par l'apport de l'investisseur (moins de 10 k€) pendant les pilotes, puis
par les 2 × 890 €.

---

## 3. Ton temps pendant les pilotes

| Tâche (pour 2 clients) | Par semaine |
|---|---|
| Ciblage, recherche et rédaction avec Claude (2 × 75 prospects) | 3 à 4 h |
| Relecture et import dans lemlist | 1 h |
| Réponses et prise de RDV (3 créneaux de 10 min par jour) | 2 h 30 |
| Fiches avant RDV, point avec les clients, rapport | 1 h |
| **Total** | **environ 8 h / semaine** |

S'y ajoutent **environ 7 h par semaine de construction du moteur** avec Claude Code,
soit environ 15 h par semaine au total. C'est serré mais tenable sur 2 à 3 mois, en
soirée et le week-end. Le samedi matin est le meilleur moment pour préparer les lots de
la semaine.

---

## 4. Le prompt type pour un lot de prospects (Claude)

```
Tu es analyste commercial pour [CLIENT], qui vend [OFFRE] à [CIBLE].
Promesse : [RÉSULTAT CHIFFRÉ]. Preuve : [CAS CLIENT].

Voici [N] entreprises (nom, site, ville, effectif, dirigeant).
Pour chacune, renvoie une ligne de tableau CSV avec :
- signal : un fait récent et vérifiable (recrutement, actualité, lancement),
  avec l'URL source. Si tu n'en trouves pas, écris « aucun » ; n'invente jamais.
- score : de 0 à 100 d'adéquation avec la cible, et la raison en 10 mots
- accroche : 1 phrase basée sur le signal (vide si aucun signal)
- question : 1 question fermée liée à la promesse

Ton : vouvoiement, simple, pas de jargon, jamais flatteur.
```

Les colonnes `accroche` et `question` deviennent des variables dans lemlist :
`{{accroche}}`, `{{question}}`.

---

## 5. Les pilotes servent aussi à construire le moteur

Chaque semaine, note **ce qui te prend le plus de temps**. C'est l'ordre dans lequel
automatiser. Ordre probable :

1. **Recherche, score et rédaction** (② à ⑤) : c'est le plus long à la main.
2. **Tri des réponses et brouillons** (⑧).
3. **Fiches avant RDV et rapport** (A2, A7).
4. Synchronisation CRM et relance des absents.

Quand le moteur remplace une étape, les pilotes passent à 600 prospects par mois.
Au mois 3, tu as 2 études de cas, des **taux de réponse réels** pour décider de la
garantie, et un moteur testé sur le terrain.

---

## 6. Trouver les 2 pilotes

1. **Ton réseau direct** (anciens collègues, clients de ton employeur hors
   concurrence, entourage) : liste de 30 dirigeants de PME B2B, message personnel.
2. **Prospectia se prospecte elle-même** avec la même boîte à outils : 150 dirigeants
   d'ESN et de cabinets de conseil. C'est ton premier test et ta première preuve.
3. **Ton post LinkedIn** : « Je cherche 2 entreprises B2B pour tester gratuitement
   pendant un mois une prospection assistée par IA. »

**Critères d'un bon pilote :** offre claire et déjà vendue, panier d'au moins 5 k€,
dirigeant disponible pour rappeler les prospects, d'accord pour témoigner.
