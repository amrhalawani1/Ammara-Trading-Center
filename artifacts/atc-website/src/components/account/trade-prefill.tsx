import type { ReactNode } from "react";
import { useAuth } from "@clerk/react";
import { getGetAccountProfileQueryKey, useGetAccountProfile } from "@workspace/api-client-react";
import { useTradeSession } from "@/hooks/use-trade-session";
import { publicEnv } from "@/lib/env";

export type TradePrefillValues = { name: string; email: string; company: string };

const empty: TradePrefillValues = { name: "", email: "", company: "" };

/** Supplies signed-in profile fields to guest forms. Clerk when configured; local session otherwise. */
export function TradePrefill({ children }: { children: (prefill: TradePrefillValues) => ReactNode }) {
  return publicEnv.clerkIsConfigured ? <ClerkPrefill>{children}</ClerkPrefill> : <LocalPrefill>{children}</LocalPrefill>;
}

function LocalPrefill({ children }: { children: (prefill: TradePrefillValues) => ReactNode }) {
  const { isSignedIn, profile } = useTradeSession();
  if (!isSignedIn || !profile) return children(empty);
  return children({ name: profile.name, email: profile.email, company: profile.company });
}

function ClerkPrefill({ children }: { children: (prefill: TradePrefillValues) => ReactNode }) {
  const { isSignedIn } = useAuth();
  const profile = useGetAccountProfile({
    query: { queryKey: getGetAccountProfileQueryKey(), enabled: Boolean(isSignedIn) },
  });
  if (!isSignedIn || !profile.data) return children(empty);
  return children({
    name: profile.data.name ?? "",
    email: profile.data.email ?? "",
    company: profile.data.company ?? "",
  });
}
