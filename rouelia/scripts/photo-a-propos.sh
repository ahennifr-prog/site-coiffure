#!/usr/bin/env bash
# Prépare la photo de la page /a-propos : WebP en 3 largeurs, ratio 4:3, recadrée au centre.
# Usage : bash scripts/photo-a-propos.sh chemin/vers/photo.jpg
# Puis passer `aboutPhoto.ready` à true dans app/a-propos/page.tsx.
set -euo pipefail
src="$1"
out="$(dirname "$0")/../public/a-propos"
mkdir -p "$out"
for w in 640 960 1280; do
  h=$((w * 3 / 4))
  ffmpeg -loglevel error -y -i "$src" -vf "scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}" -c:v libwebp -q:v 78 "$out/poignee-de-main-${w}.webp"
done
ls -la "$out"
