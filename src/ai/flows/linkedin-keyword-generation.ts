// Implemented the Genkit flow for generating LinkedIn keywords from a text prompt.

"use server";

/**
 * @fileOverview LinkedIn keyword generation AI agent.
 *
 * - generateLinkedInKeywords - A function that handles the keyword generation process.
 * - LinkedInKeywordGenerationInput - The input type for the generateLinkedInKeywords function.
 * - LinkedInKeywordGenerationOutput - The return type for the generateLinkedInKeywords function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const LinkedInKeywordGenerationInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      "A text prompt describing the LinkedIn target audience or content."
    ),
  includeHashtags: z
    .boolean()
    .describe("Whether to include hashtags in the generated keywords."),
  numberOfKeywords: z
    .number()
    .min(10, { message: "Minimum of 10 keywords required." })
    .max(25, { message: "Maximum of 25 keywords allowed." }) // Adjust this based on realistic usage
    .default(10)
    .describe("The number of keywords to generate.")
    .optional(),
});
export type LinkedInKeywordGenerationInput = z.infer<
  typeof LinkedInKeywordGenerationInputSchema
>;

const LinkedInKeywordGenerationOutputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe("A list of relevant keywords for LinkedIn."),
});
export type LinkedInKeywordGenerationOutput = z.infer<
  typeof LinkedInKeywordGenerationOutputSchema
>;

export async function generateLinkedInKeywords(
  input: LinkedInKeywordGenerationInput
): Promise<LinkedInKeywordGenerationOutput> {
  return generateLinkedInKeywordsFlow(input);
}

const generateKeywordsPrompt = ai.definePrompt({
  name: "generateKeywordsPrompt",
  input: { schema: LinkedInKeywordGenerationInputSchema },
  output: { schema: LinkedInKeywordGenerationOutputSchema },
  prompt: `You are a LinkedIn optimization expert focused on generating high-impact, industry-relevant keywords.

The user will provide a text prompt describing their target audience or content.

Your task:
- Generate a list of {{numberOfKeywords}} highly relevant LinkedIn keywords.
- Base your keyword choices on current professional networking and content trends.
- If "include hashtags" is true, prepend each keyword with "#".
- All keywords must align with professional relevance and current market usage on LinkedIn.

Here's the user's prompt: {{{prompt}}}

Include hashtags: {{includeHashtags}}

Output as a JSON array of strings only. Do not add explanations or commentary.`,
});

const generateLinkedInKeywordsFlow = ai.defineFlow(
  {
    name: "generateLinkedInKeywordsFlow",
    inputSchema: LinkedInKeywordGenerationInputSchema,
    outputSchema: LinkedInKeywordGenerationOutputSchema,
  },
  async (input) => {
    const keywordCount = input.numberOfKeywords ?? 10;
    const boundedKeywordCount = Math.min(Math.max(keywordCount, 10), 25);

    const { output } = await generateKeywordsPrompt({
      ...input,
      numberOfKeywords: boundedKeywordCount,
    });

    return output!;
  }
);
