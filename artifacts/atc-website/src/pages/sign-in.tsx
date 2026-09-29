import { SignIn } from "@clerk/react";
import { AuthUnavailablePage } from "@/components/auth-unavailable";
import { basePath } from "@/lib/clerk";
import { publicEnv } from "@/lib/env";

export default function SignInPage() {
  if (!publicEnv.clerkIsConfigured) {
    return <AuthUnavailablePage title="Sign in" />;
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} forceRedirectUrl={`${basePath}/content`} />
    </div>
  );
}
