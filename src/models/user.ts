// src/models/user.ts
import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string; // hashed
  roleId: ObjectId;
  organizationId: string;
  teamId: string;
  createdAt: Date;
  updatedAt: Date;
}
