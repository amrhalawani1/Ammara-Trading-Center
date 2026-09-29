import { useEffect } from "react";
import { useClerk } from "@clerk/react";
import { useLocation } from "wouter";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { LocalForgotForm, LocalResetForm, LocalSignInForm, LocalSignUpForm } from "@/components/account/local-auth-forms";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { closeAuth } from "@/lib/auth-dialog";
import { publicEnv } from "@/lib/env";
import { cn } from "@/lib/utils";

const COPY: Record<string, { title: string; lede: string }> = {
  "sign-in": {
    title: "Sign in",
    lede: "For architects, fabricators and procurement teams. You do not need an account to save a shortlist or send an enquiry.",
  },
  "sign-up": {
    title: "Open a trade account",
    lede: "Two short steps. You do not need an account to save a shortlist or send an enquiry.",
  },
  forgot: {
    title: "Reset your password",
    lede: "Enter the email for your trade account. If it matches an account, we will email a reset link.",
  },
  reset: {
    title: "Set a new password",
    lede: "Use at least 8 characters.",
  },
};

export function AuthDialog() {
  return publicEnv.clerkIsConfigured ? <ClerkAuthBridge /> : <LocalAuthDialog />;
}

function ClerkAuthBridge() {
  const { openSignIn, openSignUp } = useClerk();
  const { open, view, next } = useAuthDialog();

  useEffect(() => {
    if (!open) return;
    const dest = next.startsWith("/") ? next : "/account";
    if (view === "sign-up") void openSignUp({ fallbackRedirectUrl: dest, forceRedirectUrl: dest });
    else void openSignIn({ fallbackRedirectUrl: dest, forceRedirectUrl: dest });
    closeAuth();
  }, [open, view, next, openSignIn, openSignUp]);

  return null;
}

function LocalAuthDialog() {
  const { open, view, next, email, closeAuth: close } = useAuthDialog();
  const [location, setLocation] = useLocation();
  const copy = COPY[view] ?? COPY["sign-in"];

  const finish = (dest?: string) => {
    const target = dest ?? next;
    close();
    if (target && target !== location) setLocation(target);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(value) => { if (!value) close(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-foreground/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby="auth-dialog-lede"
          className={cn(
            "fixed left-1/2 top-1/2 z-[81] flex max-h-[min(92vh,44rem)] w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-border bg-background shadow-[0_24px_80px_-32px_rgba(0,0,0,0.45)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
          data-testid="dialog-account-auth"
        >
          <div className="flex items-start justify-between gap-6 border-b border-border px-6 py-5 md:px-8">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Trade account</p>
              <DialogPrimitive.Title className="mt-1.5 font-display text-2xl font-medium leading-none tracking-[-0.03em] md:text-3xl">
                {copy.title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description id="auth-dialog-lede" className="mt-2 text-sm leading-6 text-muted-foreground">
                {copy.lede}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              aria-label="Close"
              data-testid="button-auth-dialog-close"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </DialogPrimitive.Close>
          </div>
          <div className="overflow-y-auto px-6 py-6 md:px-8">
            {open && view === "sign-in" && <LocalSignInForm onDone={() => finish()} />}
            {open && view === "sign-up" && <LocalSignUpForm onDone={(dest) => finish(dest)} />}
            {open && view === "forgot" && <LocalForgotForm />}
            {open && view === "reset" && <LocalResetForm email={email} onDone={() => finish()} />}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
