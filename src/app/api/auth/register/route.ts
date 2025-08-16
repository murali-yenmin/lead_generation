import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';


async function sendVerificationEmail({ to, url }: { to: string, url: string }) {
  const subject = 'Verify your email address - AutoPost App';
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background-color: #1d4ed8; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🚀 AutoPost</h1>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px; color: #333333;">
          <p style="font-size: 16px;">Hi there,</p>
          <p style="font-size: 16px; line-height: 1.6;">
            Thanks for registering with <strong>AutoPost</strong>.  
            Please confirm your email address to activate your account and start automating your social media posts.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #1d4ed8; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          
          <p style="font-size: 14px; color: #555;">
            If the button above doesn’t work, copy and paste this link into your browser:  
          </p>
          <p style="font-size: 14px; word-break: break-word; color: #1d4ed8;">
            ${url}
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
  `;

  await sendEmail({ to, subject, html });
}



export async function POST(req: NextRequest) {
  try {
    const { name, email, password, organizationName } = await req.json();

    // 1. Field validation
    if (!name || !email || !password || !organizationName) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Invalid email format.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // 2. Check duplicate email
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
    }

    // 3. Check duplicate organization
    const existingOrg = await db.collection('organizations').findOne({ name: organizationName });
    if (existingOrg) {
      return NextResponse.json({ message: 'Organization name already taken.' }, { status: 409 });
    }

    // 4. Get Admin role
    const adminRole = await db.collection('roles').findOne({ name: 'Admin' });
    if (!adminRole) {
      console.error('Admin role not found in database.');
      return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    // 5. Create organization
    const newOrganization = await db.collection('organizations').insertOne({
      name: organizationName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!newOrganization.acknowledged) {
      return NextResponse.json({ message: 'Failed to create organization.' }, { status: 500 });
    }

    // 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 7. Create user
    const insertedUser = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      organizationId: newOrganization.insertedId,
      roleId: adminRole._id,
      teamId: null,
      status: 'pending', // Set initial status to pending
      verificationToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!insertedUser.acknowledged) {
      // Rollback organization creation if user insert fails
      await db.collection('organizations').deleteOne({ _id: newOrganization.insertedId });
      return NextResponse.json({ message: 'Failed to create user.' }, { status: 500 });
    }

    // 8. Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}`;
    await sendVerificationEmail({ to: email, url: verificationUrl });

    // 9. Success
    return NextResponse.json({
      message: 'User and organization created successfully. Please check your email to verify your account.',
      userId: insertedUser.insertedId,
      organizationId: newOrganization.insertedId,
    }, { status: 201 });

  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
