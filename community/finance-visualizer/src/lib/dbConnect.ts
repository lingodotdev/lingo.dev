import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Replaced 'any' with specific types for MongooseCache
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseCache = (global as unknown as { mongoose: MongooseCache }).mongoose;

if (!cached) {
  cached = (global as unknown as { mongoose: MongooseCache }).mongoose = { conn: null, promise: null };
}

/**
 * Establishes a connection to the MongoDB database.
 * Uses connection caching to reuse existing connections across requests.
 * Automatically retries on transient failures by clearing the cached promise.
 * @returns A Promise that resolves to the Mongoose connection instance
 * @throws Error if the connection fails after clearing the cache
 */
async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    }).catch((error) => {
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Ensure promise is cleared on failure (may already be null from .catch above)
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;
