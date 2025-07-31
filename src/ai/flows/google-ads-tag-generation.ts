"use server";

/**
 * @fileOverview Google Ads tag/keyword generation AI agent.
 *
 * - generateGoogleAdsTags - A function that handles the tag generation process.
 * - GoogleAdsTagGenerationInput - The input type for the generateGoogleAdsTags function.
 * - GoogleAdsTagGenerationOutput - The return type for the generateGoogleAdsTags function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GoogleAdsTagGenerationInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      "A description of the product, service, or campaign for which to generate keywords."
    ),
  numberOfTags: z
    .number()
    .default(15)
    .describe("The number of tags/keywords to generate."),
});
export type GoogleAdsTagGenerationInput = z.infer<
  typeof GoogleAdsTagGenerationInputSchema
>;

const GoogleAdsTagGenerationOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe("A list of relevant keywords/tags for a Google Ads campaign."),
});
export type GoogleAdsTagGenerationOutput = z.infer<
  typeof GoogleAdsTagGenerationOutputSchema
>;

export async function generateGoogleAdsTags(
  input: GoogleAdsTagGenerationInput
): Promise<GoogleAdsTagGenerationOutput> {
  return generateGoogleAdsTagsFlow(input);
}

const generateTagsPrompt = ai.definePrompt({
  name: "generateGoogleAdsTagsPrompt",
  input: { schema: GoogleAdsTagGenerationInputSchema },
  output: { schema: GoogleAdsTagGenerationOutputSchema },
  prompt: `You are an expert in Google Ads campaign management and keyword research.

  The user will provide a text prompt describing their product, service, or marketing goal.
  You will generate a list of {{numberOfTags}} highly relevant keywords and phrases (tags) suitable for a Google Ads campaign.

  **IMPORTANT Instructions:**
  - The output must be plain text keywords only.
  - Do NOT include any special characters or formatting. 
  - Do not include keyword match type symbols like "" or [].
  - Give proper Keyword format also

  **User's Prompt:**
  {{{prompt}}}

  Generate the output as a JSON object with the key "tags".
  Do not include any additional text or explanations.
  `,
});

const generateGoogleAdsTagsFlow = ai.defineFlow(
  {
    name: "generateGoogleAdsTagsFlow",
    inputSchema: GoogleAdsTagGenerationInputSchema,
    outputSchema: GoogleAdsTagGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await generateTagsPrompt(input);
    return output!;
  }
);
