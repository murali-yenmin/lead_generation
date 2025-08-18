
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and password are required.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection('users');
    
    let user: any;

    // First, try finding a user from the "forgot password" flow, which uses a hashed token.
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    user = await users.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });
    
    if (user) {
        // This is a "forgot password" request
        const hashedPassword = await bcrypt.hash(password, 10);
        await users.updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { passwordResetToken: "", passwordResetExpires: "" },
            }
        );

        return NextResponse.json({ message: 'Password has been reset successfully.' }, { status: 200 });
    }
    
    // If not found, try finding a user from the "new user invitation" flow, which uses a plain token.
    user = await users.findOne({ verificationToken: token });

    if (user) {
        // This is a new user setting their password for the first time
        if (user.status !== 'active') {
             return NextResponse.json({ message: 'Account not verified. Please verify your email first.' }, { status: 400 });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await users.updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { verificationToken: "" },
            }
        );

        return NextResponse.json({ message: 'Password has been set successfully.' }, { status: 200 });
    }

    // If no user is found by either method, the token is invalid.
    return NextResponse.json({ message: 'Password reset token is invalid or has expired.' }, { status: 400 });

  } catch (error) {
    console.error('Reset Password API error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
