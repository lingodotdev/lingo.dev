'use server';

/**
 * @fileOverview An AI assistant to answer questions about Lingo tools.
 *
 * - answerToolQuery - A function that answers user queries about Lingo tools.
 * - AnswerToolQueryInput - The input type for the answerToolQuery function.
 * - AnswerToolQueryOutput - The return type for the answerToolQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { tools } from '@/lib/data';

const AnswerToolQueryInputSchema = z.object({
  query: z.string().describe('The question about Lingo tools.'),
});
export type AnswerToolQueryInput = z.infer<typeof AnswerToolQueryInputSchema>;

const AnswerToolQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about Lingo tools.'),
});
export type AnswerToolQueryOutput = z.infer<typeof AnswerToolQueryOutputSchema>;

export async function answerToolQuery(input: AnswerToolQueryInput): Promise<AnswerToolQueryOutput> {
  return answerToolQueryFlow(input);
}

const AnswerToolQueryPromptInputSchema = AnswerToolQueryInputSchema.extend({
    toolList: z.string().describe('The list of available tools with their descriptions.'),
});

const prompt = ai.definePrompt({
  name: 'answerToolQueryPrompt',
  input: {schema: AnswerToolQueryPromptInputSchema},
  output: {schema: AnswerToolQueryOutputSchema},
  prompt: `You are a custom AI assistant that answers questions about the LingoForge application and its tools.
  You are helpful and friendly.
  
  Use the following information about the available tools to answer the user's question.
  
  Available Tools:
  {{{toolList}}}
  
  Keep your answers concise and to the point.
  
  Question: {{{query}}}`,
});

const answerToolQueryFlow = ai.defineFlow(
  {
    name: 'answerToolQueryFlow',
    inputSchema: AnswerToolQueryInputSchema,
    outputSchema: AnswerToolQueryOutputSchema,
  },
  async (input) => {
    const toolList = tools.map(tool => `- ${tool.name}: ${tool.description}`).join('\n');
    const {output} = await prompt({...input, toolList});
    return output!;
  }
);
