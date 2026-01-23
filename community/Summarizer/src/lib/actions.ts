'use server';

import { answerToolQuery } from '@/ai/flows/answer-tool-queries';
import { generateToolDocumentation, type GenerateToolDocumentationInput } from '@/ai/flows/generate-tool-documentation';
import { suggestRelevantTools } from '@/ai/flows/suggest-relevant-tools';
import { summarizeLingoTool } from '@/ai/flows/summarize-lingo-tool';
import { summarizeTopic, type SummarizeTopicInput } from '@/ai/flows/summarize-topic';
import { z } from 'zod';

const docSchema = z.object({
  toolName: z.string().min(2, 'Tool name must be at least 2 characters.'),
  toolDescription: z.string().min(10, 'Description must be at least 10 characters.'),
  toolFeatures: z.string().min(5, 'Features must be at least 5 characters.'),
  exampleUsage: z.string().min(10, 'Example usage must be at least 10 characters.'),
});

export async function generateDocsAction(data: GenerateToolDocumentationInput) {
  try {
    const validatedData = docSchema.parse(data);
    const { documentation } = await generateToolDocumentation(validatedData);
    return { success: true, documentation };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to generate documentation.' };
  }
}

export async function summarizeToolAction(description: string) {
  try {
    const { summary } = await summarizeLingoTool({ toolDescription: description });
    return { success: true, summary };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate summary.' };
  }
}

export async function suggestToolsAction(query: string) {
  try {
    const { tools } = await suggestRelevantTools({ query });
    return { success: true, tools };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to suggest tools.' };
  }
}

export async function answerQueryAction(query: string, history: { role: 'user' | 'model', content: string }[]) {
  // Note: The current answerToolQuery flow doesn't support history.
  // This is a placeholder for future enhancement.
  try {
    const { answer } = await answerToolQuery({ query });
    return { success: true, answer };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get an answer from the assistant.' };
  }
}

const summarySchema = z.object({
  textToSummarize: z.string().min(20, 'Text must be at least 20 characters.'),
});

export async function summarizeTopicAction(data: SummarizeTopicInput) {
  try {
    const validatedData = summarySchema.parse(data);
    const { summary } = await summarizeTopic(validatedData);
    return { success: true, summary };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to generate summary.' };
  }
}
