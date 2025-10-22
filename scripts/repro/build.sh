#!/usr/bin/env bash
set -euo pipefail

export TZ="UTC"
export LC_ALL="C"
export LANG="C"
export CI="${CI:-1}"

# Ensure writable cache/home inside container regardless of UID:GID
export HOME="/tmp"
export XDG_CACHE_HOME="/tmp/.cache"
export COREPACK_HOME="/tmp/.corepack"

GIT_COMMIT=${GIT_COMMIT:-"$(git rev-parse HEAD)"}
export SOURCE_DATE_EPOCH=${SOURCE_DATE_EPOCH:-"$(git log -1 --pretty=%ct "${GIT_COMMIT}")"}

echo "Using commit: ${GIT_COMMIT}"
echo "SOURCE_DATE_EPOCH: ${SOURCE_DATE_EPOCH}"

# Ensure pnpm is the pinned version via corepack
corepack enable >/dev/null 2>&1 || true
pnpm -v

# Guardrails: lockfile must be respected
pnpm install --frozen-lockfile

# Disable remote cache/telemetry for determinism
export TURBO_TELEMETRY_DISABLE=1
export TURBO_REMOTE_CACHE_DISABLE=1
export TURBO_NO_DAEMON=1
export TURBO_CONCURRENCY=1

# Build
pnpm turbo build --force

# Package canonical artifacts
mkdir -p out

# Collect build directories
mapfile -t BUILD_DIRS < <(find packages -maxdepth 2 -type d -name build | sort)
if [ ${#BUILD_DIRS[@]} -eq 0 ]; then
  echo "No build directories found under packages/*/build" >&2
  exit 1
fi

echo "Packaging canonical bundle from:"
printf ' - %s\n' "${BUILD_DIRS[@]}"

CANONICAL_TAR="out/canonical.tar"

tar --create \
    --file "${CANONICAL_TAR}" \
    --sort=name \
    --mtime=@"${SOURCE_DATE_EPOCH}" \
    --owner=0 --group=0 --numeric-owner \
    "${BUILD_DIRS[@]}"

# Checksums and manifest
sha256sum "${CANONICAL_TAR}" > out/SHA256SUMS

cat > out/BUILD-MANIFEST.json <<EOF
{
  "commit": "${GIT_COMMIT}",
  "sourceDateEpoch": ${SOURCE_DATE_EPOCH},
  "nodeVersion": "$(node -v)",
  "pnpmVersion": "$(pnpm -v)"
}
EOF

echo "Canonical bundle: ${CANONICAL_TAR}"
echo "Checksums written to out/SHA256SUMS"
