import mongoose from 'mongoose'
// prompt
/**
    You are a backend developer working on a Next.js application with Mongoose and TypeScript. 

    Your task is to,
    - Create a new file `lib/mongodb.ts` in the lib folder of a Next.js application. 
    - Set up a Mongoose database connection to MongoDB using TypeScript with proper types (avoid using any). 
    - Cache the connection to prevent multiple connections during development. 
    - Write clear and concise comments explaining key parts of the code. 
    - Make sure the code is clean, readable, and production-ready.
 */

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null
    promise: Promise<mongoose.Mongoose> | null
  }
}

// MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env')
}

/**
 * Cached connection object to prevent multiple connections
 * in serverless environments and development hot reloads
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

/**
 * Connects to MongoDB using Mongoose with connection caching
 * @returns Promise<mongoose.Mongoose> - The Mongoose connection instance
 */
async function connectToDatabase(): Promise<mongoose.Mongoose> {
  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn
  }

  // If no connection promise exists, create a new one
  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable buffering to fail fast if not connected
      maxPoolSize: 10, // Maximum number of connections in the connection pool
      minPoolSize: 5, // Minimum number of connections in the connection pool
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      serverSelectionTimeoutMS: 10000 // Timeout for initial connection to MongoDB
    }

    // Create connection promise
    cached.promise = mongoose.connect(MONGODB_URI as string, options).then((mongooseInstance) => {
      console.log('MongoDB connected successfully')
      return mongooseInstance
    })
  }

  try {
    // Await the connection promise and cache the result
    cached.conn = await cached.promise
  } catch (error) {
    // Clear promise on error so next call will retry
    cached.promise = null
    console.error('MongoDB connection error:', error)
    throw error
  }

  return cached.conn
}

export default connectToDatabase
