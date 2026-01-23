'use server';

/**
 * @fileOverview A flow that suggests relevant Lingo tools based on a user's search query.
 *
 * - suggestRelevantTools - A function that suggests relevant Lingo tools based on the user's query.
 * - SuggestRelevantToolsInput - The input type for the suggestRelevantTools function.
 * - SuggestRelevantToolsOutput - The return type for the suggestRelevantTools function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { tools } from '@/lib/data';

const SuggestRelevantToolsInputSchema = z.object({
  query: z.string().describe('The user search query.'),
});

export type SuggestRelevantToolsInput = z.infer<
  typeof SuggestRelevantToolsInputSchema
>;

const SuggestRelevantToolsOutputSchema = z.object({
  tools: z
    .array(z.string())
    .describe('An array of relevant Lingo tools based on the query.'),
});

export type SuggestRelevantToolsOutput = z.infer<
  typeof SuggestRelevantToolsOutputSchema
>;

export async function suggestRelevantTools(
  input: SuggestRelevantToolsInput
): Promise<SuggestRelevantToolsOutput> {
  return suggestRelevantToolsFlow(input);
}

const SuggestRelevantToolsPromptInputSchema = SuggestRelevantToolsInputSchema.extend({
    toolList: z.string().describe('The list of available tools.'),
});

const prompt = ai.definePrompt({
  name: 'suggestRelevantToolsPrompt',
  input: {schema: SuggestRelevantToolsPromptInputSchema},
  output: {schema: SuggestRelevantToolsOutputSchema},
  prompt: `You are an AI assistant that suggests relevant Lingo tools based on a user's search query.

  The Lingo tools are:
  {{{toolList}}}

  Suggest the most relevant tools based on the user's query. Only return the names of the tools.

  Query: {{{query}}}
  `,
});

const suggestRelevantToolsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantToolsFlow',
    inputSchema: SuggestRelevantToolsInputSchema,
    outputSchema: SuggestRelevantToolsOutputSchema,
  },
  async (input) => {
    const toolList = tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n');
    const {output} = await prompt({...input, toolList});
    return output!;
  }
);
