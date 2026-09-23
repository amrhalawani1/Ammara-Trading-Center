import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";
const usePretty = process.env.PINO_PRETTY === "1" && !isProduction;

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']",
  ],
  ...(usePretty
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
    : {}),
});
