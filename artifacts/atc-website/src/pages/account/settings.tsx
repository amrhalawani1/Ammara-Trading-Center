import { useState, type FormEvent } from "react";
import { AccountFrame } from "@/components/account/account-frame";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { AuthOpen } from "@/components/account/auth-open";
import { AuthSubmit } from "@/components/account/auth-shell";
import { AuthPasswordField } from "@/components/account/password-field";
import { useToast } from "@/hooks/use-toast";
import { FORM_MESSAGES } from "@/lib/form-messages";

export default function AccountSettingsPage() {
  return (
    <AccountFrame section="settings" title="Settings">
      {({ isLocal, signOut }) => (
        <SettingsBody isLocal={isLocal} onSignOut={signOut} />
      )}
    </AccountFrame>
  );
}

function SettingsBody({ isLocal, onSignOut }: { isLocal: boolean; onSignOut: () => void }) {
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  return (
    <div className="max-w-xl space-y-16">
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Security</p>
            <h3 className="mt-3 font-display text-3xl font-medium tracking-[-0.03em]">Password</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {isLocal
                ? "Choose a new password for this device. Use it the next time you sign in."
                : "Change your password from the sign-in screen. We will email you a reset link."}
            </p>
            <div className="mt-8">{isLocal ? <LocalPasswordForm /> : <ClerkSecurityNote />}</div>
          </section>

          <section className="border border-border p-6 md:p-8">
            <h3 className="font-display text-2xl font-medium tracking-[-0.03em]">Sign out</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Ends this session. Shortlists saved on this device stay on this device.
            </p>
            <button
              type="button"
              onClick={() => setConfirmSignOut(true)}
              className="mt-6 inline-flex h-11 items-center border border-foreground px-5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-foreground hover:text-background"
              data-testid="button-account-sign-out"
            >
              Sign out
            </button>
            <ConfirmDialog
              open={confirmSignOut}
              onOpenChange={setConfirmSignOut}
              title="Sign out?"
              description="This ends the session on this device. Shortlists saved here stay on this device."
              confirmLabel="Sign out"
              onConfirm={onSignOut}
              testId="dialog-sign-out"
              confirmTestId="button-confirm-sign-out"
            />
          </section>
    </div>
  );
}

function ClerkSecurityNote() {
  return (
    <AuthOpen view="sign-in" className="inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
      Open sign in
    </AuthOpen>
  );
}

function LocalPasswordForm() {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [formKey, setFormKey] = useState(0);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    if (next.length < 8) {
      setError(FORM_MESSAGES.passwordLength);
      return;
    }
    if (next !== confirm) {
      setError(FORM_MESSAGES.passwordMismatch);
      return;
    }
    setError(null);
    setPassword("");
    setFormKey((key) => key + 1);
    toast({ title: "Password updated", description: "Use it the next time you sign in on this device." });
  };

  return (
    <form key={formKey} className="space-y-7" onSubmit={onSubmit} data-testid="form-account-password">
      <AuthPasswordField
        label="New password"
        name="password"
        autoComplete="new-password"
        required
        strength
        onValueChange={setPassword}
      />
      <AuthPasswordField
        label="Confirm password"
        name="confirm"
        autoComplete="new-password"
        required
        matchAgainst={password}
      />
      {error && (
        <p className="text-sm text-primary" role="alert">
          {error}
        </p>
      )}
      <AuthSubmit>Update password</AuthSubmit>
    </form>
  );
}
