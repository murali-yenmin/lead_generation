"use server";

/**
 * @fileOverview Email content generation AI agent.
 *
 * - generateEmailContent - A function that handles the email generation process.
 * - EmailGenerationInput - The input type for the generateEmailContent function.
 * - EmailGenerationOutput - The return type for the generateEmailContent function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const EmailGenerationInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      "A prompt describing the purpose, audience, and key points of the email."
    ),
});
export type EmailGenerationInput = z.infer<typeof EmailGenerationInputSchema>;

const EmailGenerationOutputSchema = z.object({
  emailContent: z
    .string()
    .describe("The generated email body content in simple HTML format."),
});
export type EmailGenerationOutput = z.infer<typeof EmailGenerationOutputSchema>;

export async function generateEmailContent(
  input: EmailGenerationInput
): Promise<EmailGenerationOutput> {
  return generateEmailContentFlow(input);
}

const generateEmailPrompt = ai.definePrompt({
  name: "generateEmailPrompt",
  input: { schema: EmailGenerationInputSchema },
  output: { schema: EmailGenerationOutputSchema },
  prompt: `You are an expert email marketing copywriter.

The user will provide a prompt outlining the goal of an email.
You will generate a compelling and professional email body based on this prompt.

**Instructions:**
- The output should be in simple HTML format. Use tags like <p>, <strong>, <em>, <ul>, and <li>.
- Do not include <html>, <head>, or <body> tags. Only generate the content that would go inside the <body>.
- Do NOT include any action buttons, links, or clickable calls-to-action (e.g. no <a> tags, no <button> tags).
- Keep the tone professional and engaging.
- Structure the email logically with a clear introduction, body, and conclusion.

**User Prompt:**
{{{prompt}}}

Generate the output as a JSON object with the key "emailContent".
`,
});

const generateEmailContentFlow = ai.defineFlow(
  {
    name: "generateEmailContentFlow",
    inputSchema: EmailGenerationInputSchema,
    outputSchema: EmailGenerationOutputSchema,
  },
  async (input) => {
    const { output } = await generateEmailPrompt(input);
    return output!;
  }
);
