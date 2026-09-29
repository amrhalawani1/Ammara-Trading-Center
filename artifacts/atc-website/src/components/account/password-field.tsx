import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { scorePassword } from "@/lib/password-strength";
import { cn } from "@/lib/utils";
import { authControl } from "./auth-shell";
import { FORM_MESSAGES } from "@/lib/form-messages";

const TONE_BAR: Record<string, string> = {
  idle: "bg-border",
  weak: "bg-primary",
  fair: "bg-foreground/45",
  strong: "bg-foreground",
  specified: "bg-foreground",
};

const TONE_TEXT: Record<string, string> = {
  idle: "text-muted-foreground",
  weak: "text-primary",
  fair: "text-foreground/70",
  strong: "text-foreground",
  specified: "text-foreground",
};

export function AuthPasswordField({
  label,
  name,
  autoComplete,
  required,
  strength = false,
  matchAgainst,
  onValueChange,
}: {
  label: string;
  name: string;
  autoComplete?: string;
  required?: boolean;
  /** Live meter and checks for a new password. Off for sign-in. */
  strength?: boolean;
  /** When set, the field is a confirmation and shows match state. */
  matchAgainst?: string;
  onValueChange?: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const inputId = useId();
  const meterId = useId();
  const score = strength ? scorePassword(value) : null;
  const filled = value.length > 0;
  const confirms = matchAgainst !== undefined;
  const matches = confirms && filled && value === matchAgainst;

  return (
    <div className="block">
      <label htmlFor={inputId} className="group block">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors group-focus-within:text-primary">
          {label}
        </span>
        <span className="relative mt-2 block">
          <input
            id={inputId}
            name={name}
            type={visible ? "text" : "password"}
            autoComplete={autoComplete}
            required={required}
            value={value}
            minLength={strength ? 8 : undefined}
            onChange={(event) => {
              const next = event.target.value;
              setValue(next);
              onValueChange?.(next);
            }}
            aria-describedby={strength ? meterId : undefined}
            aria-invalid={confirms && filled && !matches ? true : undefined}
            data-testid={`input-auth-${name}`}
            className={cn(authControl, "pr-11", confirms && filled && !matches && "border-primary focus:border-primary")}
          />
          <button
            type="button"
            onClick={() => setVisible((open) => !open)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
            data-testid={`button-password-toggle-${name}`}
          >
            {visible ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
          </button>
        </span>
      </label>

      {strength && score && (
        <div id={meterId} className="mt-3" data-testid="password-strength">
          <div className="flex gap-1" aria-hidden>
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={cn(
                  "h-0.5 flex-1 transition-colors duration-200",
                  score.score >= step ? TONE_BAR[score.tone] : "bg-border",
                )}
              />
            ))}
          </div>
          <p className={cn("mt-2 text-[11px] font-semibold uppercase tracking-[0.16em]", TONE_TEXT[score.tone])}>
            {filled ? score.label : "Strength"}
          </p>
          <ul className="mt-3 space-y-1.5">
            {score.checks.map((check) => (
              <li
                key={check.id}
                className={cn(
                  "flex items-center gap-2 text-xs transition-colors",
                  check.ok ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn("h-1 w-1 rounded-full", check.ok ? "bg-foreground" : "bg-border")}
                />
                {check.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {confirms && filled && (
        <p
          className={cn("mt-2 text-xs", matches ? "text-muted-foreground" : "text-primary")}
          role="status"
          data-testid="text-password-match"
        >
          {matches ? "Passwords match." : FORM_MESSAGES.passwordMismatch}
        </p>
      )}
    </div>
  );
}
