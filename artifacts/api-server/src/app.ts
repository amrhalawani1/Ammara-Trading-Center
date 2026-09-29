import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import { logger } from "./lib/logger";
import { clerkIsConfigured, corsOrigins, getEnv } from "./lib/env";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router, { createRouter } from "./routes";
import type { AuthReader } from "./middlewares/requireStaffAuth";
import { attachStaticSite } from "./lib/static";

export type AppOptions = {
  disableClerkMiddleware?: boolean;
  authReader?: AuthReader;
  disableStatic?: boolean;
};

export function createApp(options: AppOptions = {}): Express {
  const env = getEnv();
  const app: Express = express();

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy:
        env.NODE_ENV === "production"
          ? {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", "https://*.clerk.com", "https://*.clerk.accounts.dev"],
                frameSrc: ["https://*.clerk.com", "https://*.clerk.accounts.dev"],
              },
            }
          : false,
    }),
  );
  app.use(
    pinoHttp({
      logger,
      serializers: {
        req(req) {
          return {
            id: req.id,
            method: req.method,
            url: req.url?.split("?")[0],
          };
        },
        res(res) {
          return {
            statusCode: res.statusCode,
          };
        },
      },
    }),
  );
  if (!options.disableClerkMiddleware) {
    app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
  }

  const allowedOrigins = corsOrigins(env);
  app.use(
    cors({
      credentials: true,
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  if (!options.disableClerkMiddleware && clerkIsConfigured(env)) {
    // Applied to all /api routes so inquiries can optionally stamp a session.
    // Skipped when Clerk keys are unset so public catalogue reads keep working.
    app.use(
      "/api",
      clerkMiddleware((req) => ({
        publishableKey: publishableKeyFromHost(
          getClerkProxyHost(req) ?? "",
          env.CLERK_PUBLISHABLE_KEY,
        ),
      })),
    );
  }

  app.use("/api", options.authReader ? createRouter({ authReader: options.authReader }) : router);

  if (!options.disableStatic) {
    attachStaticSite(app);
  }

  return app;
}
