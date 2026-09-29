import { ClerkProvider } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { AuthDialog } from "@/components/account/auth-dialog";
import { KeepListPrompt } from "@/components/account/keep-list-prompt";
import { ShortlistSync } from "@/components/account/shortlist-sync";
import { basePath, clerkAppearance, stripBase } from "@/lib/clerk";
import { publicEnv } from "@/lib/env";

/**
 * Clerk wraps the public site when a publishable key is present so the navbar and
 * shortlist sync can see the session. Without a key the site stays fully public.
 */
export function ClerkRoot({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();

  if (!publicEnv.clerkIsConfigured) {
    return (
      <>
        <AuthDialog />
        <KeepListPrompt />
        {children}
      </>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKeyFromHost(window.location.hostname, publicEnv.clerkPublishableKey)}
      proxyUrl={publicEnv.clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/account/sign-in`}
      signUpUrl={`${basePath}/account/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <AuthDialog />
      <ShortlistSync />
      <KeepListPrompt />
      {children}
    </ClerkProvider>
  );
}
