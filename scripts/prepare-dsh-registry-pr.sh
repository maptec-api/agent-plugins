#!/usr/bin/env sh
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${TMPDIR:-/tmp}/dsh-mcp-connector-registry-pr"
rm -rf "$WORK"
git clone --depth 1 https://github.com/duhu2000/dsh-mcp-connector-registry.git "$WORK"
cp "$ROOT/deepseek/maptec-maps.connector.json" "$WORK/connectors/maptec-maps.json"
cd "$WORK"
git checkout -b add-maptec-maps
git add connectors/maptec-maps.json
git commit -m "Add maptec-maps connector"
npm ci --legacy-peer-deps
npm test && npm run validate && npm run assets:check
echo ""
echo "Ready at: $WORK"
echo "Push to your fork and open PR to duhu2000/dsh-mcp-connector-registry:main"
echo "  git remote add fork https://github.com/<your-org>/dsh-mcp-connector-registry.git"
echo "  git push -u fork add-maptec-maps"