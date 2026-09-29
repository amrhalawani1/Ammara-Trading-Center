import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { clerkUserIdFromAuth } from "../lib/clerk-user";
import { sendError } from "../lib/http";
import type { AuthReader } from "./requireStaffAuth";

/**
 * Any signed-in Clerk user. Staff allowlist is not applied — trade accounts use this.
 */
export function createRequireSignedIn(authReader: AuthReader = getAuth) {
  return function requireSignedIn(req: Request, res: Response, next: NextFunction): void {
    const userId = clerkUserIdFromAuth(authReader(req));
    if (!userId) {
      sendError(res, 401, "Sign in to open your trade account.");
      return;
    }
    next();
  };
}

export const requireSignedIn = createRequireSignedIn();
