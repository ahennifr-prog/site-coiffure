# ALIA coiffure : roue à cadeaux

Page de jeu pour les clientes du salon ALIA coiffure (Champigny-sur-Marne) et espace de gestion pour le salon.

- **Cliente** (`/`) : scan du QR code, invitation facultative à laisser un avis Google, prénom et téléphone,
  roue 100 % gagnante, code cadeau `ALIA-XXXXX` avec dates de validité, lien de prise de rendez-vous.
- **Salon** (`/gestion`, protégé par mot de passe) : caisse (vérifier et valider un code), suivi (scans, parties,
  avis, retraits, export Excel), réglages de la roue (cadeaux, chances, part des gros cadeaux, validité,
  délai, fréquence de jeu, liens), QR code téléchargeable.
- **Règlement et données** (`/reglement`).

Mise en ligne : voir `DEPLOIEMENT.md`.

## Technique
Next.js 16, Tailwind CSS 4, hébergement Netlify (`netlify.toml`). Stockage choisi automatiquement (`lib/store.ts`) :
Netlify Blobs en ligne sur Netlify, Upstash Redis si ses variables sont fournies (ailleurs, par exemple Vercel),
mémoire en local (développement uniquement, bandeau rouge dans le suivi).

- Le tirage se fait côté serveur (`lib/game.ts`) : la cliente ne peut pas choisir son lot.
- Une partie par numéro sur la période réglée ; un second envoi renvoie le même code.
- Limite de 60 parties par heure et par connexion, 10 essais de connexion par quart d'heure.
- Session de gestion : cookie signé (HMAC), `httpOnly`, 30 jours.
- Données des clientes supprimées automatiquement un an après la fin de validité du cadeau.

```bash
npm install
ADMIN_PASSWORD=test npm run dev     # http://localhost:3000 et /gestion
npm test                            # 20 tests, dont le parcours complet sur un serveur Netlify Blobs local
BASE_URL=http://localhost:3000/ ADMIN_PASSWORD=test node scripts/parcours.mjs   # parcours complet dans Chromium
```
