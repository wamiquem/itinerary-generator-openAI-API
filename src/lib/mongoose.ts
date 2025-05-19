// This file is copied as is from internet source

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  const conn = await mongoose.connect(MONGODB_URI);
  cached.conn = conn;
  return conn;
}
