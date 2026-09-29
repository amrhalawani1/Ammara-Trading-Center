import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const STATUS_LABEL: Record<string, string> = {
  submitted: "Received",
  in_progress: "In progress",
  responded: "Replied",
};

const KIND_LABEL: Record<string, string> = {
  general: "General",
  shortlist: "Shortlist",
  newsletter: "Newsletter",
};

export type DeskInquiry = {
  id: number | string;
  reference?: string | null;
  kind: string;
  listName?: string | null;
  message?: string | null;
  createdAt: string;
  status: string;
};

function filedOn(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function InquiryBody({ inquiry }: { inquiry: DeskInquiry }) {
  const message = inquiry.message?.trim() ?? "";
  return (
    <div className="mt-4 border border-border bg-muted/30 px-5 py-4" data-testid="inquiry-content">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Your message</p>
      {inquiry.listName && (
        <p className="mt-2 text-sm text-foreground">
          Shortlist · {inquiry.listName}
        </p>
      )}
      {message ? (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-foreground">{message}</p>
      ) : (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">No message included.</p>
      )}
    </div>
  );
}

export function InquiryRows({
  inquiries,
  reveal = false,
}: {
  inquiries: DeskInquiry[];
  reveal?: boolean;
}) {
  if (inquiries.length === 0) {
    return (
      <div className="border-t border-border py-8" data-testid="empty-account-inquiries">
        <p className="text-sm text-muted-foreground">No enquiries on this account yet.</p>
        <Link href="/contact" className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.16em] text-primary" data-testid="link-account-contact">
          Send an enquiry
        </Link>
      </div>
    );
  }

  return (
    <ul className="border-t border-border" data-testid="list-account-inquiries">
      {inquiries.map((inquiry) => (
        <li key={inquiry.id} className="border-b border-border">
          {reveal ? (
            <div className="py-5">
              <InquiryHead inquiry={inquiry} />
              <InquiryBody inquiry={inquiry} />
            </div>
          ) : (
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <InquiryHead inquiry={inquiry} />
                <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" strokeWidth={1.5} />
              </summary>
              <InquiryBody inquiry={inquiry} />
            </details>
          )}
        </li>
      ))}
    </ul>
  );
}

function InquiryHead({ inquiry }: { inquiry: DeskInquiry }) {
  return (
    <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-center">
      <p className="font-mono text-sm tabular-nums">{inquiry.reference ?? "—"}</p>
      <div className="min-w-0">
        <p className="text-sm">
          {KIND_LABEL[inquiry.kind] ?? inquiry.kind}
          <span className="text-muted-foreground"> · {filedOn(inquiry.createdAt)}</span>
        </p>
        {inquiry.listName && <p className="truncate text-xs text-muted-foreground">{inquiry.listName}</p>}
      </div>
      <StatusChip status={inquiry.status} />
    </div>
  );
}

export function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit items-center px-2 text-[10px] font-semibold uppercase tracking-[0.14em]",
        status === "responded" && "bg-foreground text-background",
        status === "in_progress" && "bg-primary text-primary-foreground",
        status !== "responded" && status !== "in_progress" && "border border-border text-muted-foreground",
      )}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
