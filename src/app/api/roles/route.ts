
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth.valid) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const roles = await db.collection('roles').find({}).sort({ level: -1 }).toArray();

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
