
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the user
    const auth = verifyToken(req);
    if (!auth.valid || !auth.decoded || typeof auth.decoded === 'string') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { organizationId } = auth.decoded;

    if (!organizationId) {
        return NextResponse.json({ message: 'User is not associated with an organization.' }, { status: 400 });
    }

    // 2. Fetch organization settings
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const organization = await db.collection('organizations').findOne({ _id: new ObjectId(organizationId as string) });

    if (!organization) {
        return NextResponse.json({ message: 'Organization not found.' }, { status: 404 });
    }

    const webhookPath = organization.settings?.socialMediaUrl;

    if (!webhookPath) {
        return NextResponse.json({ message: 'Social media webhook path is not configured for this organization.' }, { status: 400 });
    }

    // 3. Construct dynamic webhook URL
    const N8N_WEBHOOK_URL = `${process.env.WEBHOOK_URL}/${webhookPath}`;

    // 4. Forward the request
    const payload = await req.json();

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST", 
      headers: {
        // 'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("n8n webhook error:", err);
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
