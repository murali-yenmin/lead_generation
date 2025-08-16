
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// Get a single user by ID
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
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const userPipeline = [
      { $match: { _id: new ObjectId(id) } },
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
          as: 'organizationInfo',
        },
      },
      {
        $unwind: { path: '$roleInfo', preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: {
          path: '$organizationInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          password: 0,
          verificationToken: 0,
          passwordResetToken: 0,
          passwordResetExpires: 0,
        },
      },
    ];

    const users = await db.collection('users').aggregate(userPipeline).toArray();

    if (users.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(users[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
