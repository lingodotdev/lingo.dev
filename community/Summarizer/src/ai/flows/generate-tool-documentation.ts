'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating documentation for a Lingo tool.
 *
 * It includes the following:
 * - `generateToolDocumentation`:  The exported function to generate tool documentation.
 * - `GenerateToolDocumentationInput`: The input type for the `generateToolDocumentation` function.
 * - `GenerateToolDocumentationOutput`: The output type for the `generateToolDocumentation` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateToolDocumentationInputSchema = z.object({
  toolName: z.string().describe('The name of the Lingo tool to document.'),
  toolDescription: z.string().describe('A detailed description of the Lingo tool.'),
  toolFeatures: z.string().describe('A comma-separated list of features offered by the tool.'),
  exampleUsage: z.string().describe('An example of how to use the Lingo tool.'),
});
export type GenerateToolDocumentationInput = z.infer<typeof GenerateToolDocumentationInputSchema>;

const GenerateToolDocumentationOutputSchema = z.object({
  documentation: z.string().describe('The generated documentation for the Lingo tool.'),
});
export type GenerateToolDocumentationOutput = z.infer<typeof GenerateToolDocumentationOutputSchema>;

export async function generateToolDocumentation(
  input: GenerateToolDocumentationInput
): Promise<GenerateToolDocumentationOutput> {
  return generateToolDocumentationFlow(input);
}

const generateToolDocumentationPrompt = ai.definePrompt({
  name: 'generateToolDocumentationPrompt',
  input: {schema: GenerateToolDocumentationInputSchema},
  output: {schema: GenerateToolDocumentationOutputSchema},
  prompt: `You are an AI documentation expert specializing in explaining Lingo tools.

  Generate comprehensive and user-friendly documentation for the Lingo tool based on the provided information. Include clear explanations of its functionality, features, and usage.

  Tool Name: {{{toolName}}}
  Description: {{{toolDescription}}}
  Features: {{{toolFeatures}}}
  Example Usage: {{{exampleUsage}}}

  The documentation should be well-structured, easy to understand, and include examples where appropriate. Focus on providing practical information that helps users quickly grasp the tool's capabilities and how to effectively use it.
  `,
});

const generateToolDocumentationFlow = ai.defineFlow(
  {
    name: 'generateToolDocumentationFlow',
    inputSchema: GenerateToolDocumentationInputSchema,
    outputSchema: GenerateToolDocumentationOutputSchema,
  },
  async input => {
    const {output} = await generateToolDocumentationPrompt(input);
    return output!;
  }
);
