import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { readFile } from "./files.ts";
import { reviewContent } from "./agent-loop.ts";
import { fileHash, type FileEntry } from "./state.ts";
import { toolCall } from "./ui.ts";

export async function generateJsoncComments(
  client: Anthropic,
  model: string,
  sourceFile: string,
  lingoContext: string,
  feedback = "",
): Promise<Record<string, string>> {
  const content = readFile(sourceFile);
  const feedbackBlock = feedback ? `\nUser feedback on previous attempt:\n${feedback}\nPlease revise accordingly.\n` : "";
  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: `You are generating translator notes for a JSONC localization file.

Localization context:
${lingoContext}

Source file (${path.basename(sourceFile)}):
${content}
${feedbackBlock}
For each key, write a short one-line translator note that tells the translator:
- What UI element or context the string appears in
- Any ambiguity, idiom, or special meaning to watch out for
- Length or tone constraints if relevant

Return ONLY a flat JSON object mapping each key to its note. No nesting, no explanation.
Example: {"nav.home": "Navigation item in top header bar", "checkout.submit": "Button — triggers payment, keep short"}`,
    }],
  });

  const text = response.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text ?? "{}";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return {};
  try { return JSON.parse(match[0]); } catch { return {}; }
}

export function injectJsoncComments(filePath: string, comments: Record<string, string>): void {
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  const result: string[] = [];

  for (const line of lines) {
    const keyMatch = line.match(/^(\s*)"([^"]+)"\s*:/);
    if (keyMatch) {
      const indent = keyMatch[1];
      const key = keyMatch[2];
      if (result.length > 0 && result[result.length - 1].trimStart().startsWith("// CTX:")) {
        result.pop();
      }
      if (comments[key]) result.push(`${indent}// CTX: ${comments[key]}`);
    }
    result.push(line);
  }

  fs.writeFileSync(filePath, result.join("\n"), "utf-8");
}

export async function runJsoncInjection(
  client: Anthropic,
  model: string,
  files: string[],
  contextPath: string,
  review = false,
): Promise<FileEntry[]> {
  if (files.length === 0) return [];
  const injected: FileEntry[] = [];
  const lingoContext = readFile(contextPath);

  for (const file of files) {
    let comments: Record<string, string> = {};
    let extraContext = "";

    while (true) {
      toolCall("annotate", { file_path: path.basename(file) + (extraContext ? "  (revised)" : "") });
      comments = await generateJsoncComments(client, model, file, lingoContext, extraContext);
      if (Object.keys(comments).length === 0) break;

      if (!review) break;

      const preview = Object.entries(comments).map(([k, v]) => `  "${k}": "${v}"`).join("\n");
      const result = await reviewContent(`comments for ${path.basename(file)}`, preview);
      if (result === "accept") break;
      if (result === "skip") { comments = {}; break; }
      extraContext = result;
    }

    if (Object.keys(comments).length > 0) {
      injectJsoncComments(file, comments);
      injected.push([file, fileHash(file)]);
    }
  }

  return injected;
}
