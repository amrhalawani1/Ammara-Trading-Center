import { useSyncExternalStore } from "react";
import {
  clearWelcome,
  getTradeSessionSnapshot,
  saveTradeProfile,
  signInLocal,
  signOutLocal,
  signUpLocal,
  subscribeTradeSession,
  type TradeProfile,
  type TradeRole,
} from "@/lib/trade-session";

export function useTradeSession() {
  const current = useSyncExternalStore(subscribeTradeSession, getTradeSessionSnapshot, getTradeSessionSnapshot);
  return {
    isLoaded: true,
    isSignedIn: Boolean(current.email),
    email: current.email ?? "",
    profile: current.profile,
    welcome: current.welcome,
    signIn: signInLocal,
    signUp: signUpLocal,
    signOut: signOutLocal,
    saveProfile: (profile: TradeProfile) => saveTradeProfile(profile),
    clearWelcome,
  };
}

export type { TradeProfile, TradeRole };
