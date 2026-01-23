'use server';

/**
 * @fileOverview Summarizes a Lingo tool, providing a quick understanding of its purpose and features.
 *
 * - summarizeLingoTool - A function that summarizes a given Lingo tool.
 * - SummarizeLingoToolInput - The input type for the summarizeLingoTool function.
 * - SummarizeLingoToolOutput - The return type for the summarizeLingoTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLingoToolInputSchema = z.object({
  toolDescription: z.string().describe('The detailed description of the Lingo tool.'),
});
export type SummarizeLingoToolInput = z.infer<typeof SummarizeLingoToolInputSchema>;

const SummarizeLingoToolOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the Lingo tool.'),
});
export type SummarizeLingoToolOutput = z.infer<typeof SummarizeLingoToolOutputSchema>;

export async function summarizeLingoTool(input: SummarizeLingoToolInput): Promise<SummarizeLingoToolOutput> {
  return summarizeLingoToolFlow(input);
}

const summarizeLingoToolPrompt = ai.definePrompt({
  name: 'summarizeLingoToolPrompt',
  input: {schema: SummarizeLingoToolInputSchema},
  output: {schema: SummarizeLingoToolOutputSchema},
  prompt: `You are an expert AI tool summarizer. Your goal is to provide a concise and informative summary of a given AI tool.

  Please summarize the following Lingo tool description in a way that quickly conveys its purpose and key features.

  Tool Description: {{{toolDescription}}}
  `,
});

const summarizeLingoToolFlow = ai.defineFlow(
  {
    name: 'summarizeLingoToolFlow',
    inputSchema: SummarizeLingoToolInputSchema,
    outputSchema: SummarizeLingoToolOutputSchema,
  },
  async input => {
    const {output} = await summarizeLingoToolPrompt(input);
    return output!;
  }
);
