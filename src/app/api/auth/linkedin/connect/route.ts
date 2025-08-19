
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
    const auth = verifyToken(req);
    if (!auth.valid || !auth.decoded || typeof auth.decoded === 'string' || !auth.decoded.organizationId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = auth.decoded.organizationId;
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/linkedin/callback`;

    // The 'state' parameter is crucial for security to prevent CSRF attacks.
    // It should be a unique, unguessable string that you verify on callback.
    // Here, we'll use the organizationId as a simple state. In a production app,
    // you might generate a more complex, temporary state token.
    const state = new ObjectId(organizationId as string).toString();

    // Permissions your app is requesting
    const scope = 'r_organization_social w_organization_social r_organization_reports';

    const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;

    return NextResponse.redirect(authorizationUrl);
}
