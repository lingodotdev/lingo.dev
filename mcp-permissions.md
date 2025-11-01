
# MCP Permission Manifest for Lingo.dev Translation Server

This document describes the proposed permission manifest for the Lingo.dev Translation MCP server.

## Permissions

| Permission | Scope | Justification |
|---|---|---|
| `mcp.ac.system.env.read` | `LINGODOTDEV_API_KEY`, `LINGODOTDEV_API_URL`, `LINGODOTDEV_WEB_URL`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `GOOGLE_API_KEY`, `OPENROUTER_API_KEY`, `MISTRAL_API_KEY` | The server reads these environment variables to get API keys and configuration for the Lingo.dev API and various LLM providers. |
| `mcp.ac.filesystem.read` | `~/.lingodotdevrc` | The server reads this file to get user-specific configuration, including API keys. |
| `mcp.ac.network.client` | `https://engine.lingo.dev` | The server makes network requests to the Lingo.dev API for authentication and translation services. The URL can be overridden by the `LINGODOTDEV_API_URL` environment variable. |

## Review Feedback

The requested permissions are all necessary for the server to function correctly. The scopes have been narrowed down to the specific resources that the server needs to access.

This manifest is based on the analysis of the MCP server implementation in `packages/cli/src/cli/cmd/mcp.ts` and the settings loading logic in `packages/cli/src/cli/utils/settings.ts`.
