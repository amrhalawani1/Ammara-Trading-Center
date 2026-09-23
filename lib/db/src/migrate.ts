import path from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL must be set before running migrations.");
}

const migrationsFolder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../migrations");
const pool = new pg.Pool({ connectionString: databaseUrl });

try {
  await migrate(drizzle(pool), { migrationsFolder });
} finally {
  await pool.end();
}
