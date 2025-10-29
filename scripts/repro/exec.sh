#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="lingo-repro:20.12.2"
DOCKERFILE="Dockerfile.repro"

# Build the image if missing
if ! docker image inspect "${IMAGE_TAG}" >/dev/null 2>&1; then
  echo "Building reproducible build image: ${IMAGE_TAG}"
  docker build -f "${DOCKERFILE}" -t "${IMAGE_TAG}" .
fi

UID_GID="$(id -u):$(id -g)"
GIT_COMMIT=${GIT_COMMIT:-"$(git rev-parse HEAD)"}

if [ $# -eq 0 ]; then
  echo "Opening interactive shell in container..."
  DOCKER_ARGS=(
    --rm -it
    --user "${UID_GID}"
    -e HOME="/tmp"
    -e XDG_CACHE_HOME="/tmp/.cache"
    -e COREPACK_HOME="/tmp/.corepack"
    -e GIT_COMMIT="${GIT_COMMIT}"
    -v "$(pwd)":/workspace
    -w /workspace
    --entrypoint bash
  )
  # Pass through common tokens if present
  [ -n "${GH_TOKEN:-}" ] && DOCKER_ARGS+=( -e GH_TOKEN )
  [ -n "${GITHUB_TOKEN:-}" ] && DOCKER_ARGS+=( -e GITHUB_TOKEN )
  [ -n "${NPM_TOKEN:-}" ] && DOCKER_ARGS+=( -e NPM_TOKEN )
  [ -n "${LINGODOTDEV_API_KEY:-}" ] && DOCKER_ARGS+=( -e LINGODOTDEV_API_KEY )
  if [ -n "${REPRO_PNPM_STORE:-}" ]; then
    mkdir -p "${REPRO_PNPM_STORE}"
    DOCKER_ARGS+=( -e PNPM_STORE_DIR=/pnpm-store -v "${REPRO_PNPM_STORE}:/pnpm-store" )
  fi
  exec docker run "${DOCKER_ARGS[@]}" \
    "${IMAGE_TAG}"
else
  CMD="$*"
  echo "Running in container: ${CMD}"
  DOCKER_ARGS=(
    --rm
    --user "${UID_GID}"
    -e HOME="/tmp"
    -e XDG_CACHE_HOME="/tmp/.cache"
    -e COREPACK_HOME="/tmp/.corepack"
    -e GIT_COMMIT="${GIT_COMMIT}"
    -v "$(pwd)":/workspace
    -w /workspace
    --entrypoint bash
  )
  # Pass through common tokens if present
  [ -n "${GH_TOKEN:-}" ] && DOCKER_ARGS+=( -e GH_TOKEN )
  [ -n "${GITHUB_TOKEN:-}" ] && DOCKER_ARGS+=( -e GITHUB_TOKEN )
  [ -n "${NPM_TOKEN:-}" ] && DOCKER_ARGS+=( -e NPM_TOKEN )
  [ -n "${LINGODOTDEV_API_KEY:-}" ] && DOCKER_ARGS+=( -e LINGODOTDEV_API_KEY )
  if [ -n "${REPRO_PNPM_STORE:-}" ]; then
    mkdir -p "${REPRO_PNPM_STORE}"
    DOCKER_ARGS+=( -e PNPM_STORE_DIR=/pnpm-store -v "${REPRO_PNPM_STORE}:/pnpm-store" )
  fi
  exec docker run "${DOCKER_ARGS[@]}" \
    "${IMAGE_TAG}" -lc "${CMD}"
fi
