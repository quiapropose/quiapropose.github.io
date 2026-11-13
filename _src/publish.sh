#!/bin/sh
# Compile le site depuis _src/ et met à jour la racine du dépôt.
# Usage (depuis la racine du dépôt) : sh _src/publish.sh
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/.." && pwd)
node "$HERE/check.js"
SITE=https://quiapropose.fr/ python3 "$HERE/build.py"
mv "$HERE/index.html" "$ROOT/index.html"
python3 "$HERE/gen_seo.py" "$ROOT"
echo "Site compilé dans $ROOT"
