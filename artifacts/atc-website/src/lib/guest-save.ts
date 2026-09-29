const EVENT = "atc-guest-save";
export const KEEP_LIST_DISMISSED_KEY = "atc-keep-list-dismissed";

/** Fired after a guest saves a reference so the keep-list prompt can appear. */
export function noteGuestSave(): void {
  window.dispatchEvent(new Event(EVENT));
}

export function onGuestSave(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

export function keepListDismissed(): boolean {
  try {
    return window.localStorage.getItem(KEEP_LIST_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissKeepList(): void {
  try {
    window.localStorage.setItem(KEEP_LIST_DISMISSED_KEY, "1");
  } catch {
    /* private mode */
  }
}
