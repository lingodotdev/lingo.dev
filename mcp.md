# Model Context Protocol

The [Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) is a standard for connecting Large Language Models (LLMs) to external services. This guide will walk you through how to connect AI tools to Lingo.dev using MCP.

Some of the AI tools that support MCP are:

- [Cursor](https://www.cursor.com/)
- [Claude desktop](https://claude.ai/download)
- [Cline for VS Code](https://github.com/cline/cline)

Connecting these tools to Lingo.dev will allow you to translate apps, websites, and other data using the best LLM models directly in your AI tool.

## Setup

Add this command to your AI tool:

```bash
npx -y lingo.dev mcp <api-key>
```

You can find your API key in [Lingo.dev app](https://lingo.dev/app/), in your project settings.

This will allow the tool to use `translate` tool provided by Lingo.dev. The setup depends on your AI tool and might be different for each tool. Here is setup for some of the tools we use in our team:

### Cursor

1. Open Cursor and go to Cursor Settings.
2. Open MCP tab
3. Click `+ Add new MCP server`
4. Enter the following details:
   - Name: Lingo.dev
   - Type: command
   - Command: `npx -y lingo.dev mcp <api-key>` (use your project API key)
5. You will see green status indicator and "translate" tool available in the list

### Claude desktop

1. Open Claude desktop and go to Settings.
2. Open Developer tab
3. Click `Edit Config` to see configuration file in file explorer.
4. Open the file in text editor
5. Add the following configuration (use your project API key):

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "lingo.dev", "mcp", "<api-key>"]
    }
  }
}
```

6. Save the configuration file
7. Restart Claude desktop.
8. In the chat input, you will see a hammer icon with your MCP server details.

## Usage

You are now able to access Lingo.dev via MCP. You can ask AI tool translate any content via our service.
