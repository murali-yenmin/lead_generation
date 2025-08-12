// app/api/n8n/linkedInAIPost/route.ts
import { NextRequest, NextResponse } from "next/server";
const N8N_WEBHOOK_URL = `${process.env.WEBHOOK_URL}/YenminSocialMedia`;

export async function POST(req: NextRequest) {
  try {
    const rawText = await req.text(); 
    const payload = JSON.parse(rawText);

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST", 
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const resText = await res.text();
    let data;
    try {
      data = JSON.parse(resText);
    } catch {
      data = { message: resText || "No response body" };
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
