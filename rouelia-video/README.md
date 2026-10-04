# Vidéo Rouelia (motion design en code)

Vidéo promotionnelle de 46 secondes faite avec Remotion (React), aux couleurs de Rouelia.

- `src/timing.json` : début et fin de chaque scène (images à 30 par seconde).
- `src/events.json`, `src/spin.json` : instants clés partagés par l'image et le son.
- `src/scenes.tsx` : les 11 scènes ; `src/components.tsx` : roue, store banne, téléphone, logo, textes animés.
- `scripts/audio.mjs` : musique (120 BPM, Ré majeur) et bruitages synthétisés en code.

Commandes :
- `node scripts/audio.mjs` : fabrique `public/audio/mix.wav` ;
- `npx remotion still vertical out/test.png --frame=600` : une image de contrôle ;
- `npx remotion render vertical out/rouelia-vertical.mp4 --codec=h264 --crf=18` : la vidéo.

Voix off : Xavier (Higgsfield, moteur ElevenLabs), accélérée de 6 à 8 % au montage.

## Point de reprise (4 octobre 2026)
Version 1 rendue et envoyée à Aymen (verticale, 46 s, musique et bruitages, sans voix). Validé par Aymen :
voix **Xavier** (Higgsfield, `voice_id` 43173c95-3ec8-446a-a162-6504332c578b, moteur ElevenLabs), à accélérer
d'environ 7 % au montage (`atempo`). Voix off générée (45,1 s) :
https://d8j0ntlcm91z4.cloudfront.net/user_3FaTTGxQRyWOjWhHTF3wfhO8MaK/hf_20261004_035526_92bdce87-2d5e-4a18-b566-930bea3ea9ca.mp3
(le réseau de Claude ne peut pas la télécharger : Aymen doit l'envoyer en pièce jointe).

Texte de la voix (validé) :
« Du mal à fidéliser vos clients ? / C'est pourtant devenu simple. / Un brushing, un mochi, une séance bien-être
offerte, une promo… ce qui transforme un client de passage en habitué. / Votre client scanne le QR code du flyer…
il est invité à laisser un avis Google… puis il tourne la roue : cent pour cent gagnant ! / Son cadeau l'attend à
sa prochaine visite, qu'il réserve en un clic. / Vous réglez les chances, le coût, et vos gros cadeaux. / L'I.A.
répond à vos avis en un clic. / Plus d'avis, plus de visibilité sur Google, plus de nouveaux clients… qui
reviennent. / Rouelia : la façon la plus simple d'attirer de nouveaux clients et de les faire revenir. Quatorze
jours d'essai gratuit sur rouelia point f r. »

Décisions : accord de la gérante pour montrer ALIA coiffure ; flyer 3D plutôt que chevalet ; jamais « laisse un
avis et gagne » (Google l'interdit) mais « est invité à laisser un avis » ; « la façon la plus simple » plutôt que
« la meilleure » ; chiffre de rentabilité présenté comme un exemple ; commerces : ALIA coiffure, Sushi Kai,
Matcha Bar, Studio Pilates, La Boutique.

À faire (version 2) :
1. Recevoir la voix off et 3 photos (mochi, studio Pilates, boutique de luxe, générées par Aymen sur ChatGPT).
   Photo ALIA : `public/photos/alia-brushing.jpg` (fournie par Aymen, hors dépôt, à redemander si la session
   repart de zéro).
2. Scène « shops » : photo plein écran derrière chaque roue, synchronisée sur « un brushing », « un mochi »,
   « une séance bien-être offerte », « une promo ».
3. Mesurer le début de chaque phrase (ffmpeg silencedetect) et recaler `src/timing.json` et `src/events.json`.
4. Mixer voix (accélérée), musique (baissée sous la voix) et bruitages ; rendre la verticale.
5. Version horizontale 16:9 (composition `horizontal`, mêmes scènes réorganisées).
Higgsfield (compte gratuit, environ 7 crédits) : la génération d'images demande un abonnement payant.

## État au 4 octobre 2026 (fin de journée)
- **Verticale validée par Aymen : v5** (`npx remotion render vertical out/rouelia-vertical-v5.mp4`), 46,3 s.
- **Horizontale 16:9** : composition `horizontal` (même minutage, même son). Chaque scène verticale est
  recadrée à droite (`STAGE` dans `src/components.tsx`), le titre passe en grand dans la colonne de gauche
  (`Headline`), les fonds débordent sur tout l'écran (`useBleed`). L'écran de fin a sa propre mise en page.
- **Voix** : `public/audio/voice-raw.mp3` (prise principale) et `public/audio/voice-end.mp3` (fin : « Rouelia.
  Vos clients gagnent un cadeau… vous, leur prochaine visite. Essayez gratuitement pendant quatorze jours,
  sur rouelia point f r. »), toutes deux hors dépôt, sur le Drive d'Aymen (« Voixrouelia », « Voixfin »).
  `scripts/mix.sh` remonte la voix : accroche à vitesse naturelle, deux pauses, puis le reste à +7 %.
  Attention : la prise principale commence à parler dès 0 s (ne pas se fier au premier « silence_end »).
- **Son** : bruitages devant la musique, pas de whoosh aux coupes (jugé lassant), clic discret à la place.
- `npm run audio` refait musique, bruitages et mix ; puis rendu de chaque composition.
