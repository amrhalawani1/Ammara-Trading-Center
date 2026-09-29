import { safeAccountNext } from "@/lib/account-return";

export type AuthView = "sign-in" | "sign-up" | "forgot" | "reset";

export type AuthDialogState = {
  open: boolean;
  view: AuthView;
  next: string;
  email: string;
};

const idle: AuthDialogState = { open: false, view: "sign-in", next: "/account", email: "" };

let snapshot: AuthDialogState = idle;
const listeners = new Set<() => void>();

function emit(next: AuthDialogState) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export function subscribeAuthDialog(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getAuthDialogSnapshot = (): AuthDialogState => snapshot;

export function openAuth(view: AuthView, options?: { next?: string; email?: string }): void {
  emit({
    open: true,
    view,
    next: safeAccountNext(options?.next),
    email: options?.email?.trim().toLowerCase() ?? snapshot.email,
  });
}

export function setAuthView(view: AuthView, options?: { email?: string }): void {
  emit({
    ...snapshot,
    open: true,
    view,
    email: options?.email?.trim().toLowerCase() ?? snapshot.email,
  });
}

export function closeAuth(): void {
  emit({ ...snapshot, open: false });
}

/** Where a bookmarked /account/sign-in URL should land so the dialog sits on a real page. */
export function authDialogLanding(next: string): string {
  const dest = safeAccountNext(next);
  if (dest.startsWith("/account")) return "/";
  return dest;
}
