
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
    
    const userRole = await db.collection('roles').findOne({ _id: new ObjectId(auth.decoded.roleId) });

    if (!userRole || userRole.name !== 'Super Admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { status } = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid organization ID' },
        { status: 400 }
      );
    }

    if (status !== 'active' && status !== 'deactivated') {
      return NextResponse.json(
        { message: 'Invalid status value' },
        { status: 400 }
      );
    }

    const result = await db
      .collection('organizations')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: status, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Organization not found' },
        { status: 404 }
      );
    }

    // Deactivate/reactivate all users in the organization
    await db
      .collection('users')
      .updateMany(
        { organizationId: new ObjectId(id) },
        { $set: { status: status } }
      );

    const updatedOrg = await db
      .collection('organizations')
      .findOne({ _id: new ObjectId(id) });

    return NextResponse.json(updatedOrg, { status: 200 });
  } catch (error) {
    console.error('Error updating organization status:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
