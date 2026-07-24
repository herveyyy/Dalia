import {
  APP_ACCESS_CATALOG,
  appFeature,
  appModule,
  db,
  eq,
} from "@repo/db";

/** Upserts the global app/feature permission catalog. Safe to call on page load. */
export async function ensureAppAccessCatalog() {
  for (const [moduleIndex, mod] of APP_ACCESS_CATALOG.entries()) {
    const existing = await db.query.appModule.findFirst({
      where: (m, { eq: whereEq }) => whereEq(m.key, mod.key),
    });

    let moduleId = existing?.id;
    if (!moduleId) {
      const [created] = await db
        .insert(appModule)
        .values({
          key: mod.key,
          name: mod.name,
          description: mod.description ?? null,
          sortOrder: moduleIndex,
        })
        .returning({ id: appModule.id });
      moduleId = created!.id;
    } else {
      await db
        .update(appModule)
        .set({
          name: mod.name,
          description: mod.description ?? null,
          sortOrder: moduleIndex,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(appModule.id, moduleId));
    }

    for (const [featureIndex, feature] of mod.features.entries()) {
      const existingFeature = await db.query.appFeature.findFirst({
        where: (f, { and: whereAnd, eq: whereEq }) =>
          whereAnd(whereEq(f.appModuleId, moduleId!), whereEq(f.key, feature.key)),
      });

      if (!existingFeature) {
        await db.insert(appFeature).values({
          appModuleId: moduleId,
          key: feature.key,
          name: feature.name,
          description: feature.description ?? null,
          sortOrder: featureIndex,
        });
      } else {
        await db
          .update(appFeature)
          .set({
            name: feature.name,
            description: feature.description ?? null,
            sortOrder: featureIndex,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(appFeature.id, existingFeature.id));
      }
    }
  }
}
