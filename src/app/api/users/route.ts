

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';


 async function sendInvitationEmail({ to, url }: { to: string; url: string }) {
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
      subject: 'You’re Invited to Join AutoPost 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <div style="background-color: #1d4ed8; padding: 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">👋 Welcome to AutoPost</h1>
            </div>
            
            <!-- Body -->
            <div style="padding: 30px; color: #333333;">
              <p style="font-size: 16px;">Hello,</p>
              <p style="font-size: 16px; line-height: 1.6;">
                You’ve been invited to join <strong>AutoPost</strong>, the platform to automate and manage your social media posts.  
              </p>

              <p style="font-size: 16px; line-height: 1.6;">
                To set up your account, please click the button below:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background-color: #1d4ed8; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
                  Accept Invitation
                </a>
              </div>
              
              <p style="font-size: 14px; color: #555;">
                If the button above doesn’t work, copy and paste this link into your browser:
              </p>
              <p style="font-size: 14px; word-break: break-word; color: #1d4ed8;">
                ${url}
              </p>
              
              <p style="font-size: 14px; color: #999;">
                This invitation is unique to you. If you weren’t expecting this, you can safely ignore it.  
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
    console.log(`✅ Invitation email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send invitation email to ${to}:`, error);
    throw new Error('Email sending failed');
  }
}

export async function POST(req: NextRequest) {
    const auth = verifyToken(req);
    if (!auth.valid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, email, organizationId, roleId, teamId } = await req.json();

        // 1. Validation
        if (!name || !email || !organizationId || !roleId) {
            return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        // 2. Check for duplicate email
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'A user with this email already exists.' }, { status: 409 });
        }

        // 3. Generate a temporary password and a verification/setup token
        const temporaryPassword = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        // 4. Create user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            organizationId: new ObjectId(organizationId),
            roleId: new ObjectId(roleId),
            teamId: teamId ? new ObjectId(teamId) : null,
            status: 'pending',
            verificationToken,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('users').insertOne(newUser);
        
        // 5. Send invitation email
        const setupUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${verificationToken}`;
        await sendInvitationEmail({ to: email, url: setupUrl });

        return NextResponse.json({ message: 'User created successfully and invitation sent.', userId: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth.valid) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const organizationId = searchParams.get('organizationId');
  const search = searchParams.get('search');
  const role = searchParams.get('role');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const matchStage: any = {};
    
    if (organizationId) {
        if (!ObjectId.isValid(organizationId)) {
            return NextResponse.json({ message: 'Invalid organization ID' }, { status: 400 });
        }
        matchStage.organizationId = new ObjectId(organizationId);
    }

    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'all') {
      matchStage.status = status;
    }

    const rolesCollection = db.collection('roles');
    if (role && role !== 'all') {
      const roleDoc = await rolesCollection.findOne({ name: role });
      if (roleDoc) {
        matchStage.roleId = roleDoc._id;
      } else {
        return NextResponse.json({ users: [], totalUsers: 0 }, { status: 200 });
      }
    }

    const usersPipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'roles',
          localField: 'roleId',
          foreignField: '_id',
          as: 'roleInfo',
        },
      },
      {
        $lookup: {
            from: 'organizations',
            localField: 'organizationId',
            foreignField: '_id',
            as: 'organizationInfo'
        }
      },
      {
        $unwind: {
          path: '$roleInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
            path: '$organizationInfo',
            preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          status: 1,
          createdAt: 1,
          roleName: '$roleInfo.name',
          organizationName: '$organizationInfo.name',
          image: '$image'
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];
    
    const users = await db.collection('users').aggregate(usersPipeline).toArray();
    const totalUsers = await db.collection('users').countDocuments(matchStage);

    return NextResponse.json({ users, totalUsers }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

    