
'use server';

/**
 * @fileOverview An AI flow that reviews content and then prepares it for posting.
 *
 * - reviewAndPostToLinkedIn - The main function to trigger the review.
 * - ReviewAndPostInput - The input type for the flow.
 * - ReviewAndPostOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ReviewAndPostInputSchema = z.object({
  postContent: z.string().describe('The main text content of the LinkedIn post.'),
  keywords: z.array(z.string()).describe('A list of keywords/hashtags to include.'),
  imageUrl: z.string().optional().describe('An optional image URL to attach to the post.'),
  platform: z.string().describe('The social media platform to post to (e.g., "linkedin", "facebook").'),
});
export type ReviewAndPostInput = z.infer<typeof ReviewAndPostInputSchema>;

const ReviewAndPostOutputSchema = z.object({
  success: z.boolean().describe('Whether the post passed the review.'),
  reviewNotes: z.string().describe('Feedback and notes from the AI reviewer.'),
  postBody: z.string().describe('The final, combined post body including content and hashtags.'),
});
export type ReviewAndPostOutput = z.infer<typeof ReviewAndPostOutputSchema>;


const reviewAndPostPrompt = ai.definePrompt({
    name: 'reviewAndPostPrompt',
    input: { schema: ReviewAndPostInputSchema },
    output: { schema: ReviewAndPostOutputSchema },
    prompt: `You are an expert Social Media Manager acting as a final review agent.
    Your task is to review a post for quality, engagement potential, and brand alignment for the target platform: {{{platform}}}.

    **Review Checklist:**
    1.  **Clarity and Conciseness:** Is the message clear and easy to understand for the {{{platform}}} audience?
    2.  **Engagement:** Does it include a strong hook, valuable information, and a call-to-action or question suitable for {{{platform}}}?
    3.  **Formatting:** Is it well-formatted for {{{platform}}}? (e.g., short paragraphs for LinkedIn, more emojis for Instagram).
    4.  **Professionalism/Tone:** Does the tone align with the {{{platform}}}?

    **User's Post:**
    -   **Content:** {{{postContent}}}
    -   **Keywords:** {{#each keywords}} {{{this}}}{{/each}}
    -   **Image Attached:** {{#if imageUrl}}Yes{{else}}No{{/if}}

    **Your Process:**
    1.  First, provide a brief review of the post based on the checklist. This will be your 'reviewNotes'.
    2.  Next, create the final post body. This is done by taking the original 'postContent' and appending all the 'keywords' (hashtags) at the end. Ensure there are a couple of newlines separating the content from the hashtags for good formatting. This final text goes into the 'postBody' output field.
    3.  If the post is high-quality and ready to publish, set 'success' to true.
    4.  If the post is not suitable, provide constructive feedback in the 'reviewNotes' and set 'success' to false.
    5.  Your final output must conform to the ReviewAndPostOutput schema.
    `,
});

const reviewAndPostFlow = ai.defineFlow(
  {
    name: 'reviewAndPostFlow',
    inputSchema: ReviewAndPostInputSchema,
    outputSchema: ReviewAndPostOutputSchema,
  },
  async (input) => {
    const { output } = await reviewAndPostPrompt(input);
    return output!;
  }
);


export async function reviewAndPostToLinkedIn(input: ReviewAndPostInput): Promise<ReviewAndPostOutput> {
  return reviewAndPostFlow(input);
}
