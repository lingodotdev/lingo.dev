import { Command } from "interactive-commander";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Z from "zod";
import { ReplexicaEngine } from "@lingo.dev/_sdk";
import { getSettings } from "../utils/settings";
import { createAuthenticator } from "../utils/auth";

export default new Command()
  .command("mcp")
  .description(
    "Start MCP server for AI assistant integration",
  )
  .helpOption("-h, --help", "Show help")
  .action(async (_, program) => {
    const apiKey = program.args[0];
    const settings = getSettings(apiKey);

    if (!settings.auth.apiKey) {
      console.error("No API key provided");
      return;
    }

    const authenticator = createAuthenticator({
      apiUrl: settings.auth.apiUrl,
      apiKey: settings.auth.apiKey!,
    });
    const auth = await authenticator.whoami();

    if (!auth) {
      console.error("Not authenticated");
      return;
    } else {
      console.log(`Authenticated as ${auth.email}`);
    }

    const replexicaEngine = new ReplexicaEngine({
      apiKey: settings.auth.apiKey,
      apiUrl: settings.auth.apiUrl,
    });

    const server = new McpServer({
      name: "Lingo.dev",
      version: "1.0.0",
    });

    server.tool(
      "translate",
      "Detect language and translate text with Lingo.dev.",
      {
        text: Z.string(),
        targetLocale: Z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/),
      },
      async ({ text, targetLocale }) => {
        const sourceLocale = await replexicaEngine.recognizeLocale(text);
        const data = await replexicaEngine.localizeText(text, {
          sourceLocale,
          targetLocale,
        });
        return { content: [{ type: "text", text: data }] };
      },
    );

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Lingo.dev MCP Server running on stdio");
  });
