import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useLocation } from "wouter";
import { openAuth, type AuthView } from "@/lib/auth-dialog";

/** Opens the trade-account dialog instead of navigating to a sign-in page. */
export function AuthOpen({
  view,
  next,
  children,
  className,
  testId,
  onOpen,
  ...props
}: {
  view: AuthView;
  next?: string;
  children: ReactNode;
  className?: string;
  testId?: string;
  onOpen?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">) {
  const [location] = useLocation();
  return (
    <button
      type="button"
      className={className}
      data-testid={testId}
      onClick={() => {
        openAuth(view, { next: next ?? location });
        onOpen?.();
      }}
      {...props}
    >
      {children}
    </button>
  );
}
