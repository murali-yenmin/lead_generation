'use server';

/**
 * @fileOverview Social media keyword generation AI agent.
 *
 * - generateSocialMediaKeywords - A function that handles keyword generation for multiple platforms.
 * - SocialMediaKeywordGenerationInput - The input type for the function.
 * - SocialMediaKeywordGenerationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SocialMediaKeywordGenerationInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A text prompt describing the target audience or content topic.'
    ),
  numberOfKeywords: z
    .number()
    .default(10)
    .describe('The number of keywords to generate per platform.'),
});
export type SocialMediaKeywordGenerationInput = z.infer<
  typeof SocialMediaKeywordGenerationInputSchema
>;

const SocialMediaKeywordGenerationOutputSchema = z.object({
  linkedin: z
    .array(z.string())
    .describe('A list of relevant keywords and hashtags for LinkedIn.'),
  instagram: z
    .array(z.string())
    .describe('A list of relevant hashtags for Instagram.'),
  facebook: z
    .array(z.string())
    .describe('A list of relevant keywords and hashtags for Facebook.'),
  twitter: z
    .array(z.string())
    .describe('A list of relevant hashtags for Twitter (X).'),
});
export type SocialMediaKeywordGenerationOutput = z.infer<
  typeof SocialMediaKeywordGenerationOutputSchema
>;

export async function generateSocialMediaKeywords(
  input: SocialMediaKeywordGenerationInput
): Promise<SocialMediaKeywordGenerationOutput> {
  return generateSocialMediaKeywordsFlow(input);
}

const generateKeywordsPrompt = ai.definePrompt({
  name: 'generateSocialMediaKeywordsPrompt',
  input: {schema: SocialMediaKeywordGenerationInputSchema},
  output: {schema: SocialMediaKeywordGenerationOutputSchema},
  prompt: `You are an expert social media marketing strategist.

  The user will provide a text prompt describing their target audience or content.
  You will generate a list of {{numberOfKeywords}} relevant hashtags for each of the following platforms: LinkedIn, Instagram, Facebook, and Twitter (X).

  **IMPORTANT Platform-specific Instructions:**
  - **LinkedIn:** Every item in the list MUST be a professional hashtag and MUST start with a '#' symbol (e.g., "#DigitalMarketing").
  - **Instagram:** Every item in the list MUST be a popular or niche hashtag and MUST start with a '#' symbol. Emojis are acceptable if relevant.
  - **Facebook:** Every item in the list MUST be a community-focused hashtag and MUST start with a '#' symbol.
  - **Twitter (X):** Every item in the list MUST be a trending or conversational hashtag and MUST start with a '#' symbol.

  **User's Prompt:**
  "{{{prompt}}}"

  Generate the output as a single JSON object that strictly follows the output schema, with keys for "linkedin", "instagram", "facebook", and "twitter".
  Do not include any additional text or explanations.
  `,
});

const generateSocialMediaKeywordsFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaKeywordsFlow',
    inputSchema: SocialMediaKeywordGenerationInputSchema,
    outputSchema: SocialMediaKeywordGenerationOutputSchema,
  },
  async input => {
    const {output} = await generateKeywordsPrompt(input);
    return output!;
  }
);
