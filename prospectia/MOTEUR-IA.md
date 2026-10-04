# Prospectia : le moteur IA

> Le cahier des charges de l'outil construit avec Claude Code.
> **Principe : le même code sert au service (mois 1 à 3) et devient le SaaS (mois 4 à
> 6).** Il est donc construit dès le départ avec un espace séparé par client.

---

## 1. Ce que fait le moteur, étape par étape

```
 ICP du client
     │
 ① CIBLER ─────── entreprises qui correspondent (secteur, taille, zone)
     │
 ② RECHERCHER ─── ce qui se passe chez chacune (site, recrutements, actus)
     │
 ③ TROUVER ─────── le bon décideur et son email professionnel
     │
 ④ NOTER ──────── score de 0 à 100 avec ses raisons ; on ne garde que les meilleurs
     │
 ⑤ RÉDIGER ────── séquence de 3 emails et message LinkedIn, personnalisés
     │
 ⑥ VALIDER ────── relecture humaine en un clic (modifier, approuver, rejeter)
     │
 ⑦ ENVOYER ────── poussé dans lemlist (ou l'outil du client)
     │
 ⑧ TRIER ──────── réponses classées par l'IA, avec un brouillon de réponse
     │
 ⑨ MESURER ────── tableau de bord : envois, réponses, RDV
```

| # | Étape | Sources et outils | Rôle de l'IA |
|---|---|---|---|
| ① | Cibler | **API Recherche d'entreprises** (data.gouv, gratuite : code NAF, effectif, département) ; Pappers pour les compléments | Traduire l'ICP rédigé en français en filtres |
| ② | Rechercher | Site web de l'entreprise, offres d'emploi (API France Travail), annonces BODACC | Résumer l'entreprise et repérer des **signaux** : recrutement commercial, levée de fonds, nouveau produit, déménagement… |
| ③ | Trouver | **Dirigeants** via Pappers (dans une PME, le dirigeant est souvent le décideur), puis **Dropcontact** pour l'email professionnel vérifié | Choisir la bonne personne selon l'ICP |
| ④ | Noter | Les données de ② et ③ | Score d'adéquation et justification courte |
| ⑤ | Rédiger | Offre du client, ton, études de cas, signaux | Messages courts, **un seul fait vérifiable par message**, avec sa source citée en interne |
| ⑥ | Valider | Interface web | — (contrôle humain) |
| ⑦ | Envoyer | API lemlist (prospects et variables personnalisées) | — |
| ⑧ | Trier | Webhook lemlist pour les réponses | Classer : intéressé / plus tard / pas la bonne personne / désinscription / hors sujet. Une désinscription met le contact automatiquement sur liste noire |
| ⑨ | Mesurer | Base de données | Résumé hebdomadaire rédigé pour le client |

### Garde-fous IA (indispensables)

- **Aucun fait inventé** : chaque élément de personnalisation doit provenir d'une source
  stockée (URL, extrait). Sans source, pas de personnalisation, on utilise un message
  générique.
- Tous les messages passent par l'étape ⑥ tant que la qualité n'est pas prouvée.
- Liste noire globale (désinscriptions, concurrents du client, clients existants).
- Mention d'information RGPD et lien de désinscription dans chaque premier email.

---

## 2. Choix techniques

| Besoin | Choix | Pourquoi |
|---|---|---|
| Application web | **Next.js** (TypeScript) | Standard, très bien maîtrisé par Claude Code, interface et API dans le même projet |
| Base, authentification, espaces clients | **Supabase**, région UE (Francfort) | Postgres, connexion intégrée, **règles d'accès par client (RLS)** dès le départ ; données hébergées en UE pour le RGPD |
| Tâches longues (recherche, enrichissement) | File de tâches (Supabase et fonctions planifiées, ou Inngest / Trigger.dev) | Traiter 600 prospects sans bloquer l'interface |
| IA | **API Claude** : un modèle rapide et économique pour le tri et le scoring, un modèle plus puissant pour la rédaction | Qualité de rédaction en français, coût maîtrisé |
| Paiement (SaaS) | **Stripe** (abonnements et crédits) | Ajouté au mois 4 |
| Hébergement | Vercel, ou Scaleway / Clever Cloud pour du 100 % français | Mise en ligne en un clic |
| Code | GitHub, avec Claude Code dans le terminal | Historique, sauvegarde, revues |

**Budget technique de départ : environ 50 à 150 € / mois** (hors données et
enrichissement, refacturés dans les prix).

---

## 3. Plan de construction avec Claude Code (à côté de ton emploi, environ 15 h / semaine)

| Période | Livrable | Utilisé pour |
|---|---|---|
| **Semaines 1 et 2** | Projet initialisé, connexion, espaces clients, saisie de l'ICP, étape ① (liste d'entreprises) | — |
| **Semaines 3 et 4** | Étapes ② et ③ : recherche sur les comptes, dirigeants, emails vérifiés | Premiers fichiers pour les pilotes |
| **Semaines 5 et 6** | Étapes ④ à ⑥ : score, rédaction, écran de validation | **Premières campagnes pilotes** |
| **Semaines 7 et 8** | Étapes ⑦ et ⑧ : envoi lemlist, tri des réponses | Les pilotes tournent en continu |
| **Mois 3** | Étape ⑨ : tableau de bord client, améliorations issues des pilotes | Clients 3 et 4 du service |
| **Mois 4** | **Version SaaS** : inscription en libre-service, accueil guidé, Stripe, quotas et crédits, CGU | Ouverture de la bêta |
| **Mois 4 et 5** | Sécurité (revue complète, `/security-review`), RGPD (export et suppression des données), journaux d'erreurs, sauvegardes | Condition avant de faire payer des inconnus |
| **Mois 5 et 6** | Bêta à 10 clients, corrections, intégration HubSpot | 10 clients de l'App |

**Le risque principal**, c'est le temps, pas la technique. Chaque fonctionnalité qui
ne sert pas les pilotes est repoussée après le mois 6.

### Utiliser Claude Code efficacement

- Un **`CLAUDE.md`** à la racine du projet : description de Prospectia, stack,
  conventions, règles RGPD et garde-fous de l'IA. Claude le relit à chaque session.
- Des **skills** dédiés, à créer au fil de l'eau :
  - `ton-prospectia` : règles de rédaction des messages, exemples bons et mauvais ;
  - `nouvelle-campagne` : procédure de lancement d'une campagne client ;
  - `revue-securite` : vérifications avant chaque mise en production (RLS, clés d'API,
    données personnelles).
- Des **tests automatiques** sur ce qui est critique : séparation des données entre
  clients, liste noire, désinscription.
- Travailler par petites étapes, une fonctionnalité à la fois, en vérifiant dans
  l'application avant de passer à la suivante.

---

## 4. Ce qu'il faut ouvrir comme comptes (semaine 1)

- [ ] GitHub (dépôt privé `prospectia-app`)
- [ ] Supabase (région UE)
- [ ] Console Anthropic (clé API Claude, avec une limite de dépense mensuelle)
- [ ] Pappers (API), Dropcontact (API)
- [ ] lemlist (pour les campagnes du service)
- [ ] Vercel (hébergement)
- [ ] Stripe (au mois 4, une fois la SAS immatriculée)
