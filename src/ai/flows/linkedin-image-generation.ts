"use server";

/**
 * @fileOverview An AI flow for generating an image based on LinkedIn/other platform post content.
 *
 * - generateImageForPost - A function that handles the image generation.
 * - GenerateImageForPostInput - The input type for the function.
 * - GenerateImageForPostOutput - The return type for the function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import sharp from "sharp";

const GenerateImageForPostInputSchema = z.object({
  postContent: z
    .string()
    .describe(
      "The text content of the social media post to use as a basis for the image prompt."
    ),
  platform: z
    .string()
    .describe(
      'The social media platform the image is for (e.g., "linkedin", "instagram", "facebook", "twitter").'
    ),
});
export type GenerateImageForPostInput = z.infer<
  typeof GenerateImageForPostInputSchema
>;

const GenerateImageForPostOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated image."),
});
export type GenerateImageForPostOutput = z.infer<
  typeof GenerateImageForPostOutputSchema
>;

// ✅ Define platform-specific configs
const platformConfig: Record<string, { aspect: string; style: string }> = {
  linkedin: {
    aspect: "1080x1080",
    style: "professional, clean, corporate, minimal",
  },
  instagram: {
    aspect: "1080x1080",
    style: "vibrant, eye-catching, colorful, trendy",
  },
  facebook: { aspect: "1080x1080", style: "clear, engaging, bold" },
  twitter: {
    aspect: "1080x1080",
    style: "informative, meme-friendly, concise",
  },
  default: {
    aspect: "1080x1080",
    style: "versatile, general-purpose, adaptable",
  },
};

// ✅ Fix image dimensions after generation
async function validateAndFixImage(
  imageUrl: string,
  targetAspect: string
): Promise<string> {
  const [w, h] = targetAspect.split("x").map(Number);

  const buffer = await fetch(imageUrl).then((res) => res.arrayBuffer());

  const fixedImage = await sharp(Buffer.from(buffer))
    .resize(w, h, { fit: "cover" }) // crop/pad to fit
    .toBuffer();

  return `data:image/png;base64,${fixedImage.toString("base64")}`;
}

export async function generateImageForPost(
  input: GenerateImageForPostInput
): Promise<GenerateImageForPostOutput> {
  return generateImageForPostFlow(input);
}

const generateImageForPostFlow = ai.defineFlow(
  {
    name: "generateImageForPostFlow",
    inputSchema: GenerateImageForPostInputSchema,
    outputSchema: GenerateImageForPostOutputSchema,
  },
  async ({ postContent, platform }) => {
    const { aspect, style } =
      platformConfig[platform.toLowerCase()] || platformConfig.default;

    // Step 1: Generate a refined prompt
    const promptCreationResult = await ai.generate({
      prompt: `You are a creative director planning the perfect image for a ${platform} post.
Understand the post content below, then design the best image concept.

Platform: ${platform}
Aspect ratio: ${aspect}
Style: ${style}

Post Content: "${postContent}"

Respond ONLY with a concise prompt suitable for a text-to-image model.`,
      output: {
        format: "json",
        schema: z.object({ imagePrompt: z.string() }),
      },
    });

    const imagePrompt = promptCreationResult.output?.imagePrompt;
    if (!imagePrompt) {
      throw new Error(
        "❌ Failed to generate an image prompt from the post content."
      );
    }

    // Step 2: Generate the image
    const { media } = await ai.generate({
      model: "googleai/gemini-2.0-flash-preview-image-generation",
      prompt: `${imagePrompt}. Ensure aspect ratio ${aspect} and style: ${style}.`,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    if (!media?.url) {
      throw new Error("❌ Image generation failed.");
    }

    // Step 3: Validate & fix image dimensions
    const fixedImageUrl = await validateAndFixImage(media.url, aspect);

    return { imageUrl: fixedImageUrl };
  }
);
