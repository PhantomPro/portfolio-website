import mongoose from 'mongoose';
import { config } from './env';
import { seedDatabase } from '../seed';

let mongoMemoryServer: any = null;

export async function connectDatabase(): Promise<void> {
  try {
    console.log(`🔌 Connecting to MongoDB at ${config.mongoUri}...`);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log('✅ MongoDB connected successfully to external/local instance');

    // Check if database needs seeding
    const collections = await mongoose.connection.db?.listCollections().toArray();
    if (!collections || collections.length === 0) {
      console.log('🌱 Database is empty, seeding initial data...');
      await seedDatabase();
    }
  } catch (error) {
    console.warn('⚠️  Could not connect to configured MongoDB. Starting in-memory MongoDB fallback...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      console.log(`🧠 In-memory MongoDB started at ${uri}`);
      await mongoose.connect(uri);
      console.log('✅ Connected to in-memory MongoDB');
      console.log('🌱 Seeding initial portfolio data...');
      await seedDatabase();
    } catch (memError) {
      console.error('❌ Failed to start both local and in-memory MongoDB:', memError);
      process.exit(1);
    }
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

