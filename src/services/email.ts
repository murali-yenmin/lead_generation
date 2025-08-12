// src/services/email.ts

import api from "./api";

export interface FormValues {
  toRecipients: string[];
  subject: string;
  emailContent: string;
  ccRecipients?: string[];
  bccRecipients?: string[];
  replyToRecipients?: string[];
  senderName?: string;
  replyToSenderOnly?: boolean;
  attachments?: any;
}

export async function emailSenderAll(
  input: FormValues
): Promise<{ success: boolean; messageId: string }> {
  try {
    console.log(input, "input ====")
    const res = await api.post("/api/n8n/emailSender", input);

    return {
      success: true,
      messageId: res?.data?.messageId || "", // Adjust according to your backend response
    };
  } catch (error) {
    console.error("Error calling n8n email webhook:", error);
    throw error;
  }
}
