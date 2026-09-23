import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { getEnv } from "../lib/env";
import { sendError } from "../lib/http";

export type AuthReader = (req: Request) => ReturnType<typeof getAuth>;

/**
 * Content endpoints are intentionally separate from public catalogue reads.
 * Staff accounts are provisioned through the workspace Auth pane; unauthenticated
 * visitors can never enumerate draft content or mutate the catalogue.
 */
export function createRequireStaffAuth(authReader: AuthReader = getAuth) {
  return function requireStaffAuth(req: Request, res: Response, next: NextFunction): void {
    const auth = authReader(req);
    const userId = auth?.sessionClaims?.userId || auth?.userId;

    if (!userId) {
      sendError(res, 401, "Staff sign-in is required.");
      return;
    }

    const staffUserIds = (getEnv().CONTENT_STAFF_USER_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    if (staffUserIds.length === 0) {
      sendError(res, 503, "Staff access has not been configured.");
      return;
    }
    if (!staffUserIds.includes(String(userId))) {
      sendError(res, 403, "This account is not authorized for the content workspace.");
      return;
    }

    next();
  };
}

export const requireStaffAuth = createRequireStaffAuth();