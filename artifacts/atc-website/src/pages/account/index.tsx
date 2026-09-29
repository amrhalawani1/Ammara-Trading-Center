import { Link } from "wouter";
import { ArrowRight, FolderHeart, Inbox, Package, type LucideIcon } from "lucide-react";
import { AccountFrame } from "@/components/account/account-frame";
import { InquiryRows } from "@/components/account/inquiry-rows";
import { useShortlists } from "@/hooks/use-shortlists";
import { roleLabel } from "@/lib/trade-session";
import { cn } from "@/lib/utils";

export default function AccountPage() {
  const { lists } = useShortlists();
  const savedCount = lists.reduce((sum, list) => sum + list.items.length, 0);

  return (
    <AccountFrame
      section="overview"
      title="Your trade account"
      lede="Shortlists stay with this account. Enquiries you send while signed in appear here with their status."
    >
      {({ profile, inquiries }) => {
        const openCount = inquiries.filter((inquiry) => inquiry.status !== "responded").length;
        return (
          <div className="space-y-12">
            <div className="grid gap-px bg-border sm:grid-cols-3">
              <Stat href="/lists" icon={FolderHeart} label="Shortlists" value={lists.length} detail={lists.length === 1 ? lists[0]?.name ?? "One list" : lists.length === 0 ? "None yet" : `${lists.length} lists on this account`} testId="link-account-stat-lists" />
              <Stat href="/lists" icon={Package} label="Products saved" value={savedCount} detail={savedCount === 0 ? "Save a product while you browse" : "Across your shortlists"} />
              <Stat
                href="/account/inquiries"
                icon={Inbox}
                label="Enquiries"
                value={inquiries.length}
                detail={inquiries.length === 0 ? "None filed yet" : openCount === 0 ? "All replied" : `${openCount} still open`}
                testId="link-account-stat-inquiries"
              />
            </div>

            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <section className="border border-border p-6 md:p-8 lg:col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">On file</p>
                <dl className="mt-6 space-y-6">
                  <Fact label="Company" value={profile.company || "Not added"} />
                  <Fact label="Role" value={roleLabel(profile.role)} muted={!profile.role} />
                  <Fact label="Email" value={profile.email} />
                </dl>
                {!profile.role && (
                  <p className="mt-6 text-sm leading-6 text-muted-foreground">
                    Add your company and role so we can send your enquiries to the right consultant.
                  </p>
                )}
                <Link
                  href="/account/profile"
                  className="mt-8 inline-flex h-11 items-center gap-2 bg-foreground px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-background"
                  data-testid="link-overview-profile"
                >
                  Edit profile <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
              </section>

              <div className="space-y-12 lg:col-span-8">
                <section>
                  <div className="flex items-end justify-between gap-4">
                    <h2 className="font-display text-3xl font-medium tracking-[-0.03em]">Shortlists</h2>
                    <Link href="/lists" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground" data-testid="link-account-lists">
                      View shortlists
                    </Link>
                  </div>
                  {lists.length === 0 ? (
                    <p className="mt-6 border-t border-border py-6 text-sm text-muted-foreground">
                      No shortlists yet. Save a product while you browse.
                    </p>
                  ) : (
                    <ul className="mt-6 border border-border" data-testid="list-account-shortlists">
                      {lists.map((list) => (
                        <li key={list.id} className="border-b border-border last:border-b-0">
                          <Link href="/lists" className="flex items-end justify-between gap-4 px-5 py-6 transition-colors hover:bg-tile">
                            <p className="font-display text-2xl font-medium tracking-[-0.03em]">{list.name}</p>
                            <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
                              {list.items.length} {list.items.length === 1 ? "product" : "products"}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <div className="flex items-end justify-between gap-4">
                    <h2 className="font-display text-3xl font-medium tracking-[-0.03em]">Recent enquiries</h2>
                    <Link href="/account/inquiries" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground">
                      All enquiries
                    </Link>
                  </div>
                  <div className="mt-6">
                    <InquiryRows inquiries={inquiries.slice(0, 4)} />
                  </div>
                </section>
              </div>
            </div>
          </div>
        );
      }}
    </AccountFrame>
  );
}

function Stat({
  href,
  icon: Icon,
  label,
  value,
  detail,
  testId,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  value: number;
  detail: string;
  testId?: string;
}) {
  return (
    <Link href={href} className="group bg-background px-6 py-7 transition-colors hover:bg-foreground hover:text-background" data-testid={testId}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground group-hover:text-background/60">{label}</p>
        <Icon className="h-5 w-5 text-foreground/70 group-hover:text-background" strokeWidth={1.75} aria-hidden />
      </div>
      <p className="mt-5 font-display text-6xl font-medium leading-none tracking-[-0.045em]">{value}</p>
      <p className="mt-4 text-sm text-muted-foreground group-hover:text-background/70">{detail}</p>
    </Link>
  );
}

function Fact({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd className={cn("mt-1.5 text-lg", muted && "text-muted-foreground")}>{value}</dd>
    </div>
  );
}
