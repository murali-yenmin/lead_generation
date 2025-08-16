// src/models/role.ts
import { ObjectId } from 'mongodb';

export interface Role {
  _id: ObjectId;
  name: string; // superadmin, admin, marketer, etc.
}
