import type { ReactNode } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { cn } from "@/lib/utils";

/**
 * Shared desk for trade sign-in and sign-up. The left column states what the
 * account is; the form sits on the right like a specification sheet.
 */
export function AccountAuthShell({
  eyebrow,
  title,
  lede,
  aside,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <MainLayout>
      <section className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-12 md:px-12 md:pt-20" data-testid="section-account-auth">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            <h1 className="mt-5 max-w-[12ch] font-display text-[clamp(2.75rem,5.5vw,5.5rem)] font-medium leading-[0.9] tracking-[-0.045em]">
              {title}
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">{lede}</p>
            {aside}
          </div>
          <div className="lg:col-span-5 lg:col-start-8">{children}</div>
        </div>
      </section>
    </MainLayout>
  );
}

/** A filled box. The whole rectangle is the control, with room to type and a clear focus edge. */
export const authControl =
  "h-12 w-full border border-border bg-muted/70 px-3.5 text-base text-foreground outline-none transition-[border-color,background-color,box-shadow] placeholder:text-muted-foreground hover:border-foreground/25 focus:border-primary focus:bg-background focus-visible:ring-2 focus-visible:ring-foreground/10";

const authLabel = "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors group-focus-within:text-primary";

function FieldLabel({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <span className={authLabel}>
      {label}
      {optional && <span className="ml-2 font-normal normal-case tracking-normal text-muted-foreground/80">Optional</span>}
    </span>
  );
}

export function AuthSelect({
  label,
  name,
  defaultValue,
  options,
  placeholder = "Select",
  optional,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  optional?: boolean;
}) {
  return (
    <label className="group block">
      <FieldLabel label={label} optional={optional} />
      <select name={name} defaultValue={defaultValue} className={cn(authControl, "mt-2 cursor-pointer")}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AuthField({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  optional,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="group block">
      <FieldLabel label={label} optional={optional} />
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        data-testid={`input-auth-${name}`}
        className={cn(authControl, "mt-2")}
      />
    </label>
  );
}

export function AuthSubmit({ children, pending, testId }: { children: ReactNode; pending?: boolean; testId?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      data-testid={testId ?? "button-auth-submit"}
      className="inline-flex h-12 w-full items-center justify-center bg-foreground px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background transition-[background-color,transform] hover:bg-primary hover:text-primary-foreground active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
