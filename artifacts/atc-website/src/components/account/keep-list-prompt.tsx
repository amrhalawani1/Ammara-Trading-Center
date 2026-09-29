import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { AuthOpen } from "@/components/account/auth-open";
import { useTradeSession } from "@/hooks/use-trade-session";
import { dismissKeepList, keepListDismissed, onGuestSave } from "@/lib/guest-save";
import { publicEnv } from "@/lib/env";

/**
 * After a guest saves, offer an account without blocking the save. Dismissed for this device.
 */
export function KeepListPrompt() {
  return publicEnv.clerkIsConfigured ? <ClerkKeepListPrompt /> : <LocalKeepListPrompt />;
}

function ClerkKeepListPrompt() {
  const { isLoaded, isSignedIn } = useAuth();
  return <KeepListBanner isLoaded={isLoaded} isSignedIn={Boolean(isSignedIn)} />;
}

function LocalKeepListPrompt() {
  const { isLoaded, isSignedIn } = useTradeSession();
  return <KeepListBanner isLoaded={isLoaded} isSignedIn={isSignedIn} />;
}

function KeepListBanner({ isLoaded, isSignedIn }: { isLoaded: boolean; isSignedIn: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded || isSignedIn || keepListDismissed()) return;
    return onGuestSave(() => setOpen(true));
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (isSignedIn) setOpen(false);
  }, [isSignedIn]);

  if (!open || isSignedIn) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-background/95 px-6 py-4 backdrop-blur-md md:px-12"
      role="status"
      data-testid="banner-keep-list"
    >
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-sm leading-6 text-foreground">
          Use this shortlist on any device. A trade account keeps your shortlists and shows the status of your enquiries.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <AuthOpen
            view="sign-up"
            next="/lists"
            onOpen={() => setOpen(false)}
            className="inline-flex h-10 items-center bg-foreground px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-background"
            testId="link-keep-list-signup"
          >
            Open a trade account
          </AuthOpen>
          <button
            type="button"
            onClick={() => {
              dismissKeepList();
              setOpen(false);
            }}
            className="h-10 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            data-testid="button-keep-list-dismiss"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
