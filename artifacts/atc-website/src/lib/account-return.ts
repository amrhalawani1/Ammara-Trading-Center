/** Safe post-auth destinations. Only same-origin paths; never staff or auth loops. */
export function safeAccountNext(raw: string | null | undefined): string {
  if (!raw) return "/account";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) return "/account";
  if (raw.startsWith("/sign-in") || raw.startsWith("/content")) return "/account";
  if (raw.startsWith("/account/sign") || raw.startsWith("/account/forgot") || raw.startsWith("/account/reset")) {
    return "/account";
  }
  return raw;
}

export function readNextParam(): string {
  if (typeof window === "undefined") return "/account";
  return safeAccountNext(new URLSearchParams(window.location.search).get("next"));
}

export function withNext(path: string, next = readNextParam()): string {
  if (!next || next === "/account" || next === path) return path;
  return `${path}?next=${encodeURIComponent(next)}`;
}
