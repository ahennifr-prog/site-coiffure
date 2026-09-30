# Rouelia : point de reprise (30 septembre 2026)

## Validé par Aymen
- Identité visuelle Tomette, ton franc et chaleureux, titre « Vos clients gagnent un cadeau. Vous gagnez leur prochaine visite. »
- Pages et sections : « parfaitement la vision ». Projet mis en pause, à reprendre.

## État
- Site complet dans `rouelia/` (voir README.md) : build OK, 42 tests OK, contrôle des textes OK,
  Lighthouse mobile 94 à 97 en performance, 100 ailleurs.
- Branche : `claude/great-lovelace-lpyydk`. Pas de pull request ouverte.

## En ligne (30 septembre 2026, soir)
- Rouelia : Cloudflare Workers, projet `rouelia`, branche de production `claude/great-lovelace-lpyydk`,
  répertoire racine `rouelia`. Secrets ADMIN_PASSWORD et SESSION_SECRET réglés. Inscriptions en D1, espace `/admin` validé par Aymen.
- ALIA coiffure (`alia-roue/`) : Netlify, `jeu-aliacoiffure.netlify.app`, logo officiel intégré. Passage sur Cloudflare possible plus tard (badge Netlify).

## Prochaines étapes quand on reprend
1. Relire avec Aymen : mot du fondateur, photo, e-mail, domaine, hébergement des données, règle des 79 €.
2. Brancher base de données, Stripe, e-mails (voir « Reste à brancher » dans README.md).
3. Fait : mise en ligne Cloudflare. Reste le nom de domaine (ex. rouelia.fr) à brancher.
4. Réutiliser l'expérience du pilote Alia Coiffure (`alia-roue/`) comme premier résultat réel une fois mesuré.
