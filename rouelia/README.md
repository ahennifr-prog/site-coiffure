# Rouelia : landing page

Site de présentation de Rouelia, la roue à cadeaux 100 % gagnante pour les commerces de quartier.
Next.js (App Router), TypeScript, Tailwind CSS 4. Direction artistique et tokens : voir `DESIGN.md`.

## Lancer

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # typage + tests unitaires + contrôle des textes
npm run build && npm start
BASE_URL=http://localhost:3000 npm run e2e   # parcours complet dans Chromium, captures dans .captures/
```

Hébergement : Cloudflare Workers (adaptateur OpenNext, `wrangler.jsonc`). Voir `DEPLOIEMENT.md`.
Tester le rendu Cloudflare en local : `npm run preview` (mot de passe admin dans `.dev.vars`).

## Où modifier quoi

| Quoi | Où |
| --- | --- |
| Tous les textes, prix, hypothèses du simulateur, seuil d'alerte du coût, modèles de lots | `content.ts` |
| Résultats de pilotes (désactivés par défaut) | `content.ts`, `pilots.items` : passer `enabled: true` avec chiffres mesurés et date d'accord |
| Photo du fondateur | déposer l'image dans `public/` et renseigner `founder.photo` |
| Rareté (places limitées) | `content.ts`, `scarcity`, seulement si elle est réelle |
| Couleurs, rayons, ombres | `app/globals.css` (`@theme`) |

## Organisation

- `lib/wheel.ts` : somme à 100 %, redistribution proportionnelle, blocage d'un lot, tirage pondéré, angle d'arrêt, coût moyen, code cadeau.
- `lib/simulator.ts` : calculs du simulateur.
- `lib/signup.ts` : validation partagée client et serveur, structure `SignupRecord` prête pour une base et Stripe.
- `components/wheel/Wheel.tsx` : roue SVG en trois calques (le disque tourne par transformation CSS, sans redessin).
- `components/demo/` : démo (réglages, aperçu téléphone, invitation à l'avis, écran de gain, récapitulatif), chargée à l'approche.
- `components/simulator/` : simulateur, chargé à l'approche.
- `components/signup/` : fenêtre d'inscription, chargée à la première ouverture.
- `app/api/inscription/route.ts` : valide, construit l'enregistrement, le journalise.
- `scripts/check-copy.ts` : refuse tirets de ponctuation, emojis et formules interdites.
- `tests/` : 42 tests unitaires (Vitest).

## Mesures (build de production, localhost)

Lighthouse mobile : performance 94 à 97, accessibilité 100, bonnes pratiques 100, SEO 100.
Aucun défilement horizontal à 375 px. Aucune erreur console sur le parcours complet.

## Reste à brancher

1. **Base de données** : fait. Les inscriptions sont enregistrées dans Cloudflare D1 (`lib/db.ts`) et consultables sur `/admin` (statut, suppression, export Excel).
2. **Stripe** : créer le client à l'inscription (`stripeCustomerId`), puis l'abonnement à la fin de l'essai. Prix mensuels dans `content.ts`.
3. **E-mails** : confirmation d'inscription au commerçant, alerte interne à chaque nouvelle inscription.
4. **Saisie assistée Google Places** : `lib/places.ts` expose déjà `searchPlaces()` et le type `Establishment` ; ajouter une route `/api/places` côté serveur pour ne pas exposer la clé.
5. **Résultats des pilotes** : remplir `pilots.items` avec les chiffres mesurés, l'accord écrit et le lien de la fiche Google.
6. **Mesure d'audience** : renseigner `NEXT_PUBLIC_ANALYTICS_SRC` (chargée uniquement après « Accepter »).
7. **Pages légales** : faire valider les textes par un professionnel, compléter raison sociale, SIREN, adresse, durées de conservation, puis retirer l'avertissement.
8. **À valider par Aymen** : le texte du fondateur (`founder` dans `content.ts`), sa photo, le domaine `rouelia.fr`, l'hébergement européen des données annoncé dans la FAQ, et l'interprétation « 79 € = déplacement fait uniquement pour vous ».
