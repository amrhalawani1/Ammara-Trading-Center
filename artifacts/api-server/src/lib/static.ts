import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import express, { type Express } from "express";
import { getEnv } from "./env";

export function attachStaticSite(app: Express): void {
  const env = getEnv();
  const shouldServe =
    env.SERVE_STATIC === "true" ||
    (env.NODE_ENV === "production" && env.SERVE_STATIC !== "false");

  if (!shouldServe) return;

  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(here, "../../atc-website/dist/public"),
    path.resolve(process.cwd(), "artifacts/atc-website/dist/public"),
    path.resolve(process.cwd(), "../atc-website/dist/public"),
  ];
  const publicDir = candidates.find((candidate) => existsSync(candidate));

  if (!publicDir) {
    return;
  }

  app.use(express.static(publicDir, { index: false, redirect: false }));
  app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}
