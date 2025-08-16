
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = verifyToken(req);
  if (!auth.valid) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const { status } = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    if (status !== 'active' && status !== 'deactivated') {
      return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const userToUpdate = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!userToUpdate) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // You might want to add role-based checks here.
    // For example, prevent deactivating the Super Admin.
    const role = await db.collection('roles').findOne({ _id: userToUpdate.roleId });
    if (role && role.name === 'Super Admin') {
        return NextResponse.json({ message: 'Cannot change the status of a Super Admin account.' }, { status: 403 });
    }


    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(id) });

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
