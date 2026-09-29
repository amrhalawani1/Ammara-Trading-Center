import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  DATABASE_URL: z.string().min(1).optional(),
  CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  CONTENT_STAFF_USER_IDS: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  LOG_LEVEL: z.string().optional(),
  SERVE_STATIC: z.enum(["true", "false"]).optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | undefined;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): ServerEnv {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment: ${details}`);
  }

  const env = parsed.data;
  if (env.NODE_ENV !== "test" && !env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Copy .env.example to .env and provision Postgres.",
    );
  }

  return env;
}

export function getEnv(): ServerEnv {
  cached ??= loadEnv();
  return cached;
}

export function clerkIsConfigured(env: ServerEnv = getEnv()): boolean {
  const key = env.CLERK_PUBLISHABLE_KEY ?? "";
  return Boolean(env.CLERK_SECRET_KEY && (key.startsWith("pk_test_") || key.startsWith("pk_live_")));
}

export function corsOrigins(env: ServerEnv = getEnv()): string[] {
  const fromEnv = (env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (env.NODE_ENV !== "production") {
    return [...new Set(["http://localhost:5173", "http://127.0.0.1:5173", ...fromEnv])];
  }

  return fromEnv;
}
