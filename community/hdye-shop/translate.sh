#!/bin/sh
set -e

echo "🌍 Starting Lingo.dev translations..."

# Configure GROQ API key
lingo.dev config set llm.groqApiKey "$GROQ_API_KEY"

# Run the i18n command with BYOK mode
lingo.dev i18n

echo "✅ All translations complete!"