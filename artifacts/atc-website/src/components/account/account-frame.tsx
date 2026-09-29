import { useEffect, type ReactNode } from "react";
import { useAuth, useClerk, useUser } from "@clerk/react";
import { Inbox, LayoutGrid, Settings, UserRound, type LucideIcon } from "lucide-react";
import { Link, Redirect, useLocation } from "wouter";
import {
  getGetAccountInquiriesQueryKey,
  getGetAccountProfileQueryKey,
  useGetAccountInquiries,
  useGetAccountProfile,
  usePutAccountProfile,
} from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { useTradeInquiries } from "@/hooks/use-trade-inquiries";
import { useTradeSession } from "@/hooks/use-trade-session";
import { AuthOpen } from "@/components/account/auth-open";
import { openAuth } from "@/lib/auth-dialog";
import { publicEnv } from "@/lib/env";
import { roleLabel, type TradeProfile } from "@/lib/trade-session";
import { cn } from "@/lib/utils";
import type { DeskInquiry } from "./inquiry-rows";

const NAV: { href: string; id: AccountSection; label: string; icon: LucideIcon }[] = [
  { href: "/account", id: "overview", label: "Overview", icon: LayoutGrid },
  { href: "/account/profile", id: "profile", label: "Profile", icon: UserRound },
  { href: "/account/inquiries", id: "inquiries", label: "Enquiries", icon: Inbox },
  { href: "/account/settings", id: "settings", label: "Settings", icon: Settings },
];

export type AccountSection = "overview" | "profile" | "inquiries" | "settings";

export type AccountContext = {
  profile: TradeProfile;
  inquiries: DeskInquiry[];
  saving: boolean;
  isLocal: boolean;
  saveProfile: (profile: TradeProfile) => void;
  signOut: () => void;
};

export function AccountFrame({
  section,
  title,
  children,
}: {
  section: AccountSection;
  title: string;
  /** Kept so existing pages can pass a line; the desk bar no longer prints it. */
  lede?: string;
  children: (ctx: AccountContext) => ReactNode;
}) {
  return publicEnv.clerkIsConfigured ? (
    <ClerkAccountFrame section={section} title={title}>
      {children}
    </ClerkAccountFrame>
  ) : (
    <LocalAccountFrame section={section} title={title}>
      {children}
    </LocalAccountFrame>
  );
}

