export function apiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const record = error as { error?: unknown; message?: unknown };
    if (typeof record.error === "string" && record.error.trim()) {
      return record.error;
    }
    if (typeof record.message === "string" && record.message.trim()) {
      if (/HTTP 5\d\d/i.test(record.message)) {
        return fallback;
      }
      return record.message;
    }
  }

  return fallback;
}
