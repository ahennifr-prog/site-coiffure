# Rouelia : direction artistique

## 1. Trois pistes d'identité

**A. Tomette** (retenue)
- Palette : rouge tomette `#C4401F` en signature, crème chaude `#FBF6EE`, encre `#1D1A16`. Accents sauge `#2E6150` et safran `#F3B23C` réservés à la roue et aux gains.
- Typographies : Fraunces (serif d'affichage, axe « SOFT » arrondi, esprit enseigne peinte) et Figtree (texte, très lisible à 16 px sur mobile, chiffres tabulaires).
- Formes : rayures de store banne, coins doux (rayon 14 à 28 px), ombres chaudes et diffuses, jamais de contour noir épais.
- Animations : la roue a du poids (inertie, décélération, rebond de 4°). Le reste glisse et s'estompe en 200 à 400 ms.
- Logo : « Rouelia » en Fraunces, le « o » remplacé par une petite roue à 8 segments tomette et crème.

**B. Bistrot**
- Palette : vert bouteille `#0F4D3F`, laiton `#C9A25A`, papier `#F5F0E6`, encre `#15201C`.
- Typographies : Young Serif (affichage) et Inter (texte).
- Formes : filets fins, étiquettes façon ardoise, coins très légèrement arrondis.
- Animations : lentes, élégantes, fondus enchaînés.
- Logo : « Rouelia » en capitales fines, un point doré en forme de jeton sur le i. Sérieux, mais on a moins envie de jouer.

**C. Framboise**
- Palette : framboise `#D6195A`, poudre `#FFE8EF`, anthracite `#1B1B1F`, menthe `#7FD8BE`.
- Typographies : Bricolage Grotesque (affichage) et DM Sans (texte).
- Formes : pastilles, grosses bulles, dégradés courts.
- Animations : rebondissantes, élastiques.
- Logo : « rouelia » en minuscules grasses, le point du i en roue qui tourne au survol. Ludique, mais trop « start-up » pour un boulanger de 50 ans.

## 2. Pourquoi Tomette

Le rouge tomette, c'est la couleur du carrelage de bistrot, du store banne, de la devanture de boulangerie. Un commerçant de quartier le reconnaît sans l'avoir jamais vu sur un logiciel. Aucun concurrent ne l'utilise, et il est à l'opposé du bleu et jaune de rushup.fr. Associé à une encre presque noire et à une crème chaude, il donne une page qui se lit vite au soleil sur un téléphone, avec des contrastes AA vérifiés. La serif douce apporte le sérieux « maison installée depuis longtemps » ; la roue, les rayures et le safran apportent l'envie de jouer. Le vert sauge sert à tout ce qui est « validé, gagné, rentable », pour que la couleur dise le sens.

## 3. Titre du hero : trois variantes

1. « Une roue sur le comptoir. Des clients qui reviennent. »
2. « Vos clients gagnent un cadeau. Vous gagnez leur prochaine visite. » **(retenue)**
3. « Un QR code, une roue, et une bonne raison de revenir chez vous. »

Je retiens la 2. Elle résume le mécanisme en une seule symétrie : le client gagne, le commerçant gagne, et le lien entre les deux est la prochaine visite, qui est exactement là où le cadeau se retire. On la comprend en trois secondes. Elle parle du résultat pour le commerçant, pas de la technologie. Elle ne promet aucun chiffre. La 1 est plus visuelle mais laisse deviner le mécanisme. La 3 est plus explicative mais plus longue et moins mémorable.

## 4. Choix de structure (écarts assumés par rapport au prompt)

- **Le mot du fondateur remplace la preuve sociale** tant qu'aucun pilote n'est mesuré. Il est placé juste avant les tarifs, là où le doute monte. Le bloc « Résultat d'un pilote » est prêt dans `content.ts` et s'affiche seul dès qu'on y met `enabled: true`.
- **La garantie d'essai est collée aux tarifs**, pas perdue en bas de page : c'est là que l'inversion du risque sert.
- **La démo arrive en troisième écran**, juste après le problème : le visiteur a une raison d'y toucher, et Aymen peut y aller directement depuis la navigation en rendez-vous.
- **Le simulateur reprend le métier et le coût moyen choisis dans la démo** : le visiteur retrouve ses propres chiffres au lieu d'une valeur générique.
- **Le calcul du simulateur tient compte de la marge et des visites vraiment en plus.** Un client qui revient chercher un café offert serait parfois revenu de toute façon. Compter 100 % des retours comme gain serait malhonnête. Les deux hypothèses sont visibles et modifiables.
- **Aucune rareté affichée** : aucune n'est avérée à ce jour.
- **Segments de taille égale, chances réelles affichées.** Des segments proportionnels rendraient illisibles les lots rares (2 %) sur téléphone. Les chances sont donc réglées et affichées dans les réglages, et le tirage les respecte exactement.
- **Pas de Framer Motion.** Toutes les animations utiles (inertie de la roue, confettis, apparitions) tiennent en quelques lignes de CSS et de `requestAnimationFrame`. La bibliothèque aurait alourdi la page sans rien apporter de visible.

## 5. Tokens de design

```css
:root {
  /* Couleurs */
  --color-cream: #FBF6EE;        /* fond de page */
  --color-paper: #FFFFFF;        /* cartes */
  --color-ink: #1D1A16;          /* texte, 16.1:1 sur crème */
  --color-ink-soft: #5E564E;     /* texte secondaire, 6.7:1 sur crème */
  --color-line: #E8DFD2;         /* séparateurs */
  --color-tomette: #C4401F;      /* signature, texte blanc 5.1:1 */
  --color-tomette-deep: #A33317; /* liens et survol, 6.4:1 sur crème */
  --color-tomette-soft: #F6D9CE; /* fonds d'accent, encre 13:1 */
  --color-sauge: #2E6150;        /* succès, gain, texte blanc 7.1:1 */
  --color-sauge-soft: #DCEBE3;
  --color-safran: #F3B23C;       /* décor et roue uniquement, encre 9.3:1 */
  --color-night: #1D1A16;        /* sections sombres, crème 16.1:1 */
  --color-danger: #A3261B;

  /* Typographie */
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Figtree", system-ui, sans-serif;
  --text-xs: 0.8125rem;  --text-sm: 0.9375rem; --text-base: 1.0625rem;
  --text-lg: 1.25rem;    --text-xl: 1.5rem;    --text-2xl: 2rem;
  --text-3xl: clamp(2.25rem, 5vw + 1rem, 4.25rem);
  --leading-tight: 1.08; --leading-body: 1.55;

  /* Espacements (base 4 px) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;
  --space-24: 96px; --section-y: clamp(64px, 10vw, 128px);

  /* Rayons */
  --radius-sm: 10px; --radius-md: 14px; --radius-lg: 20px;
  --radius-xl: 28px; --radius-pill: 999px; --radius-phone: 44px;

  /* Ombres (chaudes, jamais noires pures) */
  --shadow-sm: 0 1px 2px rgb(60 30 10 / 0.06), 0 1px 1px rgb(60 30 10 / 0.04);
  --shadow-md: 0 8px 24px -8px rgb(60 30 10 / 0.18);
  --shadow-lg: 0 24px 60px -20px rgb(60 30 10 / 0.30);
  --shadow-wheel: 0 30px 60px -24px rgb(164 51 23 / 0.45);

  /* Mouvement */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 180ms; --duration-base: 320ms;
}
@media (prefers-reduced-motion: reduce) {
  :root { --duration-fast: 0ms; --duration-base: 0ms; }
}
```

Règles : texte blanc uniquement sur tomette, sauge ou nuit ; jamais de texte gris sur fond coloré ; le safran n'accueille que de l'encre.
