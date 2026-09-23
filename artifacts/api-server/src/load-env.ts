// Loads .env before anything else is evaluated. ES imports run in order, and @workspace/db reads
// DATABASE_URL at import time, so this module must be the first import of every entry point.
import { config as loadDotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
loadDotenv({ path: path.resolve(process.cwd(), ".env") });
loadDotenv({ path: path.resolve(here, "../../../.env") });
