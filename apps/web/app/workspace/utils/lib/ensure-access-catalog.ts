import {
  APP_ACCESS_CATALOG,
  appFeature,
  appModule,
  db,
  eq,
} from "@repo/db";

/** Upserts the global app/feature permission catalog efficiently. Safe to call on page load. */
export async function ensureAppAccessCatalog() {
  const existingModules = await db.query.appModule.findMany({
    with: { features: true },
  });

  const moduleMap = new Map(existingModules.map((m) => [m.key, m]));

  for (const [moduleIndex, mod] of APP_ACCESS_CATALOG.entries()) {
    const existing = moduleMap.get(mod.key);
    let moduleId = existing?.id;

    if (!existing || !moduleId) {
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
    } else if (
      existing.name !== mod.name ||
      existing.description !== (mod.description ?? null) ||
      existing.sortOrder !== moduleIndex
    ) {
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

    const featureMap = new Map((existing?.features ?? []).map((f) => [f.key, f]));

    for (const [featureIndex, feature] of mod.features.entries()) {
      const existingFeature = featureMap.get(feature.key);

      if (!existingFeature) {
        await db.insert(appFeature).values({
          appModuleId: moduleId,
          key: feature.key,
          name: feature.name,
          description: feature.description ?? null,
          sortOrder: featureIndex,
        });
      } else if (
        existingFeature.name !== feature.name ||
        existingFeature.description !== (feature.description ?? null) ||
        existingFeature.sortOrder !== featureIndex
      ) {
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
