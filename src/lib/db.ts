import mongoose from 'mongoose';

const rawUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/meb_power_manpower';
const MONGODB_URI = rawUri.replace('localhost', '127.0.0.1');

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface MongooseCached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCached | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (global.useMockDb) {
    return mongoose;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 1000, // 1 second timeout
      connectTimeoutMS: 1000,
      family: 4, // Force IPv4 to avoid IPv6 resolution timeouts on Windows
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('Connected to MongoDB successfully');
      global.useMockDb = false;
      return mongooseInstance;
    }).catch(err => {
      console.warn('MongoDB connection failed. Falling back to IN-MEMORY Mock Database!');
      global.useMockDb = true;
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    global.useMockDb = true;
    return mongoose;
  }

  return cached.conn;
}

export default dbConnect;
