import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_URL = "https://n8n.yenmin.in/webhook-test/emailSender";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    console.log(payload,"payload ++")

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST", 
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return NextResponse.json({ error: await res.text() }, { status: res.status });
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
