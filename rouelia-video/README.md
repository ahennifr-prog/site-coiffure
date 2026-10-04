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
