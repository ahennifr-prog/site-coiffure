# Rouelia : point de reprise (30 septembre 2026)

## Validé par Aymen
- Identité visuelle Tomette, ton franc et chaleureux, titre « Vos clients gagnent un cadeau. Vous gagnez leur prochaine visite. »
- Pages et sections : « parfaitement la vision ». Projet mis en pause, à reprendre.

## État
- Site complet dans `rouelia/` (voir README.md) : build OK, 42 tests OK, contrôle des textes OK,
  Lighthouse mobile 94 à 97 en performance, 100 ailleurs.
- Branche : `claude/great-lovelace-lpyydk`. Pas de pull request ouverte.

## Prochaines étapes quand on reprend
1. Relire avec Aymen : mot du fondateur, photo, e-mail, domaine, hébergement des données, règle des 79 €.
2. Brancher base de données, Stripe, e-mails (voir « Reste à brancher » dans README.md).
3. Mise en ligne sur Cloudflare Workers préparée (voir DEPLOIEMENT.md) : inscriptions en base D1, espace `/admin`.
   Choix de Cloudflare : gratuit, sans badge, usage commercial autorisé.
4. Réutiliser l'expérience du pilote Alia Coiffure (`alia-roue/`) comme premier résultat réel une fois mesuré.
