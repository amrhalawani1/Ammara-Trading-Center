import { ClerkProvider, SignIn } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { useLocation } from "wouter";
import { AuthUnavailablePage } from "@/components/auth-unavailable";
import { basePath, clerkAppearance, stripBase } from "@/lib/clerk";
import { publicEnv } from "@/lib/env";

export default function SignInPage() {
  const [, setLocation] = useLocation();

  if (!publicEnv.clerkIsConfigured) {
    return <AuthUnavailablePage title="Sign in" />;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKeyFromHost(window.location.hostname, publicEnv.clerkPublishableKey)}
      proxyUrl={publicEnv.clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <SignIn routing="path" path={`${basePath}/sign-in`} />
      </div>
    </ClerkProvider>
  );
}
