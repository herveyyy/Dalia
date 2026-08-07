import "dotenv/config";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema/index";
import { APP_ACCESS_CATALOG } from "./schema/rbac/catalog";
import { and, eq } from "drizzle-orm";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function main() {
  for (const [moduleIndex, mod] of APP_ACCESS_CATALOG.entries()) {
    const [existing] = await db
      .select({ id: schema.appModule.id })
      .from(schema.appModule)
      .where(eq(schema.appModule.key, mod.key))
      .limit(1);

    let moduleId = existing?.id;
    if (!moduleId) {
      const [created] = await db
        .insert(schema.appModule)
        .values({
          key: mod.key,
          name: mod.name,
          description: mod.description ?? null,
          sortOrder: moduleIndex,
        })
        .returning({ id: schema.appModule.id });
      moduleId = created!.id;
      console.log(`+ app ${mod.key}`);
    } else {
      await db
        .update(schema.appModule)
        .set({
          name: mod.name,
          description: mod.description ?? null,
          sortOrder: moduleIndex,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.appModule.id, moduleId));
      console.log(`~ app ${mod.key}`);
    }

    for (const [featureIndex, feature] of mod.features.entries()) {
      const [existingFeature] = await db
        .select({ id: schema.appFeature.id })
        .from(schema.appFeature)
        .where(
          and(
            eq(schema.appFeature.appModuleId, moduleId!),
            eq(schema.appFeature.key, feature.key)
          )
        )
        .limit(1);

      if (!existingFeature) {
        await db.insert(schema.appFeature).values({
          appModuleId: moduleId,
          key: feature.key,
          name: feature.name,
          description: feature.description ?? null,
          sortOrder: featureIndex,
        });
        console.log(`  + feature ${mod.key}.${feature.key}`);
      } else {
        await db
          .update(schema.appFeature)
          .set({
            name: feature.name,
            description: feature.description ?? null,
            sortOrder: featureIndex,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(schema.appFeature.id, existingFeature.id));
      }
    }
  }

  console.log("Access catalog seeded");
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
