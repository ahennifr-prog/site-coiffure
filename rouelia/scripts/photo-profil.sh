#!/usr/bin/env bash
# Prépare la pastille « À propos » : carré 1:1 centré sur le visage, WebP 96 et 192 px.
# Usage : bash scripts/photo-profil.sh photo.jpg TAILLE X Y
#   TAILLE : côté du carré dans la photo d'origine, X Y : coin haut gauche du carré (en pixels).
# Sans argument : recadrage du fondateur dans la photo de /a-propos (carré de 320 px en 240, 30).
# Version en ligne : photo de profil du Drive (9 octobre 2026), bash scripts/photo-profil.sh photo.png 900 230 90.
# Puis renseigner FOUNDER_AVATAR dans config.ts.
set -euo pipefail
dir="$(dirname "$0")/../public/a-propos"
src="${1:-$dir/poignee-de-main-1080.webp}"
size="${2:-320}"; x="${3:-240}"; y="${4:-30}"
for w in 96 192; do
  ffmpeg -loglevel error -y -i "$src" -vf "crop=${size}:${size}:${x}:${y},scale=${w}:${w}:flags=lanczos" -c:v libwebp -q:v 82 "$dir/profil-${w}.webp"
done
ls -la "$dir"/profil-*.webp
