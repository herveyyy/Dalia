import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema/index";

neonConfig.webSocketConstructor = ws;

export const schemaWithRelations = schema;

type Db = ReturnType<typeof createDb>;

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString: url });
  return drizzle({ client: pool, schema: schemaWithRelations });
}

let _db: Db | undefined;

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    _db ??= createDb();
    const value = Reflect.get(_db, prop, receiver);
    return typeof value === "function" ? value.bind(_db) : value;
  },
});

export * from "./schema";
export * from "./queries/get-user-permissions";
export * from "./utils/audit";
export { eq, and, ilike, asc, desc, inArray, sql } from "drizzle-orm";

