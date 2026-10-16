#!/bin/sh
# ---------------------------------------------------------------------------
# Download a local copy of Leaflet 1.9.4 into vendor/leaflet/.
#
# Run this once, from this folder, in your own Terminal:
#     ./vendor-leaflet.sh
#
# Why: the problem map uses Leaflet. app.js loads /vendor/leaflet/leaflet.js
# first and falls back to a CDN if it isn't there, so the map works either
# way — but with the local copy the site has no third-party dependency at
# page load, and it keeps working if that CDN ever goes away.
#
# Re-run it to upgrade: change VER below, run it, deploy, load /map and
# check the pins still appear.
# ---------------------------------------------------------------------------
set -e
VER=1.9.4
DIR="$(dirname "$0")/vendor/leaflet"
BASE="https://cdnjs.cloudflare.com/ajax/libs/leaflet/$VER"

mkdir -p "$DIR"
echo "Downloading Leaflet $VER into $DIR"
curl -fSL -o "$DIR/leaflet.js"  "$BASE/leaflet.js"
curl -fSL -o "$DIR/leaflet.css" "$BASE/leaflet.css"

# leaflet.css references these; the map uses HTML pins so they're only needed
# by Leaflet's own default icon, but fetching them keeps the console clean.
for f in marker-icon.png marker-icon-2x.png marker-shadow.png layers.png layers-2x.png; do
  curl -fSL -o "$DIR/images/$f" --create-dirs "$BASE/images/$f" || echo "  (skipped $f)"
done

echo
echo "Done:"
ls -la "$DIR"
echo
echo "Now deploy:  firebase deploy --only hosting"
