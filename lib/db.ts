import { MongoClient, Db } from "mongodb";
import { MONGODB_URI, DATABASE_NAME } from "../configs/config.js";

// Connection string para MongoDB Atlas
const CONNECTION_STRING = MONGODB_URI;
const databaseName = DATABASE_NAME;

let client: MongoClient;
let db: Db;

/**
 * Connect to MongoDB Atlas
 */
export async function connectToDatabase(): Promise<Db> {
  try {
    if (!client) {
      console.log("Conectando a MongoDB...");
      client = new MongoClient(CONNECTION_STRING);
      await client.connect();
      console.log("✅ Conectado exitosamente a MongoDB Atlas");
    }

    if (!db) {
      db = client.db(databaseName);
    }

    return db;
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw error;
  }
}

/**
 * Get an instance of the database
 */
export function getDatabase(): Db {
  if (!db) {
    throw new Error(
      "Database not initialized. Call connectToDatabase() first."
    );
  }
  return db;
}

/**
 * Close the MongoDB connection
 */
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    console.log("🔌 MongoDB connection closed");
  }
}

// Graceful shutdown handling
process.on("SIGINT", async () => {
  await closeConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeConnection();
  process.exit(0);
});
