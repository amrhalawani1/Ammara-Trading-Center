import type { AuthReader } from "../middlewares/requireStaffAuth";

/** Clerk user id from a session, or null when the visitor is a guest. */
export function clerkUserIdFromAuth(auth: ReturnType<AuthReader> | undefined | null): string | null {
  if (!auth) return null;
  const id = auth.userId || auth.sessionClaims?.userId;
  return id ? String(id) : null;
}
