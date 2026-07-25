"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { FeatureKey } from "./types";

interface RBACContextType {
  permissions: Set<FeatureKey>;
  hasPermission: (key: FeatureKey) => boolean;
}

const RBACContext = createContext<RBACContextType>({
  permissions: new Set(),
  hasPermission: () => false,
});

export function RBACProvider({
  permissions,
  children,
}: {
  permissions: FeatureKey[];
  children: React.ReactNode;
}) {
  const set = useMemo(() => new Set(permissions), [permissions]);
  const value = useMemo(
    () => ({
      permissions: set,
      hasPermission: (key: FeatureKey) => set.has(key),
    }),
    [set]
  );

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

export function usePermissions() {
  return useContext(RBACContext);
}

export function PermissionGuard({
  feature,
  fallback = null,
  children,
}: {
  feature: FeatureKey;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { hasPermission } = usePermissions();
  if (!hasPermission(feature)) return <>{fallback}</>;
  return <>{children}</>;
}
