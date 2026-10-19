#!/usr/bin/env bash
# Mint limited-use codes for mbti-64 into MantleDB collection "mb"
# (separate from cat-quiz "c" and bazi-love "bz").
# Usage: MANTLE_CREDS=/path/mantle.json ./tools/mint.sh [count]
#    or: MANTLE_KEY=... ./tools/mint.sh [count]
set -euo pipefail
NS="${MANTLE_NS:-catquiz-zph420-codes}"
COL="mb"
KEY="${MANTLE_KEY:-}"
COUNT="${1:-10}"
MAX_USES="${MAX_USES:-3}"
if [[ -z "$KEY" && -f "${MANTLE_CREDS:-}" ]]; then
  KEY=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['key'])" "$MANTLE_CREDS")
fi
[[ -z "$KEY" ]] && { echo "Set MANTLE_KEY or MANTLE_CREDS" >&2; exit 1; }
ALPHABET='ABCDEFGHJKMNPQRSTUVWXYZ23456789'
minted=()
i=0
while [[ $i -lt $COUNT ]]; do
  code='MB'
  for _ in 1 2 3 4; do
    code+=${ALPHABET:RANDOM % ${#ALPHABET}:1}
  done
  st=$(curl -s -o /dev/null -w '%{http_code}' "https://mantledb.sh/v2/$NS/$COL/$code" -H "X-Mantle-Key: $KEY")
  [[ "$st" == "200" ]] && continue
  resp=$(curl -sS -X POST "https://mantledb.sh/v2/$NS/$COL/$code" \
    -H "Content-Type: application/json" \
    -H "X-Mantle-Key: $KEY" \
    -d "{\"remaining\":$MAX_USES,\"max\":$MAX_USES,\"created\":\"$(date -Iseconds)\"}")
  echo "$code $resp" >&2
  minted+=("$code")
  i=$((i + 1))
done
printf '%s\n' "${minted[@]}"
