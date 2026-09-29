import { useSyncExternalStore } from "react";

let open = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listen) => listen());
const subscribe = (listen: () => void) => {
  listeners.add(listen);
  return () => listeners.delete(listen);
};

export const openSearch = () => {
  if (open) return;
  open = true;
  emit();
};

export const closeSearch = () => {
  if (!open) return;
  open = false;
  emit();
};

export const toggleSearch = () => {
  open = !open;
  emit();
};

export function useSearchOverlay() {
  return useSyncExternalStore(subscribe, () => open, () => false);
}
