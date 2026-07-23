import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(url);

async function run() {
  console.log("Dropping existing tables in Neon...");
  await sql`DROP TABLE IF EXISTS "account", "session", "user", "verification", "__drizzle_migrations" CASCADE;`;
  console.log("Tables dropped successfully!");
}

run().catch((err) => {
  console.error("Failed to drop tables:", err);
  process.exit(1);
});