function Shell({
  section,
  title,
  profile,
  inquiryCount,
  children,
}: {
  section: AccountSection;
  title: string;
  profile: TradeProfile;
  inquiryCount: number;
  children: ReactNode;
}) {
  const name = profile.name.trim();
  const facts = [profile.company.trim(), profile.role ? roleLabel(profile.role) : "", profile.email].filter(Boolean);
  return (
    <MainLayout>
      <div data-testid="section-account-desk">
        <header className="dark bg-background text-foreground">
          <div className="mx-auto w-full max-w-[1440px] px-6 py-12 md:px-12 md:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Trade account</p>
            <h1 className="mt-4 max-w-[14ch] font-display text-[clamp(3rem,6vw,5.75rem)] font-medium leading-[0.88] tracking-[-0.045em]">
              {name || profile.email}
            </h1>
            {facts.length > 0 && <p className="mt-5 max-w-xl text-sm leading-6 text-foreground/70">{facts.join(" · ")}</p>}
          </div>
        </header>
        <nav className="border-b border-border" aria-label="Account">
          <div className="mx-auto flex w-full max-w-[1440px] gap-1 overflow-x-auto px-4 md:px-10">
            {NAV.map((item) => {
              const active = item.id === section;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
                    active ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                  data-testid={`link-account-nav-${item.id}`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  {item.label}
                  {item.id === "inquiries" && inquiryCount > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center bg-primary px-1 font-mono text-[10px] tabular-nums text-primary-foreground">
                      {inquiryCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-10 md:px-12">
          {section !== "overview" && (
            <h2 className="mb-8 font-display text-3xl font-medium tracking-[-0.03em] md:text-4xl">{title.replace(/\.$/, "")}</h2>
          )}
          {children}
        </div>
      </div>
    </MainLayout>
  );
}

function LocalAccountFrame({
  section,
  title,
  children,
}: {
  section: AccountSection;
  title: string;
  children: (ctx: AccountContext) => ReactNode;
}) {
  const { isSignedIn, profile, welcome, saveProfile, signOut } = useTradeSession();
  const { inquiries } = useTradeInquiries();
  const [, setLocation] = useLocation();

  if (!isSignedIn || !profile) return <AuthRequired />;
  if (welcome) return <Redirect to="/account/welcome" />;

  return (
    <Shell section={section} title={title} profile={profile} inquiryCount={inquiries.length}>
      {children({
        profile,
        inquiries,
        saving: false,
        isLocal: true,
        saveProfile,
        signOut: () => {
          signOut();
          setLocation("/");
        },
      })}
    </Shell>
  );
}

function ClerkAccountFrame({
  section,
  title,
  children,
}: {
  section: AccountSection;
  title: string;
  children: (ctx: AccountContext) => ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const profileQuery = useGetAccountProfile({
    query: { queryKey: getGetAccountProfileQueryKey(), enabled: Boolean(isSignedIn) },
  });
  const inquiriesQuery = useGetAccountInquiries({
    query: { queryKey: getGetAccountInquiriesQueryKey(), enabled: Boolean(isSignedIn) },
  });
  const putProfile = usePutAccountProfile();

  useEffect(() => {
    if (!user || !profileQuery.data || profileQuery.data.email) return;
    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;
    putProfile.mutate({ data: { email, name: user.fullName ?? null, company: null, role: null } });
  }, [user, profileQuery.data, putProfile]);

  if (!isLoaded) return <div className="min-h-[50vh] bg-background" />;
  if (!isSignedIn) return <AuthRequired />;

  const profile: TradeProfile = {
    email: profileQuery.data?.email || user?.primaryEmailAddress?.emailAddress || "",
    name: profileQuery.data?.name ?? user?.fullName ?? "",
    company: profileQuery.data?.company ?? "",
    role: profileQuery.data?.role ?? "",
  };

  return (
    <Shell section={section} title={title} profile={profile} inquiryCount={(inquiriesQuery.data ?? []).length}>
      {children({
        profile,
        inquiries: (inquiriesQuery.data ?? []).map((inquiry) => ({
          id: inquiry.id,
          reference: inquiry.reference ?? null,
          kind: inquiry.kind,
          listName: inquiry.listName ?? null,
          message: inquiry.message,
          createdAt: inquiry.createdAt,
          status: inquiry.status,
        })),
        saving: putProfile.isPending,
        isLocal: false,
        saveProfile: (next) => {
          putProfile.mutate({
            data: {
              email: next.email,
              name: next.name || null,
              company: next.company || null,
              role: next.role || null,
            },
          });
        },
        signOut: () => signOut({ redirectUrl: "/" }),
      })}
    </Shell>
  );
}

function AuthRequired() {
  useEffect(() => {
    openAuth("sign-in", { next: "/account" });
  }, []);

  return (
    <MainLayout>
      <section className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-12 md:px-12 md:pt-20" data-testid="section-account-required">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Trade account</p>
        <h1 className="mt-5 max-w-[12ch] font-display text-[clamp(2.75rem,5.5vw,5.5rem)] font-medium leading-[0.9] tracking-[-0.045em]">
          Sign in to your trade account.
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
          See your shortlists and the status of your enquiries. You do not need an account to save a shortlist or send an enquiry.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <AuthOpen
            view="sign-in"
            next="/account"
            className="inline-flex h-12 items-center bg-foreground px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background"
            testId="button-account-required-signin"
          >
            Sign in
          </AuthOpen>
          <AuthOpen
            view="sign-up"
            next="/account"
            className="inline-flex h-12 items-center px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground"
            testId="button-account-required-signup"
          >
            Open a trade account
          </AuthOpen>
        </div>
      </section>
    </MainLayout>
  );
}
