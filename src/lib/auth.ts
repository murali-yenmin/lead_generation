import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface DecodedToken extends JwtPayload {
  roleName?: string;
  organizationId?: string;
}

export function verifyToken(req: NextRequest): {
  valid: boolean;
  decoded?: DecodedToken;
} {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false };
    }

    const token = authHeader.split(' ')[1];
    if (!token) return { valid: false };

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return { valid: true, decoded };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return { valid: false };
  }
}
