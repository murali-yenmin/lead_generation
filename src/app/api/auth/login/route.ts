// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }
    
    if (user.status !== 'active') {
        return NextResponse.json({ message: 'Account not activated. Please check your email to verify your account.' }, { status: 403 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set.');
    }

    // Fetch role details
    let role = null;
    if (user.roleId) {
        role = await db.collection('roles').findOne({ _id: new ObjectId(user.roleId) });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        roleId: user.roleId,
        organizationId: user.organizationId,
        teamId: user.teamId
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        organizationId: user.organizationId,
        teamId: user.teamId,
        image: user.image || null,
        roleName: role ? role.name : 'N/A',
        permissions: role ? role.permissions : []
    };

    return NextResponse.json({
      message: 'Login successful',
      token,
      expiresIn: '30d',
      user: userResponse,
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
