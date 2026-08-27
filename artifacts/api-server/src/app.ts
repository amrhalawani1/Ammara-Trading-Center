import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import { logger } from "./lib/logger";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router, { createRouter } from "./routes";
import type { AuthReader } from "./middlewares/requireStaffAuth";

export type AppOptions = {
  disableClerkMiddleware?: boolean;
  authReader?: AuthReader;
};

export function createApp(options: AppOptions = {}): Express {
  const app: Express = express();

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
  app.use(cors({ credentials: true, origin: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (!options.disableClerkMiddleware) {
    app.use(
      clerkMiddleware((req) => ({
        publishableKey: publishableKeyFromHost(
          getClerkProxyHost(req) ?? "",
          process.env.CLERK_PUBLISHABLE_KEY,
        ),
      })),
    );
  }

  app.use("/api", options.authReader ? createRouter({ authReader: options.authReader }) : router);

  return app;
}

export default createApp();
