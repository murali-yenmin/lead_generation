
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = verifyToken(req);
  if (!auth.valid) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid organization ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // 1. Fetch organization details
    const organization = await db
      .collection('organizations')
      .findOne({ _id: new ObjectId(id) });

    if (!organization) {
      return NextResponse.json(
        { message: 'Organization not found' },
        { status: 404 }
      );
    }
    
    // 2. Fetch users belonging to the organization
    const users = await db.collection('users').find({ organizationId: new ObjectId(id) }).project({ password: 0 }).toArray();

    // 3. Return combined data
    const responseData = {
        ...organization,
        users: users
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
