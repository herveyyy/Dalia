import "dotenv/config";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(url);
const db = drizzle({ client: sql });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const migrationsFolder = resolve(__dirname, "../drizzle");

async function run() {
  console.log("Applying migrations over neon-http...");
  console.log("Migrations folder:", migrationsFolder);
  
  await migrate(db, { migrationsFolder });
  console.log("Migrations applied successfully!");
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
