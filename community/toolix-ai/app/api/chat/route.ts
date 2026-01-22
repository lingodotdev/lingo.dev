import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStreamResponse, UIMessage } from "ai";
import { buildGraph } from "@/lib/graph";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const graph = buildGraph();

  const langchainMessages = await toBaseMessages(messages);

  const stream = await graph.stream(
    { messages: langchainMessages },
    { streamMode: ["values", "messages", "custom"] },
  );

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream) as Parameters<typeof createUIMessageStreamResponse>[0]["stream"],
  });
}
