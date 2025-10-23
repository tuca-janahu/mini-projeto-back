import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connect(): Promise<typeof mongoose> {
  mongoose.set("strictQuery", true);

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_NAME;

  // garante que a URI está definida em tempo de execução para satisfazer o tipo string
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  // se já estiver conectado, só reutiliza
  if (mongoose.connection.readyState === 1) return mongoose;

  await mongoose.connect(uri, { dbName });
  return mongoose; // <-- **retorne o mongoose**
}

export default { connect };