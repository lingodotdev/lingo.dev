import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import { readFile } from "./files.ts";
import { reviewContent } from "./agent-loop.ts";
import { phase, info, warn, fail } from "./ui.ts";

const voiceSystem = `You are a brand voice writer for software localization.

Given: lingo-context.md describing the product, tone, audience, and language-specific rules.
Task: Write a brand voice for one target locale — concise natural language instructions for the LLM translator.

A brand voice must cover:
- Pronoun register: formal vs informal (du/Sie, tu/vous, tú/usted, etc.)
- Tone: professional, conversational, technical, playful — be specific
- Audience context if it changes word choice
- Any critical conventions from the lingo-context.md for this locale (length, script, idioms)

Rules:
- 3–6 sentences. No bullet points. Plain prose.
- Actionable only — no generic advice like "be natural". Every sentence must constrain a decision.
- Pull from the lingo-context.md language section for this locale. Do not invent rules not in the file.
- Write in English.`;

async function generateVoice(
  client: Anthropic,
  model: string,
  locale: string,
  context: string,
  feedback?: string,
  previous?: string,
): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: `Target locale: ${locale}\n\n${context}` },
  ];
  if (previous && feedback) {
    messages.push({ role: "assistant", content: previous });
    messages.push({ role: "user", content: `Please revise: ${feedback}` });
  }

  const response = await client.messages.create({
    model,
    max_tokens: 512,
    system: voiceSystem,
    messages,
  });

  return response.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text.trim() ?? "";
}

export async function runVoices(
  client: Anthropic,
  model: string,
  contextPath: string,
  i18nPath: string,
  targetLocales: string[],
): Promise<void> {
  if (!fs.existsSync(contextPath)) {
    fail(`lingo-context.md not found — run ctx first, then re-run with --voices.`);
    return;
  }

  if (targetLocales.length === 0) {
    warn(`No target locales in i18n.json — nothing to generate.`);
    return;
  }

  const context = readFile(contextPath);
  if (context.startsWith("[Error:")) {
    fail(`Cannot read context file: ${contextPath}`);
    return;
  }

  let i18nRaw: string;
  try {
    i18nRaw = fs.readFileSync(i18nPath, "utf-8");
  } catch (e) {
    fail(`Cannot read i18n file: ${i18nPath}\n${e}`);
    return;
  }

  let i18n: Record<string, unknown>;
  try {
    i18n = JSON.parse(i18nRaw);
  } catch (e) {
    fail(`Malformed JSON in ${i18nPath}: ${e}`);
    return;
  }
  const voices: Record<string, string> = { ...(i18n.provider?.voices ?? {}) };

  phase("Brand Voices", targetLocales.join("  "));

  for (const locale of targetLocales) {
    info(`[${locale}]  generating...`);
    let text = await generateVoice(client, model, locale, context);
    if (!text) { warn(`[${locale}]  no output — skipped`); continue; }

    while (true) {
      const result = await reviewContent(`Brand voice · ${locale}`, text);
      if (result === "accept") { voices[locale] = text; break; }
      if (result === "skip")   { info(`[${locale}]  skipped`); break; }
      info(`[${locale}]  revising...`);
      text = await generateVoice(client, model, locale, context, result, text) || text;
    }
  }

  if (!i18n.provider) i18n.provider = { id: "anthropic", model };
  i18n.provider.voices = voices;
  fs.writeFileSync(i18nPath, JSON.stringify(i18n, null, 2), "utf-8");
  info(`wrote ${Object.keys(voices).length} brand voice(s) to i18n.json`);
}
