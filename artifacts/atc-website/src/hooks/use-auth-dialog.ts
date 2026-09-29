import { useSyncExternalStore } from "react";
import {
  closeAuth,
  getAuthDialogSnapshot,
  openAuth,
  setAuthView,
  subscribeAuthDialog,
  type AuthView,
} from "@/lib/auth-dialog";

export function useAuthDialog() {
  const state = useSyncExternalStore(subscribeAuthDialog, getAuthDialogSnapshot, getAuthDialogSnapshot);
  return { ...state, openAuth, setAuthView, closeAuth };
}

export type { AuthView };
