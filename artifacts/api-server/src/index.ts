import "./load-env";
import { createApp } from "./app";
import { getEnv } from "./lib/env";
import { logger } from "./lib/logger";


export { createApp } from "./app";

function boot() {
  try {
    const app = createApp();
    if (!process.env.VERCEL) {
      const env = getEnv();
      app.listen(env.PORT, () => {
        logger.info({ port: env.PORT }, "Server listening");
        console.log(`API listening on http://127.0.0.1:${env.PORT}`);
      });
    }
    return app;
  } catch (err) {
    console.error("Failed to start API server:", err);
    if (!process.env.VERCEL) process.exit(1);
    throw err;
  }
}

// Tests that need createApp without listening set SKIP_LISTEN=1.
// On Vercel the platform calls the default export, so the process does not listen.
const app = process.env.SKIP_LISTEN === "1" ? undefined : boot();

export default app;
