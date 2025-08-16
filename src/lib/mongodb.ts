import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env');
}

const uri: string = process.env.MONGODB_URI;
const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

const ALL_PERMISSIONS = [
  '/dashboard',
  '/socialmedia',
  '/email',
  '/google-ads',
  '/users',
  '/settings',
  '/clients'
];

// ===== Bootstrapping roles & superadmin =====
async function initDatabase() {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB;
    
    if (!dbName) {
        throw new Error('Please define the MONGODB_DB environment variable in .env');
    }

    const db = client.db(dbName);

    const roles = db.collection('roles');
    const users = db.collection('users');
    const teams = db.collection('teams');
    const organizations = db.collection('organizations');

    // Seed roles if empty
    if (await roles.countDocuments() === 0) {
      await roles.insertMany([
        { name: 'Super Admin', description: 'Full platform control', level: 100, permissions: ALL_PERMISSIONS },
        { name: 'Admin', description: 'Organization-level admin', level: 90, permissions: ALL_PERMISSIONS },
        { name: 'Organization Owner', description: 'Manages own org & billing', level: 80, permissions: ['/dashboard', '/socialmedia', '/google-ads'] },
        { name: 'Team Manager', description: 'Manages a specific team', level: 70, permissions: ['/dashboard', '/socialmedia'] },
        { name: 'Marketer', description: 'Social media & campaigns', level: 60, permissions: ['/socialmedia', '/google-ads'] },
        { name: 'Staff', description: 'Basic access', level: 50, permissions: ['/dashboard'] }
      ]);
      console.log('✅ Default roles seeded.');
    }

    // Ensure Super Admin user exists
    const superAdminRole = await roles.findOne({ name: 'Super Admin' });
    if (!superAdminRole) {
      throw new Error('Super Admin role not found in roles collection.');
    }

    const existingSuperAdmin = await users.findOne({ email: 'yenmin@gmail.com' });
    if (!existingSuperAdmin) {
      const hashedPassword = await bcrypt.hash('Yenmin@1234#', 10);
      await users.insertOne({
        _id: new ObjectId(),
        name: 'Super Admin',
        email: 'yenmin@gmail.com',
        password: hashedPassword,
        roleId: superAdminRole._id,
        organizationId: new ObjectId('60f6e1b9b3b3b3b3b3b3b3b3'), // Placeholder generic ID
        teamId: null,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Default Super Admin user created: yenmin@gmail.com');
    }

    // Add status to all organizations if it doesn't exist
    await organizations.updateMany(
        { status: { $exists: false } },
        { $set: { status: 'active' } }
    );


    // Create indexes
    await teams.createIndex({ name: 1, organizationId: 1 }, { unique: true });
    console.log('✅ Team name index created.');

  } catch (err: any) {
      if (err.code === 85) { // IndexOptionsConflict error code
        console.log('Index already exists, skipping creation.');
      } else if (err.code === 86) { // IndexKeySpecsConflict error code
        console.log('Index with different options exists, skipping creation.');
      }
      else {
        console.error('❌ Error during DB initialization:', err);
        throw err;
      }
  }
}

initDatabase().catch(err => {
  console.error('DB Initialization failed. The application may not function correctly.');
  process.exit(1);
});

export default clientPromise;
