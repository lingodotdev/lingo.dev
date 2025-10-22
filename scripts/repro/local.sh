#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="lingo-repro:20.12.2"
DOCKERFILE="Dockerfile.repro"

echo "Building reproducible build image: ${IMAGE_TAG}"
docker build -f "${DOCKERFILE}" -t "${IMAGE_TAG}" .

GIT_COMMIT=$(git rev-parse HEAD)

echo "Running hermetic build in container"
UID_GID="$(id -u):$(id -g)"
DOCKER_ARGS=(
  --rm
  --user "${UID_GID}"
  -e GIT_COMMIT="${GIT_COMMIT}"
  -v "$(pwd)":/workspace
  -w /workspace
  --entrypoint bash
)
if [ -n "${REPRO_PNPM_STORE:-}" ]; then
  mkdir -p "${REPRO_PNPM_STORE}"
  DOCKER_ARGS+=( -e PNPM_STORE_DIR=/pnpm-store -v "${REPRO_PNPM_STORE}:/pnpm-store" )
fi
docker run "${DOCKER_ARGS[@]}" \
  "${IMAGE_TAG}" \
  -lc "scripts/repro/build.sh"

echo "Done. Artifacts in ./out"
