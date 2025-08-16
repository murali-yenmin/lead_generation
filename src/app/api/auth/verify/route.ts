import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?error=Verification token is missing.`);
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection('users');

    const user = await users.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?error=Invalid verification token.`);
    }

    // Token is valid, update user status to 'active' and remove the token
    await users.updateOne(
      { _id: user._id },
      {
        $set: { status: 'active' },
        $unset: { verificationToken: "" },
      }
    );
    
    // Redirect to login page with a success message
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?verified=true`);

  } catch (error) {
    console.error('Verification API error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?error=An error occurred during verification.`);
  }
}
