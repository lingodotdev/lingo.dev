import Anthropic from "@anthropic-ai/sdk";
import { selectMenu, textPrompt } from "./cli.ts";
import { readFile, listFiles } from "./files.ts";
import { phase, toolCall, dim } from "./ui.ts";

// Research agent uses Sonnet — needs web search + stronger reasoning
// web_search_20250305 requires Sonnet — falls back gracefully if unavailable
const RESEARCH_MODEL = "claude-sonnet-4-6";

const researchSystem = `You are a product research analyst. Research a software product and produce a concise brief that will help an AI translation engine understand the product's market, audience, and tone.

Steps:
1. Read the project files — README, package.json, landing page copy, app strings
2. Search the web for the product/company name to understand market position, competitors, and industry tone conventions
3. Search for "[product category] localization best practices" or "[industry] translation tone" if useful

Produce a brief covering:
- What the product does and what problem it solves
- Target customers (role, industry, technical level)
- Market segment (B2B SaaS, consumer, devtools, etc.)
- Tone conventions in this space — what competitors use, what the market expects
- Domain-specific terms with known translation risks in this market
- Recommended tone register and pronoun form per language

Rules:
- Be specific and factual. No marketing language.
- Under 300 words.
- End with "Translation implications:" — concrete rules derived from market and audience research.

Respond with the brief as plain text. Do not use write_file.`;

// --- Research agent with file + web access ---

export async function runResearchAgent(
  client: Anthropic,
  targetDir: string,
  i18nBlock: string,
): Promise<string | null> {
  phase("Research", "scanning project + searching web");

  const messages: Anthropic.MessageParam[] = [{
    role: "user",
    content: [
      `Research this project and produce a product brief.`,
      i18nBlock,
      `Project folder: ${targetDir}`,
      `\nExplore the project files and search the web as needed.`,
    ].join("\n"),
  }];

  const tools = [
    {
      type: "web_search_20250305" as const,
      name: "web_search" as const,
    },
    {
      name: "list_files",
      description: "List all files in a directory",
      input_schema: {
        type: "object" as const,
        properties: { directory: { type: "string" } },
        required: ["directory"],
        additionalProperties: false,
      },
    },
    {
      name: "read_file",
      description: "Read the contents of a file",
      input_schema: {
        type: "object" as const,
        properties: { file_path: { type: "string" } },
        required: ["file_path"],
        additionalProperties: false,
      },
    },
  ];

  let brief = "";

  while (true) {
    const response = await client.messages.create({
      model: RESEARCH_MODEL,
      max_tokens: 2048,
      system: researchSystem,
      tools,
      messages,
    } as any);

    for (const block of response.content) {
      if (block.type === "text" && block.text.trim()) {
        brief = block.text.trim();
        process.stdout.write(`\x1B[2m     ${brief}\x1B[0m\n`);
      }
    }

    if (response.stop_reason !== "tool_use") break;

    const toolUses = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const tool of toolUses) {
      const input = tool.input as Record<string, string>;
      if (tool.name === "web_search") {
        toolCall("web_search", { query: input.query });
        toolResults.push({ type: "tool_result", tool_use_id: tool.id, content: "" });
      } else if (tool.name === "list_files") {
        toolCall("list_files", input);
        toolResults.push({ type: "tool_result", tool_use_id: tool.id, content: JSON.stringify(listFiles(input.directory)) });
      } else if (tool.name === "read_file") {
        toolCall("read_file", input);
        toolResults.push({ type: "tool_result", tool_use_id: tool.id, content: readFile(input.file_path) });
      }
    }

    messages.push({ role: "user", content: toolResults });
  }

  if (!brief) return null;
  return `--- Product Research Brief ---\n${brief}\n--- End Brief ---`;
}

// --- Quick questionnaire ---

const TONE_OPTIONS = [
  "Formal & professional",
  "Friendly & conversational",
  "Technical & precise",
  "Playful & energetic",
  "Neutral — let the code speak",
];

async function runQuestionnaire(): Promise<string | null> {
  console.log("\n  Answer a few questions — blank to skip any.\n");

  const product = await textPrompt("What does your product do?", "e.g. task manager for remote teams");
  const users   = await textPrompt("Who are your target users?", "e.g. developers, small business owners");
  const market  = await textPrompt("What industry or market?", "e.g. B2B SaaS, consumer, fintech");
  const toneIdx = await selectMenu("What tone should translations use?", TONE_OPTIONS, 0);
  const extra   = await textPrompt("Anything else translators should know?", "e.g. never translate brand name");

  const lines = ["Product brief from user interview:"];
  if (product) lines.push(`- Product: ${product}`);
  if (users)   lines.push(`- Target users: ${users}`);
  if (market)  lines.push(`- Market: ${market}`);
  lines.push(`- Tone: ${TONE_OPTIONS[toneIdx]}`);
  if (extra)   lines.push(`- Notes: ${extra}`);

  return lines.join("\n");
}

// --- Entry point: let user pick ---

export async function runResearch(
  client: Anthropic,
  targetDir: string,
  i18nBlock: string,
): Promise<string | null> {
  const choice = await selectMenu(
    "No lingo-context.md found. How should we gather product context?",
    [
      "Research agent  — Claude searches the web + reads your project",
      "Quick interview — answer 4 questions yourself",
      "Skip            — let the agent figure it out from code",
    ],
    0,
  );

  if (choice === 0) return runResearchAgent(client, targetDir, i18nBlock);
  if (choice === 1) return runQuestionnaire();
  return null;
}
