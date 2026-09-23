const configuredClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

export const publicEnv = {
  baseUrl: import.meta.env.BASE_URL || "/",
  clerkPublishableKey: configuredClerkKey,
  clerkProxyUrl: import.meta.env.VITE_CLERK_PROXY_URL as string | undefined,
  clerkIsConfigured: Boolean(
    configuredClerkKey &&
      (configuredClerkKey.startsWith("pk_test_") ||
        configuredClerkKey.startsWith("pk_live_")),
  ),
};

export function assetUrl(path: string): string {
  const base = publicEnv.baseUrl.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}
