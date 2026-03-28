import Anthropic from "@anthropic-ai/sdk";
import path from "path";
import { selectMenu, textPrompt } from "./cli.ts";
import { readFile, writeFile } from "./files.ts";
import { toolCall, reviewBox } from "./ui.ts";

export const allTools: Anthropic.Tool[] = [
  {
    name: "list_files",
    description: "List all files in a directory (ignores node_modules, .next, .git, dist)",
    input_schema: {
      type: "object",
      properties: { directory: { type: "string" } },
      required: ["directory"],
      additionalProperties: false,
    },
  },
  {
    name: "read_file",
    description: "Read the contents of a file",
    input_schema: {
      type: "object",
      properties: { file_path: { type: "string" } },
      required: ["file_path"],
      additionalProperties: false,
    },
  },
  {
    name: "write_file",
    description: "Write content to a file",
    input_schema: {
      type: "object",
      properties: {
        file_path: { type: "string" },
        content:   { type: "string" },
      },
      required: ["file_path", "content"],
      additionalProperties: false,
    },
  },
];

export const writeOnlyTools: Anthropic.Tool[] = [allTools[2]];

function executeTool(name: string, input: Record<string, string>, listFilesFn: (dir: string) => string[]): string {
  switch (name) {
    case "list_files":  return JSON.stringify(listFilesFn(input.directory));
    case "read_file":   return readFile(input.file_path);
    case "write_file":  return writeFile(input.file_path, input.content);
    default:            return `Unknown tool: ${name}`;
  }
}

export async function reviewContent(label: string, content: string): Promise<"accept" | "skip" | string> {
  reviewBox(label, content);
  const choice = await selectMenu("", ["Accept", "Request changes", "Skip"], 0);
  if (choice === 0) return "accept";
  if (choice === 2) return "skip";
  const feedback = await textPrompt("What should be changed?");
  return feedback || "skip";
}

export async function runAgent(
  client: Anthropic,
  model: string,
  system: string,
  userMessage: string,
  tools: Anthropic.Tool[],
  listFilesFn: (dir: string) => string[],
  review = false,
) {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: userMessage }];

  while (true) {
    const response = await client.messages.create({ model, max_tokens: 16000, system, tools, messages });

    for (const block of response.content) {
      if (block.type === "text" && block.text.trim()) {
        // dim agent reasoning — it's secondary to the tool calls
        process.stdout.write(`\x1B[2m     ${block.text.trim()}\x1B[0m\n`);
      }
    }

    if (response.stop_reason !== "tool_use") break;

    const toolUses = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const tool of toolUses) {
      const input = tool.input as Record<string, string>;

      if (review && tool.name === "write_file") {
        const label = path.basename(input.file_path);
        const result = await reviewContent(label, input.content);
        if (result === "accept") {
          toolCall("write_file", input);
          toolResults.push({ type: "tool_result", tool_use_id: tool.id, content: writeFile(input.file_path, input.content) });
        } else if (result === "skip") {
          toolResults.push({ type: "tool_result", tool_use_id: tool.id, content: "User skipped this write — do not write this file." });
        } else {
          toolResults.push({ type: "tool_result", tool_use_id: tool.id, content: `User requested changes: ${result}\nPlease revise and call write_file again with the updated content.` });
        }
      } else {
        toolCall(tool.name, input);
        toolResults.push({ type: "tool_result", tool_use_id: tool.id, content: executeTool(tool.name, input, listFilesFn) });
      }
    }

    messages.push({ role: "user", content: toolResults });
  }
}
