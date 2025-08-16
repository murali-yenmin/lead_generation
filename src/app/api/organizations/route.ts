
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  const auth = verifyToken(req);
  if (!auth.valid || !auth.decoded || typeof auth.decoded === 'string' || !auth.decoded.roleId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const userRole = await db.collection('roles').findOne({ _id: new ObjectId(auth.decoded.roleId) });

    const matchStage: any = {};
    if (search) {
      matchStage.name = { $regex: search, $options: 'i' };
    }
    if (status && status !== 'all') {
      matchStage.status = status;
    }
    
    // Super Admins see all, others should only see their own organization.
    if (userRole?.name !== 'Super Admin' && auth.decoded.organizationId) {
        matchStage._id = new ObjectId(auth.decoded.organizationId as string);
    }

    const organizations = await db.collection('organizations').find(matchStage).skip(skip).limit(limit).sort({ createdAt: -1 }).toArray();
    const totalOrganizations = await db.collection('organizations').countDocuments(matchStage);


    return NextResponse.json({ organizations, totalOrganizations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    const auth = verifyToken(req);
    if (!auth.valid || !auth.decoded || typeof auth.decoded === 'string' || !auth.decoded.roleId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const rolesCollection = db.collection('roles');

        const userRole = await rolesCollection.findOne({ _id: new ObjectId(auth.decoded.roleId) });

        if (!userRole) {
             return NextResponse.json({ message: 'Invalid role.' }, { status: 403 });
        }

        const allowedRoles = ['Super Admin', 'Admin'];
        if (!allowedRoles.includes(userRole.name)) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { name, domain } = await req.json();

        if (!name || !domain) {
            return NextResponse.json({ message: 'Organization name and domain are required.' }, { status: 400 });
        }

        const organizations = db.collection('organizations');

        // Check for duplicate organization name
        const existingOrg = await organizations.findOne({ name });
        if (existingOrg) {
            return NextResponse.json({ message: 'An organization with this name already exists.' }, { status: 409 });
        }
        
        const newOrganization = {
            name,
            domain,
            status: 'active', // Default to active
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await organizations.insertOne(newOrganization);

        const createdOrg = await organizations.findOne({ _id: result.insertedId });

        return NextResponse.json(createdOrg, { status: 201 });

    } catch (error) {
        console.error('Error creating organization:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
