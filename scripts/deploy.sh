#!/bin/sh
# Build locally, then deploy the prebuilt output.
set -eu
if [ -z "${VERCEL_SCOPE:-}" ]; then
  echo "Set VERCEL_SCOPE to your Vercel team slug, then rerun." >&2
  exit 1
fi
vercel build --prod --yes --scope "$VERCEL_SCOPE"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
rsync -a --exclude .git --exclude .next/cache ./ "$tmp/"
vercel deploy --prebuilt --prod --yes --scope "$VERCEL_SCOPE" --cwd "$tmp"
