#!/usr/bin/env bash

set -e

IMAGE_NAME="lingodotdev/lingo.dev"

if [[ "$(docker images -q $IMAGE_NAME 2> /dev/null)" == "" ]]; then
  echo "Building Docker image..."
  docker build -t $IMAGE_NAME .
fi

# Pass through environment variables
ENV_ARGS=""
if [ -f .env ]; then
  ENV_ARGS="--env-file .env"
fi

# Pass common build/CI environment variables
for var in CI NODE_ENV TURBO_TOKEN TURBO_TEAM TURBO_REMOTE_ONLY DEBUG; do
  if [ ! -z "${!var}" ]; then
    ENV_ARGS="$ENV_ARGS -e $var=${!var}"
  fi
done

docker run --rm -it \
  -v "$(pwd)":/app \
  -w /app \
  $ENV_ARGS \
  $IMAGE_NAME \
  pnpm exec turbo "$@"
