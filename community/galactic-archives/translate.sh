#!/bin/bash

# Load API Key from .env.local if present
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

echo "🚀 Starting Galactic Translation via Lingo CLI (Docker)..."
docker-compose -f docker-compose.translate.yml up --build

echo "✅ Translations complete! Check messages/ folder."
