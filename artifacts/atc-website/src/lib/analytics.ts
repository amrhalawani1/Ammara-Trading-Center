/**
 * Named GA4 events from the product page spec. No-ops until a gtag snippet is on the page.
 */
export function track(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: (command: string, eventName: string, eventParams?: Record<string, unknown>) => void }).gtag;
  gtag?.("event", name, params);
}
