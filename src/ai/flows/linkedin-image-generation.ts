
'use server';

/**
 * @fileOverview An AI flow for generating an image based on LinkedIn post content.
 *
 * - generateImageForPost - A function that handles the image generation.
 * - GenerateImageForPostInput - The input type for the function.
 * - GenerateImageForPostOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageForPostInputSchema = z.object({
  postContent: z.string().describe('The text content of the LinkedIn post to use as a basis for the image prompt.'),
  platform: z.string().describe('The social media platform the image is for (e.g., "linkedin", "instagram").'),
});
export type GenerateImageForPostInput = z.infer<typeof GenerateImageForPostInputSchema>;

const GenerateImageForPostOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageForPostOutput = z.infer<typeof GenerateImageForPostOutputSchema>;


const generateImagePrompt = ai.definePrompt({
    name: 'generateImageForPostPrompt',
    input: { schema: z.object({ imagePrompt: z.string() }) },
    output: { schema: z.object({ imageUrl: z.string() }) },
    prompt: `{{{imagePrompt}}}`,
});

export async function generateImageForPost(input: GenerateImageForPostInput): Promise<GenerateImageForPostOutput> {
  return generateImageForPostFlow(input);
}

const generateImageForPostFlow = ai.defineFlow(
  {
    name: 'generateImageForPostFlow',
    inputSchema: GenerateImageForPostInputSchema,
    outputSchema: GenerateImageForPostOutputSchema,
  },
  async ({ postContent, platform }) => {
    
    // First, create a more descriptive image prompt from the post content.
    const promptCreationResult = await ai.generate({
        prompt: `You are a creative director planning the perfect image for a social media post on ${platform}.
        First, understand the core message and tone of the post content below.
        Then, devise a concept for the best possible image to accompany it.
        Finally, translate that concept into a concise, descriptive, and visually interesting prompt for a text-to-image model.

        **Platform Guidelines:**
        - **linkedin:** Generate a professional, clean image, typically in a 1.91:1 landscape aspect ratio.
        - **instagram:** Generate a vibrant, eye-catching square (1:1) image.
        - **facebook:** Generate a clear, engaging image, often in a 1.91:1 landscape or 1:1 square format.
        - **twitter:** Generate a concise, meme-friendly, or informative image, typically in a 16:9 landscape format.

        **IMPORTANT**: When no specific platform guidelines apply, or for an 'All Platforms' request, create a versatile square (1:1) image.

        Post Content: "${postContent}"`,
        output: {
            format: 'json',
            schema: z.object({ imagePrompt: z.string() })
        }
    });

    const imagePrompt = promptCreationResult.output?.imagePrompt;
    if (!imagePrompt) {
        throw new Error('Failed to generate an image prompt from the post content.');
    }
    
    // Now, generate the image using the created prompt
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: imagePrompt,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });
    
    if (!media?.url) {
        throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);
