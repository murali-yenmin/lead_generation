
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login?error=Verification token is missing.', req.url));
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection('users');

    const user = await users.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?error=Invalid verification token.', req.url));
    }
    
    // If user is already active and just verifying again, let them proceed to reset password.
    if (user.status !== 'active') {
        // Token is valid, update user status to 'active' but leave token for password setup
        await users.updateOne(
          { _id: user._id },
          {
            $set: { status: 'active' },
          }
        );
    }
    
    // Redirect to the password setup page with the token
    return NextResponse.redirect(new URL(`/auth/reset-password?token=${token}`, req.url));

  } catch (error) {
    console.error('Verification API error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=An error occurred during verification.', req.url));
  }
}
