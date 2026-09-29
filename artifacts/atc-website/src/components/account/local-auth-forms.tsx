import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { useTradeSession } from "@/hooks/use-trade-session";
import { setAuthView } from "@/lib/auth-dialog";
import { FORM_MESSAGES } from "@/lib/form-messages";
import { TRADE_ROLES, roleLabel, type TradeRole } from "@/lib/trade-session";
import { cn } from "@/lib/utils";
import { AuthField, AuthSelect, AuthSubmit } from "./auth-shell";
import { AuthPasswordField } from "./password-field";

const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const switchClass = "text-foreground underline-offset-4 hover:underline";

export function LocalSignInForm({ onDone }: { onDone: () => void }) {
  const { signIn } = useTradeSession();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    if (!emailOk(email)) {
      setError(FORM_MESSAGES.email);
      return;
    }
    if (password.length < 8) {
      setError(FORM_MESSAGES.passwordLength);
      return;
    }
    if (!signIn(email)) {
      setError("No trade account for this email. Open one, or check the address.");
      return;
    }
    onDone();
  };

  return (
    <form className="space-y-7" onSubmit={onSubmit} data-testid="form-account-sign-in">
      <AuthField label="Email" name="email" type="email" autoComplete="email" required placeholder="you@studio.jo" />
      <AuthPasswordField label="Password" name="password" autoComplete="current-password" required />
      {error && (
        <p className="text-sm text-primary" role="alert" data-testid="text-auth-error">
          {error}
        </p>
      )}
      <AuthSubmit>Sign in</AuthSubmit>
      <p className="text-sm leading-6 text-muted-foreground">
        <button type="button" onClick={() => setAuthView("forgot")} className={switchClass} data-testid="link-auth-forgot">
          Forgot password
        </button>
      </p>
      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        No account yet?{" "}
        <button type="button" onClick={() => setAuthView("sign-up")} className={switchClass} data-testid="link-auth-to-signup">
          Open a trade account
        </button>
      </p>
    </form>
  );
}

