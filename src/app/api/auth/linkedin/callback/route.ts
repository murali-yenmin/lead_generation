
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import axios from 'axios';

// This is a simple HTML page that will be rendered in the popup.
// It sends a message to the parent window to signal that auth is complete, then closes itself.
const getPopupResponseHtml = (success: boolean) => `
  <!DOCTYPE html>
  <html>
  <head>
    <title>LinkedIn Authentication</title>
    <script>
      window.onload = function() {
        if (window.opener) {
          window.opener.postMessage({ type: 'linkedin-auth-complete', success: ${success} }, '*');
        }
        window.close();
      };
    </script>
  </head>
  <body>
    <p>Authentication complete. You can close this window.</p>
  </body>
  </html>
`;


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // The organizationId we passed
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/linkedin/callback`;

    if (error) {
        console.error(`LinkedIn OAuth Error: ${error} - ${errorDescription}`);
        // Return an HTML response that can close the popup
        return new NextResponse(getPopupResponseHtml(false), { headers: { 'Content-Type': 'text/html' } });
    }

    if (!code || !state || !ObjectId.isValid(state)) {
        console.error('Invalid request: code or state is missing or invalid.');
        return new NextResponse(getPopupResponseHtml(false), { headers: { 'Content-Type': 'text/html' } });
    }

    try {
        // Step 1: Exchange authorization code for an access token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;
        const refreshToken = tokenResponse.data.refresh_token;

        if (!accessToken) {
            throw new Error('Access token not found in LinkedIn response.');
        }

        // Step 2: Get the Organization URN using the access token. This is the primary ID for the company page.
        // We look for organizations where the user is an ADMINISTRATOR.
        const orgAclsResponse = await axios.get(`https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED`, {
            headers: { 
                Authorization: `Bearer ${accessToken}`, 
                'X-Restli-Protocol-Version': '2.0.0', 
                'LinkedIn-Version': '202402' // Use a recent API version
            }
        });

        // The response contains an `organizationalTarget` URN. We'll take the first one.
        const orgUrn = orgAclsResponse.data.elements?.[0]?.organizationalTarget;

        if (!orgUrn) {
            throw new Error("Could not determine user's LinkedIn organization URN. Ensure the user is an admin of a company page.");
        }
        
        // The numeric ID is the last part of the URN (e.g., 'urn:li:organization:12345' -> '12345')
        const linkedInId = orgUrn.split(':').pop();

        if (!linkedInId) {
            throw new Error("Failed to parse LinkedIn ID from URN.");
        }

        // Step 3: Save the access token and LinkedIn ID to the organization in the database
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const organizations = db.collection('organizations');

        const result = await organizations.updateOne(
            { _id: new ObjectId(state) },
            { 
                $set: {
                    'settings.linkedInRefreshToken': refreshToken,
                    'settings.linkedInId': linkedInId,
                    'updatedAt': new Date(),
                },
                 $unset: {
                    'settings.linkedInAccessToken': ''
                }
            }
        );

        if (result.matchedCount === 0) {
            throw new Error('Organization not found in the database.');
        }
        
        // Return success HTML to the popup
        return new NextResponse(getPopupResponseHtml(true), { headers: { 'Content-Type': 'text/html' } });

    } catch (err: any) {
        console.error('Error in LinkedIn callback:', err.response ? err.response.data : err.message);
        // Return failure HTML to the popup
        return new NextResponse(getPopupResponseHtml(false), { headers: { 'Content-Type': 'text/html' } });
    }
}
