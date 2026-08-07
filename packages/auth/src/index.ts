import { auth } from "./auth";

export { auth };
export type Session = typeof auth.$Infer.Session;

export async function getSafeSession(headerList?: Headers) {
  try {
    if (!headerList) return null;
    const session = await auth.api.getSession({
      headers: headerList,
    });
    return session ?? null;
  } catch (error) {
    console.warn("[Auth] getSafeSession caught error:", error);
    return null;
  }
}

export * from "./rbac";
