import mongoose from "mongoose";
import dotenv from "dotenv";

if (process.env.VERCEL !== "1") {
  dotenv.config(); // só local
}

export async function connect(): Promise<typeof mongoose> {
  mongoose.set("strictQuery", true);

  const uri = process.env.MONGODB_URI ?? process.env.MONGODB_URI_LOCAL;
  const dbName = process.env.MONGODB_NAME ?? process.env.MONGODB_NAME_LOCAL;
  if (!uri || !dbName) throw new Error("Mongo envs faltando");

  // se já estiver conectado, só reutiliza
  if (mongoose.connection.readyState === 1) return mongoose;

  await mongoose.connect(uri, { dbName });
  return mongoose; // <-- **retorne o mongoose**
}

export default { connect };