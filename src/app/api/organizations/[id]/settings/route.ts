
'use server';

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = verifyToken(req);
  if (!auth.valid || !auth.decoded || typeof auth.decoded === 'string' || !auth.decoded.roleId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Optional: Add role-based check to ensure only Admins can edit settings
    const userRole = await db.collection('roles').findOne({ _id: new ObjectId(auth.decoded.roleId) });
    if (!userRole || !['Super Admin', 'Admin'].includes(userRole.name)) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    const { settings } = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid organization ID' },
        { status: 400 }
      );
    }

    if (!settings) {
      return NextResponse.json(
        { message: 'Settings object is required' },
        { status: 400 }
      );
    }
    
    // Sanitize settings here if necessary
    const updateData: { [key: string]: any } = {};
    if (typeof settings.socialMediaUrl !== 'undefined') {
        updateData['settings.socialMediaUrl'] = settings.socialMediaUrl;
    }
    if (typeof settings.emailUrl !== 'undefined') {
        updateData['settings.emailUrl'] = settings.emailUrl;
    }
    
    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: 'No valid settings to update.' }, { status: 400 });
    }
    
    const result = await db
      .collection('organizations')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Organization not found' },
        { status: 404 }
      );
    }

    const updatedOrg = await db
      .collection('organizations')
      .findOne({ _id: new ObjectId(id) });

    return NextResponse.json(updatedOrg, { status: 200 });
  } catch (error) {
    console.error('Error updating organization settings:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
