import mongoose from "mongoose";
import dns from "dns";

console.log("DNS before:", dns.getServers());
dns.setServers(["8.8.8.8", "1.1.1.1"]);
console.log("DNS after:", dns.getServers());
const mongoUrl = process.env.MONGODB_URI;

if (!mongoUrl) {
  throw new Error("MongoDB URI is missing");
}

let cache = (global as any).mongoose;

if (!cache) {
  cache = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDb = async () => {
  if (cache.conn) {
    console.log("Using existing MongoDB connection");
    return cache.conn;
  }

  if (!cache.promise) {
    // console.log("Mongo URL:", mongoUrl);
    cache.promise = mongoose.connect(mongoUrl).then((m) => {
      console.log("MongoDB Connected Successfully ✅");
      return m.connection;
    });
  }

  try {
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (error) {
    cache.promise = null;
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDb;
