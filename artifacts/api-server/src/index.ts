import "./load-env";
import { createApp } from "./app";
import { getEnv } from "./lib/env";
import { logger } from "./lib/logger";


export { createApp } from "./app";

// Tests that need createApp without listening set SKIP_LISTEN=1.
if (process.env.SKIP_LISTEN !== "1") {
  try {
    const env = getEnv();
    const app = createApp();
    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, "Server listening");
      console.log(`API listening on http://127.0.0.1:${env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start API server:", err);
    process.exit(1);
  }
}
