
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
    const auth = verifyToken(req);
    if (!auth.valid || !auth.decoded || typeof auth.decoded === 'string' || !auth.decoded.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = auth.decoded.id;

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);

        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Fetch role details
        let role = null;
        if (user.roleId) {
            role = await db.collection('roles').findOne({ _id: new ObjectId(user.roleId) });
        }

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

        return NextResponse.json(userResponse, { status: 200 });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
