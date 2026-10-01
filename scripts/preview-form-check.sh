#!/usr/bin/env bash
# Disabled-form flow against a protected Vercel preview, with SYNTHETIC input only.
#
# Usage:  PREVIEW_BASE=https://<preview>.vercel.app PREVIEW_SHARE_URL='<temporary share link>' \
#         bash scripts/preview-form-check.sh <outfile>
#
# The share link (Vercel's own temporary access mechanism; it changes no protection setting) is only used
# to obtain the bypass cookie and is never written to the output file.
set -u
: "${PREVIEW_BASE:?set PREVIEW_BASE}" "${PREVIEW_SHARE_URL:?set PREVIEW_SHARE_URL}"
OUT="${1:?usage: preview-form-check.sh <outfile>}"
TMP="$(mktemp -d)"; JAR="$TMP/jar"; trap 'rm -rf "$TMP"' EXIT
B="$PREVIEW_BASE"
EMAIL='synthetic-r1-test%40example.invalid'; MARK='SYNTHETIC-R1-MARKER-7731'
{
  echo "Disabled-form flow on the protected Vercel preview (synthetic input only)"
  echo "Base: $B   Run: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "Access: temporary Vercel share link (not recorded). Values: synthetic-r1-test@example.invalid, marker $MARK"
  echo
} > "$OUT"

code=$(curl -s -o /dev/null -c "$JAR" -L -w '%{http_code}' "$PREVIEW_SHARE_URL"); echo "GET via share link -> HTTP $code" >> "$OUT"
curl -s -o "$TMP/early.html" -b "$JAR" -w "GET /en/early-access/ -> HTTP %{http_code}\n" "$B/en/early-access/" >> "$OUT"
echo "  disabled fieldsets: $(grep -o '<fieldset disabled' "$TMP/early.html" | wc -l) | sandbox notice present: $(grep -c 'Local test mode' "$TMP/early.html")" >> "$OUT"
echo >> "$OUT"; echo "== POST attempts: expected 503, disabled page, no success text ==" >> "$OUT"

post() { # desc path data [extra curl args]
  local desc="$1" path="$2" data="$3"; shift 3
  local code h1 succ
  code=$(curl -s -o "$TMP/r.html" -D "$TMP/h.txt" -b "$JAR" -w '%{http_code}' -X POST \
    -H 'Content-Type: application/x-www-form-urlencoded' -H "Origin: $B" "$@" --data "$data" "$B$path")
  h1=$(grep -o '<h1[^>]*>[^<]*' "$TMP/r.html" | sed 's/<h1[^>]*>//' | head -1)
  succ=$(grep -ci 'thank you\|we have received\|check your inbox' "$TMP/r.html")
  echo "$desc -> HTTP $code | h1: ${h1:-<none>} | success-text matches: $succ" >> "$OUT"
}
post 'keep-informed valid'   /en/submit/keep-informed/ "email=$EMAIL&consent=yes&website="
post 'early-access valid'    /en/submit/early-access/  "email=$EMAIL&organization=$MARK&role=test&useCase=$MARK&website="
post 'contact valid'         /en/submit/contact/       "email=$EMAIL&message=$MARK+body&website="
post 'contact invalid email' /en/submit/contact/       "email=nope&message=x"
post 'unknown field'         /en/submit/keep-informed/ "email=$EMAIL&consent=yes&admin=1"
post 'honeypot filled'       /en/submit/keep-informed/ "email=$EMAIL&consent=yes&website=spam"
for i in 1 2 3 4 5 6 7; do post "repeat #$i (no rate limit may answer; disabled returns first)" /en/submit/keep-informed/ "email=$EMAIL&consent=yes&website="; done
cp "$TMP/h.txt" "$TMP/h-last.txt"
echo "JSON content-type -> HTTP $(curl -s -o /dev/null -b "$JAR" -w '%{http_code}' -X POST -H 'Content-Type: application/json' -H "Origin: $B" --data '{"email":"x"}' "$B/en/submit/contact/")" >> "$OUT"
echo "cross-origin POST -> HTTP $(curl -s -o /dev/null -b "$JAR" -w '%{http_code}' -X POST -H 'Content-Type: application/x-www-form-urlencoded' -H 'Origin: https://evil.example' --data "email=$EMAIL&message=hello+world+ok" "$B/en/submit/contact/")" >> "$OUT"
curl -s -o /dev/null -D "$TMP/g.txt" -b "$JAR" "$B/en/submit/contact/"
echo "GET submit route -> $(head -1 "$TMP/g.txt" | tr -d '\r'), $(grep -i '^location' "$TMP/g.txt" | tr -d '\r')" >> "$OUT"
echo >> "$OUT"; echo "== headers of the last disabled POST response ==" >> "$OUT"
grep -iE '^HTTP|cache-control|x-robots-tag|x-frame|x-content-type|referrer-policy|strict-transport|permissions-policy|cross-origin|content-security-policy|set-cookie' "$TMP/h-last.txt" | tr -d '\r' | cut -c1-200 >> "$OUT"
echo >> "$OUT"; echo "== headers of GET /en/early-access/ ==" >> "$OUT"
curl -s -o /dev/null -D - -b "$JAR" "$B/en/early-access/" | grep -iE '^HTTP|cache-control|x-robots-tag|x-frame|x-content-type|referrer-policy|strict-transport|content-security-policy|set-cookie' | tr -d '\r' | cut -c1-200 >> "$OUT"
grep -c '_vercel_share' "$OUT" | sed 's/^/share-token occurrences in output (must be 0): /' >> "$OUT"
echo "done -> $OUT"
