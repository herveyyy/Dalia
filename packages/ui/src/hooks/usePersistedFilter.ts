"use client";

import { useEffect } from "react";

export function usePersistedFilter(key: string, value: string | number | undefined) {
  useEffect(() => {
    if (value !== undefined && typeof window !== "undefined") {
      try {
        localStorage.setItem(`dalia:filter:${key}`, String(value));
      } catch (err) {
        // Ignore storage errors in restricted contexts
      }
    }
  }, [key, value]);
}

export function getPersistedFilter(key: string, defaultValue: string): string {
  if (typeof window === "undefined") return defaultValue;
  try {
    return localStorage.getItem(`dalia:filter:${key}`) || defaultValue;
  } catch (err) {
    return defaultValue;
  }
}
