"use server";

/**
 * @fileOverview Google Ads display ad image generation AI agent.
 *
 * - generateGoogleAdsImage - A function that handles the image generation process.
 * - GoogleAdsImageGenerationInput - The input type for the generateGoogleAdsImage function.
 * - GoogleAdsImageGenerationOutput - The return type for the generateGoogleAdsImage function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GoogleAdsImageGenerationInputSchema = z.object({
  prompt: z
    .string()
    .describe("A detailed prompt to generate an image for a display ad."),
});
export type GoogleAdsImageGenerationInput = z.infer<
  typeof GoogleAdsImageGenerationInputSchema
>;

const GoogleAdsImageGenerationOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated image."),
});
export type GoogleAdsImageGenerationOutput = z.infer<
  typeof GoogleAdsImageGenerationOutputSchema
>;

export async function generateGoogleAdsImage(
  input: GoogleAdsImageGenerationInput
): Promise<GoogleAdsImageGenerationOutput> {
  return generateGoogleAdsImageFlow(input);
}

const generateGoogleAdsImageFlow = ai.defineFlow(
  {
    name: "generateGoogleAdsImageFlow",
    inputSchema: GoogleAdsImageGenerationInputSchema,
    outputSchema: GoogleAdsImageGenerationOutputSchema,
  },
  async ({ prompt }) => {
    const { media } = await ai.generate({
      model: "googleai/gemini-2.0-flash-preview-image-generation",
      prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    if (!media?.url) {
      throw new Error("Image generation failed.");
    }

    return { imageUrl: media.url };
  }
);
