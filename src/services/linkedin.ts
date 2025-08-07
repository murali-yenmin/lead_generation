// src/services/linkedin.ts

import api from "./api";

export interface PostToLinkedInInput {
  postBody: string;
  imageUrl?: string;
  platform?: string;
}

export async function postToLinkedIn(
  input: PostToLinkedInInput
): Promise<{ success: boolean; postId: string }> {
  try {
    const res = await api.post("/api/n8n/linkedInAIPost", input);
    return { 	
      success: true,
      postId: `https://www.linkedin.com/feed/update/${res?.data[0]?.urn}`,
    };
  } catch (error) {
    console.error("Error calling n8n webhook:", error);
    throw error;
  }
}
