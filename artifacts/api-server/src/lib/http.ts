import type { Response } from "express";

export type ApiErrorBody = {
  error: string;
  details?: unknown;
};

export function sendError(
  res: Response,
  status: number,
  error: string,
  details?: unknown,
): void {
  const body: ApiErrorBody = details === undefined ? { error } : { error, details };
  res.status(status).json(body);
}
