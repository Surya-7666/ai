import mongoose from "mongoose"

const mongo_Url = process.env.MONGODB_URI

if (!mongo_Url) {
  throw new Error("Please define MONGODB_URI in .env.local")
}

let cache = (global as any).mongoose

if (!cache) {
  cache = (global as any).mongoose = { conn: null, promise: null }
}

const connectDb = async () => {

  if (cache.conn) {
    return cache.conn
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongo_Url).then((m) => m.connection)
  }

  try {
    cache.conn = await cache.promise
  } catch (error) {
    console.log("MongoDB connection error:", error)
  }

  return cache.conn
}

export default connectDb