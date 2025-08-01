import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = `${process.env.WEBHOOK_URL}/YenminSocialMedia`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }
 

    // Forward the request to the n8n webhook using native fetch
    const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      body: JSON.stringify(body),
    });

    const responseData = await webhookResponse.json();

    // Return the response from the n8n webhook to the client
    return NextResponse.json(responseData, { status: webhookResponse.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
