import { useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { AuthUnavailablePage } from "@/components/auth-unavailable";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { basePath } from "@/lib/clerk";
import { publicEnv } from "@/lib/env";
import ContentWorkspace from "@/pages/content/index";

export default function ContentRoute() {
  if (!publicEnv.clerkIsConfigured) {
    return <AuthUnavailablePage title="Staff workspace" />;
  }

  return <StaffContentRoute />;
}

function StaffContentRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  // Fail-closed: any network/response error resolves to "denied" rather than
  // surfacing a Query error state, matching the access gate's prior behavior.
  const { data: access, isLoading: isAccessLoading } = useQuery({
    queryKey: ["content-access"],
    queryFn: async (): Promise<"allowed" | "denied"> => {
      try {
        const response = await fetch("/api/content/access", { credentials: "include" });
        return response.ok ? "allowed" : "denied";
      } catch {
        return "denied";
      }
    },
    enabled: isSignedIn,
    retry: 1,
  });

  if (!isLoaded || (isSignedIn && isAccessLoading)) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isSignedIn) {
    return <Redirect to="/sign-in" />;
  }

  if (access !== "allowed") {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <div className="max-w-lg border border-border bg-card p-8 text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Access restricted</p>
          <h1 className="mb-3 font-display text-3xl">Staff workspace only</h1>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Your account is signed in but has not been approved to manage catalogue content.
          </p>
          <p className="mb-6 break-all border border-border bg-accent/20 p-3 font-mono text-xs text-foreground">
            {user?.id}
          </p>
          <p className="mb-6 text-xs leading-relaxed text-muted-foreground">
            An administrator can add this Clerk user ID to the CONTENT_STAFF_USER_IDS environment variable.
          </p>
          <button
            type="button"
            className="text-xs font-bold uppercase tracking-widest text-primary hover:text-foreground"
            onClick={() => setConfirmSignOut(true)}
          >
            Sign out
          </button>
          <ConfirmDialog
            open={confirmSignOut}
            onOpenChange={setConfirmSignOut}
            title="Sign out?"
            description="This ends the session on this device."
            confirmLabel="Sign out"
            onConfirm={() => signOut({ redirectUrl: basePath || "/" })}
            testId="dialog-sign-out"
            confirmTestId="button-confirm-sign-out"
          />
        </div>
      </div>
    );
  }

  return <ContentWorkspace />;
}
