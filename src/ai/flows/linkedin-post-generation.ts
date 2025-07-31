
'use server';

/**
 * @fileOverview LinkedIn post generation AI agent.
 *
 * - generateLinkedInPost - A function that handles the post generation process.
 * - LinkedInPostGenerationInput - The input type for the generateLinkedInPost function.
 * - LinkedInPostGenerationOutput - The return type for the generateLinkedInPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LinkedInPostGenerationInputSchema = z.object({
  topic: z.string().describe('The topic for the LinkedIn post.'),
  vibe: z.enum(['professional', 'casual', 'witty', 'inspiring']).default('professional').describe('The desired tone of the post.'),
  postType: z.enum(['article', 'image_post']).default('image_post').describe('The type of post to generate.'),
});
export type LinkedInPostGenerationInput = z.infer<typeof LinkedInPostGenerationInputSchema>;

const LinkedInPostGenerationOutputSchema = z.object({
    post: z.string().describe('The generated LinkedIn post content.'),
    imagePrompt: z.string().describe('A prompt for generating an image relevant to the post.'),
    keywords: z.array(z.string()).describe('A list of 3-5 keywords or hashtags relevant to the post.'),
    imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type LinkedInPostGenerationOutput = z.infer<typeof LinkedInPostGenerationOutputSchema>;

export async function generateLinkedInPost(
  input: LinkedInPostGenerationInput
): Promise<LinkedInPostGenerationOutput> {
  return generateLinkedInPostFlow(input);
}

const generatePostPrompt = ai.definePrompt({
  name: 'generatePostPrompt',
  input: {schema: LinkedInPostGenerationInputSchema},
  output: {schema: z.object({
      post: LinkedInPostGenerationOutputSchema.shape.post,
      imagePrompt: LinkedInPostGenerationOutputSchema.shape.imagePrompt,
      keywords: LinkedInPostGenerationOutputSchema.shape.keywords,
  })},
  prompt: `You are an expert in writing engaging LinkedIn content.

  The user will provide a topic, a desired vibe, and a post type.
  You will generate a compelling LinkedIn post, a prompt for an image that would visually represent the post, and a list of relevant keywords/hashtags.
  
  **IMPORTANT**: The post content itself should NOT contain any hashtags. The hashtags should only be in the separate "keywords" output field.

  **LinkedIn Formatting Guidelines:**
  - Structure the post with short, easy-to-read paragraphs. Use ample line breaks to create white space and improve readability.
  - Incorporate relevant emojis to add visual appeal and break up the text, but do not overdo it.
  - For lists, use standard markdown bullet points (*, -, or +).
  - End with a strong call-to-action or an engaging question to encourage comments and discussion.

  The user has specified the following:
  - Topic: {{{topic}}}
  - Vibe: {{vibe}}
  - Post Type: {{postType}}

  Craft a post that is appropriate for the LinkedIn platform, is engaging, and matches the specified vibe.
  - If the post type is 'article', generate a longer-form post that is informative and well-structured.
  - If the post type is 'image_post', generate a shorter, more concise post that complements a visual. The image prompt should create a square (1:1) image.
  
  The image prompt should be descriptive and suitable for a text-to-image model. For an 'article' post type, the image can be more abstract or conceptual. For an 'image_post', it should be more direct and eye-catching.
  The keywords should be a mix of single words and short phrases that capture the essence of the post, and should include hashtags.

  Output only a JSON object with "post", "imagePrompt", and "keywords" keys.
  `,
});

const generateLinkedInPostFlow = ai.defineFlow(
  {
    name: 'generateLinkedInPostFlow',
    inputSchema: LinkedInPostGenerationInputSchema,
    outputSchema: LinkedInPostGenerationOutputSchema,
  },
  async input => {
    const {output: textOutput} = await generatePostPrompt(input);
    if(!textOutput) {
        throw new Error("Failed to generate post content.");
    }
    
    let imageUrl = '';
    if (input.postType === 'image_post') {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: textOutput.imagePrompt,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });

        if (!media?.url) {
            throw new Error('Image generation failed.');
        }
        imageUrl = media.url;
    }
    
    return {
        ...textOutput,
        imageUrl: imageUrl,
    }
  }
);
