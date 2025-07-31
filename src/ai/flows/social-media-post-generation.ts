'use server';

/**
 * @fileOverview Social media post generation AI agent.
 *
 * - generateSocialMediaPost - A function that handles the post generation process.
 * - SocialMediaPostGenerationInput - The input type for the function.
 * - SocialMediaPostGenerationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const SocialMediaPostGenerationInputSchema = z.object({
  platform: z.enum(['linkedin', 'instagram', 'facebook', 'twitter']).describe('The social media platform for which to generate the post.'),
  topic: z.string().describe('The topic for the social media post.'),
  vibe: z.enum(['professional', 'casual', 'witty', 'inspiring']).default('professional').describe('The desired tone of the post.'),
});
export type SocialMediaPostGenerationInput = z.infer<typeof SocialMediaPostGenerationInputSchema>;

const SocialMediaPostGenerationOutputSchema = z.object({
    post: z.string().describe('The generated social media post content.'),
    keywords: z.array(z.string()).describe('A list of 3-5 relevant keywords or hashtags for the post.'),
});
export type SocialMediaPostGenerationOutput = z.infer<typeof SocialMediaPostGenerationOutputSchema>;

export async function generateSocialMediaPost(
  input: SocialMediaPostGenerationInput
): Promise<SocialMediaPostGenerationOutput> {
  return generateSocialMediaPostFlow(input);
}

const generatePostPrompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: { schema: SocialMediaPostGenerationInputSchema },
  output: { schema: SocialMediaPostGenerationOutputSchema },
  prompt: `You are an expert in writing engaging social media content tailored for specific platforms.

  The user will provide a topic, a desired vibe, and a target platform.
  You will generate a compelling post and a list of relevant keywords/hashtags.
  
  **IMPORTANT**: The post content itself should NOT contain any hashtags. The hashtags should only be in the separate "keywords" output field.

  **Platform-Specific Formatting Guidelines:**
  - **LinkedIn:** Structure the post with short, professional paragraphs. Use ample line breaks for readability. Use professional emojis sparingly. End with a strong call-to-action or an engaging question. Keywords should be professional hashtags.
  - **Instagram:** Write a visually-driven caption. Use emojis more freely. Ask questions to drive comments. Keywords should be popular and niche hashtags.
  - **Facebook:** Write in a conversational and community-oriented tone. Encourage sharing and reactions. Keywords can be a mix of hashtags and key phrases.
  - **Twitter (X):** Keep the post concise and punchy (under 280 characters). Use relevant hashtags for discoverability. Pose questions or use strong statements to spark conversation.

  **User Input:**
  - **Platform:** {{{platform}}}
  - **Topic:** {{{topic}}}
  - **Vibe:** {{vibe}}

  Craft a post that is appropriate for the specified platform and matches the desired vibe.
  The keywords should be a mix of single words and short phrases that capture the essence of the post, and they MUST include the '#' prefix where appropriate for the platform (e.g., all keywords for Twitter, Instagram, LinkedIn should be hashtags).

  Output only a JSON object with "post" and "keywords" keys.
  `,
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: SocialMediaPostGenerationInputSchema,
    outputSchema: SocialMediaPostGenerationOutputSchema,
  },
  async input => {
    const { output } = await generatePostPrompt(input);
    if (!output) {
      throw new Error("Failed to generate post content.");
    }
    
    return output;
  }
);
