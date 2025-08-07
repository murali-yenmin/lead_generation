// app/api/n8n/linkedInAIPost/route.ts
import { NextRequest, NextResponse } from "next/server";
4
const N8N_WEBHOOK_URL = "https://n8n-k70h.onrender.com/webhook/socialMedia";

export async function POST(req: NextRequest) {
  try {
    const rawText = await req.text(); // bypass body size limit
    const payload = JSON.parse(rawText);

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
