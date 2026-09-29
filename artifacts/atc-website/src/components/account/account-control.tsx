import { useEffect, useRef, useState } from "react";
import { useAuth, useClerk, useUser } from "@clerk/react";
import { Inbox, LayoutGrid, LogOut, Settings, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";
import { AuthOpen } from "@/components/account/auth-open";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useTradeSession } from "@/hooks/use-trade-session";
import { publicEnv } from "@/lib/env";
import { cn } from "@/lib/utils";

const ACCOUNT_LINKS = [
  { href: "/account", label: "Overview", detail: "Shortlists and recent enquiries", icon: LayoutGrid },
  { href: "/account/profile", label: "Profile", detail: "Company, role and email", icon: UserRound },
  { href: "/account/inquiries", label: "Enquiries", detail: "Status of what you sent", icon: Inbox },
  { href: "/account/settings", label: "Settings", detail: "Password and signing out", icon: Settings },
] as const;

function accountLinkActive(location: string, href: string) {
  const path = location.split("?")[0] ?? location;
  if (href === "/account") return path === "/account";
  return path === href || path.startsWith(`${href}/`);
}

function MenuPanel({
  isSignedIn,
  email,
  onClose,
  onSignOut,
}: {
  isSignedIn: boolean;
  email?: string;
  onClose: () => void;
  onSignOut?: () => void;
}) {
  const [location] = useLocation();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  return (
    <div
      className="fixed inset-x-4 top-[4.75rem] z-50 max-h-[min(32rem,calc(100dvh-6rem))] overflow-y-auto border border-border bg-background text-foreground shadow-[0_18px_40px_-24px_rgba(26,18,18,0.45)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80"
      role="menu"
      data-testid="menu-account"
    >
      {isSignedIn ? (
        <>
          <div className="border-b border-border px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Trade account</p>
            {email && <p className="mt-1 truncate text-sm">{email}</p>}
          </div>
          <ul>
            {ACCOUNT_LINKS.map((item) => {
              const active = accountLinkActive(location, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    role="menuitem"
                    aria-current={active ? "page" : undefined}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-foreground/5",
                      active && "bg-foreground/5",
                    )}
                    data-testid={`link-account-menu-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{item.label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{item.detail}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            role="menuitem"
            onClick={() => setConfirmSignOut(true)}
            className="flex w-full items-center gap-3 border-t border-border px-4 py-3.5 text-left text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            data-testid="button-account-menu-sign-out"
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
            Sign out
          </button>
          <ConfirmDialog
            open={confirmSignOut}
            onOpenChange={setConfirmSignOut}
            title="Sign out?"
            description="This ends the session on this device. You can sign in again at any time."
            confirmLabel="Sign out"
            onConfirm={() => {
              onClose();
              onSignOut?.();
            }}
            testId="dialog-sign-out"
            confirmTestId="button-confirm-sign-out"
          />
        </>
      ) : (
        <div className="p-2">
          <AuthOpen
            view="sign-in"
            role="menuitem"
            onOpen={onClose}
            className="block w-full px-3 py-3 text-left text-sm font-medium hover:bg-foreground/5"
            testId="link-account-menu-sign-in"
          >
            Sign in
          </AuthOpen>
          <AuthOpen
            view="sign-up"
            role="menuitem"
            onOpen={onClose}
            className="block w-full px-3 py-3 text-left text-sm font-medium hover:bg-foreground/5"
            testId="link-account-menu-sign-up"
          >
            Open a trade account
          </AuthOpen>
        </div>
      )}
    </div>
  );
}

function AccountMenu({
  isLoaded,
  isSignedIn,
  label,
  email,
  onSignOut,
}: {
  isLoaded: boolean;
  isSignedIn: boolean;
  label: string;
  email?: string;
  onSignOut?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const root = useRef<HTMLDivElement>(null);
  const active = location.startsWith("/account");

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  if (!isLoaded) return <span className="hidden h-11 w-11 sm:block" aria-hidden />;

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-current={active ? "page" : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "group relative flex h-11 w-11 items-center justify-center transition-colors",
          active || open ? "text-primary" : "text-foreground hover:text-primary",
        )}
        data-testid="link-nav-account"
      >
        <UserRound className="h-5 w-5" strokeWidth={1.4} />
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 top-full z-40 mt-2 hidden -translate-x-1/2 whitespace-nowrap bg-foreground px-2.5 py-1.5 text-[11px] font-medium tracking-normal text-background sm:block",
            open ? "sm:hidden" : "sm:opacity-0 sm:transition-opacity sm:duration-150 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100",
          )}
        >
          {label}
        </span>
      </button>
      {open && (
        <MenuPanel isSignedIn={isSignedIn} email={email} onClose={() => setOpen(false)} onSignOut={onSignOut} />
      )}
    </div>
  );
}

function ClerkControl() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const email = user?.primaryEmailAddress?.emailAddress;
  return (
    <AccountMenu
      isLoaded={isLoaded}
      isSignedIn={Boolean(isSignedIn)}
      label={isSignedIn ? (email ?? "Account") : "Trade account"}
      email={email}
      onSignOut={() => void signOut({ redirectUrl: "/" })}
    />
  );
}

function LocalControl() {
  const { isLoaded, isSignedIn, email, signOut } = useTradeSession();
  const [, setLocation] = useLocation();
  return (
    <AccountMenu
      isLoaded={isLoaded}
      isSignedIn={isSignedIn}
      label={isSignedIn ? email || "Account" : "Trade account"}
      email={email}
      onSignOut={() => {
        signOut();
        setLocation("/");
      }}
    />
  );
}

export function AccountControl() {
  return publicEnv.clerkIsConfigured ? <ClerkControl /> : <LocalControl />;
}

function MobileLinks({
  isSignedIn,
  email,
  onNavigate,
  onSignOut,
}: {
  isSignedIn: boolean;
  email?: string;
  onNavigate: () => void;
  onSignOut?: () => void;
}) {
  const [location] = useLocation();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  if (!isSignedIn) {
    return (
      <div className="mt-4 grid grid-cols-2 gap-3">
        <AuthOpen
          view="sign-in"
          onOpen={onNavigate}
          className="flex h-12 items-center justify-center border border-foreground/25 text-sm font-medium"
          testId="link-mobile-account"
        >
          Sign in
        </AuthOpen>
        <AuthOpen
          view="sign-up"
          onOpen={onNavigate}
          className="flex h-12 items-center justify-center border border-foreground/25 text-sm font-medium"
          testId="link-mobile-account-signup"
        >
          Trade account
        </AuthOpen>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-foreground/15 pt-3">
      {email && <p className="truncate px-1 pb-2 text-sm text-foreground/70">{email}</p>}
      <ul>
        {ACCOUNT_LINKS.map((item) => {
          const active = accountLinkActive(location, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn("flex min-h-11 flex-col justify-center py-2 text-sm", active ? "text-primary" : "text-foreground")}
                data-testid={
                  item.href === "/account"
                    ? "link-mobile-account"
                    : item.href === "/account/inquiries"
                      ? "link-mobile-account-inquiries"
                      : `link-mobile-account-${item.label.toLowerCase()}`
                }
              >
                {item.label}
                <span className="text-xs text-foreground/50">{item.detail}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => setConfirmSignOut(true)}
        className="mt-1 flex min-h-11 w-full items-center text-sm text-foreground/70"
        data-testid="button-mobile-account-sign-out"
      >
        Sign out
      </button>
      <ConfirmDialog
        open={confirmSignOut}
        onOpenChange={setConfirmSignOut}
        title="Sign out?"
        description="This ends the session on this device. You can sign in again at any time."
        confirmLabel="Sign out"
        onConfirm={() => {
          onNavigate();
          onSignOut?.();
        }}
        testId="dialog-sign-out"
        confirmTestId="button-confirm-sign-out"
      />
    </div>
  );
}

function ClerkMobile({ onNavigate }: { onNavigate: () => void }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  if (!isLoaded) return null;
  return (
    <MobileLinks
      isSignedIn={Boolean(isSignedIn)}
      email={user?.primaryEmailAddress?.emailAddress}
      onNavigate={onNavigate}
      onSignOut={() => void signOut({ redirectUrl: "/" })}
    />
  );
}

function LocalMobile({ onNavigate }: { onNavigate: () => void }) {
  const { isSignedIn, email, signOut } = useTradeSession();
  const [, setLocation] = useLocation();
  return (
    <MobileLinks
      isSignedIn={isSignedIn}
      email={email}
      onNavigate={onNavigate}
      onSignOut={() => {
        signOut();
        setLocation("/");
      }}
    />
  );
}

export function MobileAccountLink({ onNavigate }: { onNavigate: () => void }) {
  return publicEnv.clerkIsConfigured ? <ClerkMobile onNavigate={onNavigate} /> : <LocalMobile onNavigate={onNavigate} />;
}
