
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = verifyToken(req);
  if (!auth.valid) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const { permissions } = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid role ID' }, { status: 400 });
    }

    if (!Array.isArray(permissions)) {
      return NextResponse.json({ message: 'Permissions must be an array' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const roleToUpdate = await db.collection('roles').findOne({ _id: new ObjectId(id) });
    if (!roleToUpdate) {
        return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }
    // Prevent updating Super Admin role
    if (roleToUpdate.name === 'Super Admin') {
        return NextResponse.json({ message: 'Super Admin permissions cannot be changed' }, { status: 403 });
    }

    const result = await db.collection('roles').updateOne(
      { _id: new ObjectId(id) },
      { $set: { permissions, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    const updatedRole = await db.collection('roles').findOne({ _id: new ObjectId(id) });

    return NextResponse.json(updatedRole, { status: 200 });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
