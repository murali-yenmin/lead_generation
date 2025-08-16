import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// ✅ Reusable email sender using Gmail SMTP
// ✅ Reusable email sender using Gmail SMTP with branded template
async function sendPasswordResetEmail({ to, url }: { to: string; url: string }) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Auto Post" <${process.env.EMAIL_ADDRESS}>`,
      to,
      subject: 'Reset Your Password - AutoPost',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background-color: #1d4ed8; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🔐 AutoPost</h1>
            </div>
            
            <!-- Body -->
            <div style="padding: 30px; color: #333333;">
              <p style="font-size: 16px;">Hello,</p>
              <p style="font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your <strong>AutoPost</strong> account.  
                Click the button below to set up a new password. This link is valid for <strong>1 hour</strong>.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background-color: #1d4ed8; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              
              <p style="font-size: 14px; color: #555;">
                If the button above doesn’t work, copy and paste this link into your browser:
              </p>
              <p style="font-size: 14px; word-break: break-word; color: #1d4ed8;">
                ${url}
              </p>
              
              <p style="font-size: 14px; color: #999;">
                If you did not request this, you can safely ignore this email.  
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p>© ${new Date().getFullYear()} AutoPost. All rights reserved.</p>
              <p>
                <a href="#" style="color: #1d4ed8; text-decoration: none;">Privacy Policy</a> | 
                <a href="#" style="color: #1d4ed8; text-decoration: none;">Support</a>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send password reset email to ${to}:`, error);
    throw new Error('Email sending failed');
  }
}


export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: 'Email address is required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection('users');

    const user = await users.findOne({ email });

    // Do not reveal if user exists
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            passwordResetToken,
            passwordResetExpires,
          },
        }
      );

      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;
      await sendPasswordResetEmail({ to: email, url: resetUrl });
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot Password API error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
