import { useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { openAuth } from "@/lib/auth-dialog";
import { useTradeSession } from "@/hooks/use-trade-session";
import { readNextParam, safeAccountNext } from "@/lib/account-return";
import { publicEnv } from "@/lib/env";
import { roleLabel } from "@/lib/trade-session";

export default function AccountWelcomePage() {
  if (publicEnv.clerkIsConfigured) return <Redirect to="/account" />;
  return <WelcomeDesk />;
}

function WelcomeDesk() {
  const { isSignedIn, profile, welcome, clearWelcome } = useTradeSession();
  const [, setLocation] = useLocation();
  const next = safeAccountNext(readNextParam() === "/account/welcome" ? "/account" : readNextParam());

  if (!isSignedIn || !profile) return <WelcomeSignIn />;

  const continueTo = () => {
    clearWelcome();
    setLocation(next === "/account/welcome" ? "/account" : next);
  };

  return (
    <MainLayout>
      <section className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-12 md:px-12 md:pt-20" data-testid="section-account-welcome">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Trade account</p>
        <h1 className="mt-5 max-w-[14ch] font-display text-[clamp(2.75rem,5.5vw,5.5rem)] font-medium leading-[0.9] tracking-[-0.045em]">
          Your trade account is ready.
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
          {profile.name || "This account"} · {profile.email}
          {profile.company ? ` · ${profile.company}` : ""}
          {profile.role ? ` · ${roleLabel(profile.role)}` : ""}
        </p>

        <ol className="mt-14 max-w-xl space-y-0 border-t border-border">
          <Step href="/lists" label="View shortlists" copy="Shortlists saved on this device stay on this device." />
          <Step href="/contact" label="Send an enquiry" copy="Your name and email are filled in for you. Each enquiry you send appears in your account." />
          <Step href="/account/profile" label="Finish the profile" copy={welcome && !profile.role ? "Add your company and role so we can send your enquiries to the right consultant." : "Company and role can be edited any time."} />
        </ol>

        <button
          type="button"
          onClick={continueTo}
          className="mt-12 inline-flex h-12 items-center bg-foreground px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background"
          data-testid="button-welcome-continue"
        >
          Go to your account
        </button>
      </section>
    </MainLayout>
  );
}

function WelcomeSignIn() {
  useEffect(() => {
    openAuth("sign-in", { next: "/account/welcome" });
  }, []);
  return <Redirect to="/" />;
}

function Step({ href, label, copy }: { href: string; label: string; copy: string }) {
  const { clearWelcome } = useTradeSession();
  const [, setLocation] = useLocation();
  return (
    <li className="border-b border-border py-6">
      <button
        type="button"
        onClick={() => {
          clearWelcome();
          setLocation(href);
        }}
        className="text-left"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{label}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
      </button>
    </li>
  );
}
