import { tool, ToolRuntime } from "@langchain/core/tools";
import { TavilySearch } from "@langchain/tavily";
import z from "zod";

const webSearch = new TavilySearch({
  maxResults: 5,
  searchDepth: "basic",
  topic: "general",
  includeAnswer: true,
  includeImages: false,
});

export const webSearchTool = tool(
  async ({ query }: { query: string }, config: ToolRuntime) => {
    const writer = config.writer;

    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      writer?.({
        type: "progress",
        id: "web_search",
        message: "Error: Tavily API key not found success=false",
      });
      throw new Error(
        "Tavily API key not found. Please set TAVILY_API_KEY environment variable."
      );
    }

    writer?.({
      type: "progress",
      id: "web_search",
      message: `Searching the web for "${query}"...`,
    });
    const res = await webSearch.invoke({ query });

    writer?.({
      type: "progress",
      id: "web_search",
      message: "Web search completed successfully success=true",
    });
    return res;
  },
  {
    name: "web_search",
    description:
      "Useful for when you need to answer questions about current events or find specific information from the web.",
    schema: z.object({
      query: z.string().describe("The search query to look up on the web"),
    }),
  }
);
