# ALIA coiffure — mettre le site en ligne

Le site est 100 % statique : tout le dossier `alia-coiffure/` se dépose tel quel.

## Le plus simple : Netlify Drop (gratuit, 2 minutes)
1. Aller sur https://app.netlify.com/drop
2. Glisser-déposer le dossier `alia-coiffure/` entier.
3. Le site est en ligne sur une adresse `*.netlify.app`. Dans « Domain settings »,
   brancher ensuite un nom de domaine (ex. `aliacoiffure.fr`).

## Autres options
- **Vercel** : `npx vercel` dans le dossier, ou import du dépôt GitHub (dossier racine : `alia-coiffure`).
- **GitHub Pages** : Settings → Pages → déployer depuis la branche, dossier `/alia-coiffure`
  (ou copier son contenu à la racine d'un dépôt dédié).
- **Hébergeur classique (OVH, o2switch…)** : envoyer le contenu du dossier par FTP dans `www/`.

## Tester en local
    node .claude/serve-alia-coiffure.mjs   # puis http://localhost:4385

## Modifier le contenu
- Textes, accroche, avis client : `content.js`
- Tarifs, horaires, adresse, liens : `index.html` (sections PRESTATIONS et FOOTER)
- Photos : remplacer les fichiers de `images/` en gardant les mêmes noms
  (hero.jpg et process.jpg en 1800×1200 ; real-01…08 en 640 de large ;
  fl-01…10 et trail-01…20 en petits formats). JPEG ~1600 px max, qualité ~78.