export function LocalSignUpForm({ onDone }: { onDone: (dest?: string) => void }) {
  const { signUp } = useTradeSession();
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", email: "", company: "", role: "" as TradeRole | "" });
  const [password, setPassword] = useState("");

  const onFile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const company = String(data.get("company") || "").trim();
    const role = String(data.get("role") || "") as TradeRole | "";
    if (name.length < 2) {
      setError(FORM_MESSAGES.name);
      return;
    }
    if (!emailOk(email)) {
      setError(FORM_MESSAGES.email);
      return;
    }
    setError(null);
    setDraft({ name, email, company, role: TRADE_ROLES.some((item) => item.value === role) ? role : "" });
    setStep(2);
  };

  const onPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    if (password.length < 8) {
      setError(FORM_MESSAGES.passwordLength);
      return;
    }
    if (password !== confirm) {
      setError(FORM_MESSAGES.passwordMismatch);
      return;
    }
    if (!signUp({ ...draft, role: draft.role })) {
      setError("This email already has a trade account. Sign in instead.");
      return;
    }
    onDone("/account/welcome");
  };

  const backToFile = () => {
    setError(null);
    setStep(1);
  };

  return (
    <div>
      <SignUpSteps step={step} onSelect={(next) => { setError(null); setStep(next); }} />

      {step === 1 ? (
        <form className="grid gap-5" onSubmit={onFile} data-testid="form-account-sign-up">
          <p className="text-sm leading-6 text-muted-foreground">Name and email are enough to start. You can add company and role later.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <AuthField label="Name" name="name" autoComplete="name" required defaultValue={draft.name} placeholder="Your name" />
            <AuthField label="Email" name="email" type="email" autoComplete="email" required defaultValue={draft.email} placeholder="you@studio.jo" />
            <AuthField label="Company" name="company" autoComplete="organization" optional defaultValue={draft.company} placeholder="Practice or workshop" />
            <AuthSelect label="Role" name="role" defaultValue={draft.role} options={TRADE_ROLES} optional placeholder="What you do" />
          </div>
          {error && (
            <p className="text-sm text-primary" role="alert" data-testid="text-auth-error">
              {error}
            </p>
          )}
          <div className="sticky bottom-0 -mx-6 mt-1 border-t border-border bg-background px-6 py-4 md:-mx-8 md:px-8">
            <AuthSubmit>Continue</AuthSubmit>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button type="button" onClick={() => setAuthView("sign-in")} className={switchClass} data-testid="link-auth-to-signin">
                Sign in
              </button>
            </p>
          </div>
        </form>
      ) : (
        <form className="grid gap-5" onSubmit={onPassword} data-testid="form-account-sign-up-password">
          <div className="flex items-start justify-between gap-4 border border-border bg-muted/50 px-4 py-3" data-testid="signup-file-summary">
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{draft.name || "Name not added"}</p>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {draft.email}
                {draft.company ? ` · ${draft.company}` : ""}
                {draft.role ? ` · ${roleLabel(draft.role)}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={backToFile}
              className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
              data-testid="button-signup-back"
            >
              Edit
            </button>
          </div>
          <AuthPasswordField
            label="Password"
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
            <p className="text-sm text-primary" role="alert" data-testid="text-auth-error">
              {error}
            </p>
          )}
          <div className="sticky bottom-0 -mx-6 mt-1 border-t border-border bg-background px-6 py-4 md:-mx-8 md:px-8">
            <AuthSubmit>Create account</AuthSubmit>
          </div>
        </form>
      )}
    </div>
  );
}

export function LocalForgotForm() {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") || "").trim();
    if (!emailOk(email)) {
      setError(FORM_MESSAGES.email);
      return;
    }
    setError(null);
    setSentTo(email.toLowerCase());
  };

  if (sentTo) {
    return (
      <div className="space-y-6" data-testid="forgot-sent">
        <p className="text-sm leading-6 text-muted-foreground">
          If {sentTo} has a trade account, a reset link is on its way. Check your inbox.
        </p>
        <button
          type="button"
          onClick={() => setAuthView("reset", { email: sentTo })}
          className="inline-flex h-12 w-full items-center justify-center bg-foreground px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background"
          data-testid="link-forgot-continue"
        >
          Continue to reset
        </button>
        <p className="border-t border-border pt-6 text-sm text-muted-foreground">
          <button type="button" onClick={() => setAuthView("sign-in")} className={switchClass}>
            Back to sign in
          </button>
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-7" onSubmit={onSubmit} data-testid="form-account-forgot">
      <AuthField label="Email" name="email" type="email" autoComplete="email" required placeholder="you@studio.jo" />
      {error && (
        <p className="text-sm text-primary" role="alert">
          {error}
        </p>
      )}
      <AuthSubmit>Send reset</AuthSubmit>
      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        <button type="button" onClick={() => setAuthView("sign-in")} className={switchClass}>
          Back to sign in
        </button>
      </p>
    </form>
  );
}

export function LocalResetForm({ email, onDone }: { email: string; onDone: () => void }) {
  const { signIn } = useTradeSession();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    if (password.length < 8) {
      setError(FORM_MESSAGES.passwordLength);
      return;
    }
    if (password !== confirm) {
      setError(FORM_MESSAGES.passwordMismatch);
      return;
    }
    if (!email || !signIn(email)) {
      setError("No trade account for this email. Open one first.");
      return;
    }
    onDone();
  };

  return (
    <form className="space-y-7" onSubmit={onSubmit} data-testid="form-account-reset">
      <p className="text-sm text-muted-foreground">{email || "The address from your reset email."}</p>
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
      <AuthSubmit>Set new password</AuthSubmit>
    </form>
  );
}

const SIGN_UP_STEPS = [
  { id: 1 as const, title: "Your details" },
  { id: 2 as const, title: "Password" },
];

function SignUpSteps({ step, onSelect }: { step: 1 | 2; onSelect: (next: 1 | 2) => void }) {
  return (
    <nav aria-label="Registration steps" className="mb-6" data-testid="signup-steps">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Step {step} of 2</p>
      <ol className="mt-3 grid grid-cols-2 gap-3">
        {SIGN_UP_STEPS.map((item) => {
          const current = step === item.id;
          const done = step > item.id;
          const body = (
            <>
              <span className={cn("block h-1 transition-colors", current || done ? "bg-foreground" : "bg-border")} />
              <span className={cn("mt-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]", current || done ? "text-foreground" : "text-muted-foreground")}>
                {done && <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />}
                {item.title}
              </span>
            </>
          );
          return (
            <li key={item.id}>
              {done ? (
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className="block w-full text-left"
                  aria-label="Back to your details"
                  data-testid={`button-signup-step-${item.id}`}
                >
                  {body}
                </button>
              ) : (
                <div aria-current={current ? "step" : undefined} data-testid={`signup-step-${item.id}`}>
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
