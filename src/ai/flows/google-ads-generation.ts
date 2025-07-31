'use server';

/**
 * @fileOverview Google Ads text ad generation AI agent.
 *
 * - generateGoogleAdsText - A function that handles the ad generation process.
 * - GoogleAdsGenerationInput - The input type for the generateGoogleAdsText function.
 * - GoogleAdsGenerationOutput - The return type for the generateGoogleAdsText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GoogleAdsGenerationInputSchema = z.object({
    productDescription: z.string().describe('A description of the product or service being advertised.'),
    targetAudience: z.string().describe('A description of the target audience.'),
    keywords: z.string().describe('A comma-separated list of keywords to target.'),
    brandName: z.string().optional().describe('The name of the brand or product to feature.'),
    callToAction: z.string().optional().describe('A specific call-to-action (e.g., "Sign Up Free", "Shop Now").'),
    promotions: z.string().optional().describe('Any special promotions or offers to include (e.g., "20% Off", "Free Shipping").'),
});
export type GoogleAdsGenerationInput = z.infer<typeof GoogleAdsGenerationInputSchema>;

const GoogleAdsGenerationOutputSchema = z.object({
    adVariations: z.array(z.object({
        headlines: z.array(z.string()).describe('A list of 3-5 compelling headlines (max 30 characters each).'),
        descriptions: z.array(z.string()).describe('A list of 2-3 detailed descriptions (max 90 characters each).'),
    })).describe('A list of 2-3 complete ad variations.'),
});
export type GoogleAdsGenerationOutput = z.infer<typeof GoogleAdsGenerationOutputSchema>;

export async function generateGoogleAdsText(
  input: GoogleAdsGenerationInput
): Promise<GoogleAdsGenerationOutput> {
  return generateGoogleAdsTextFlow(input);
}

const generateAdsPrompt = ai.definePrompt({
  name: 'generateAdsPrompt',
  input: {schema: GoogleAdsGenerationInputSchema},
  output: {schema: GoogleAdsGenerationOutputSchema},
  prompt: `You are an expert in Google Ads copywriting.

  The user will provide product details, and you will generate 2-3 compelling ad variations for a Google Search campaign.

  **Ad Copy Requirements:**
  - **Headlines:** Generate 3 to 5 headlines for each ad variation. Each headline must be a maximum of 30 characters.
  - **Descriptions:** Generate 2 to 3 descriptions for each ad variation. Each description must be a maximum of 90 characters.
  - **Relevance:** Ensure the ad copy is highly relevant to the provided keywords, product description, and target audience.
  - **Brand:** If a brand name is provided, incorporate it naturally.
  - **Call-to-Action (CTA):** Include a strong call-to-action. If a specific CTA is provided, prioritize using it.
  - **Promotions:** If any promotions are mentioned, highlight them in the ad copy.

  **User Input:**
  - **Product/Service Description:** {{{productDescription}}}
  - **Target Audience:** {{{targetAudience}}}
  - **Keywords:** {{{keywords}}}
  - **Brand/Product Name:** {{#if brandName}}{{{brandName}}}{{else}}Not provided{{/if}}
  - **Specific CTA:** {{#if callToAction}}{{{callToAction}}}{{else}}Not provided{{/if}}
  - **Promotions/Offers:** {{#if promotions}}{{{promotions}}}{{else}}Not provided{{/if}}

  Generate the output as a JSON object that strictly follows the provided output schema. Do not include any additional text or explanations.
  `,
});

const generateGoogleAdsTextFlow = ai.defineFlow(
  {
    name: 'generateGoogleAdsTextFlow',
    inputSchema: GoogleAdsGenerationInputSchema,
    outputSchema: GoogleAdsGenerationOutputSchema,
  },
  async input => {
    const {output} = await generateAdsPrompt(input);
    return output!;
  }
);
