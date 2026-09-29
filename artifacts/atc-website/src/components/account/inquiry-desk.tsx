import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Check, Copy, Search } from "lucide-react";
import { StatusChip, STATUS_LABEL, type DeskInquiry } from "@/components/account/inquiry-rows";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<string, string> = {
  general: "General",
  shortlist: "Shortlist",
  newsletter: "Newsletter",
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "submitted", label: "Received" },
  { id: "in_progress", label: "In progress" },
  { id: "responded", label: "Replied" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

type LineItem = {
  title: string;
  itemNo: string;
  finish: string;
  qty: string;
};

function filedOn(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function subjectOf(inquiry: DeskInquiry) {
  if (inquiry.listName?.trim()) return inquiry.listName.trim();
  const line = inquiry.message?.split("\n").map((part) => part.trim()).find(Boolean) ?? "";
  const stripped = line.replace(/^Project:\s*/, "").replace(/^•\s*/, "");
  return stripped || (KIND_LABEL[inquiry.kind] ?? "Enquiry");
}

function parseItem(line: string): LineItem {
  const parts = line.replace(/^•\s*/, "").split(" — ");
  let qty = "";
  if (parts.at(-1)?.startsWith("Qty ")) qty = parts.pop()?.replace(/^Qty\s*/, "") ?? "";
  const itemIdx = parts.findIndex((part) => part.startsWith("Item no. "));
  if (itemIdx === -1) return { title: parts.join(" — "), itemNo: "", finish: "", qty };
  return {
    title: parts.slice(0, itemIdx).join(" — "),
    itemNo: parts[itemIdx].replace(/^Item no\.\s*/, ""),
    finish: parts.slice(itemIdx + 1).join(" — "),
    qty,
  };
}

function parseMessage(message: string) {
  const lines = message.split("\n").map((line) => line.trim()).filter(Boolean);
  const notesAt = lines.findIndex((line) => line.startsWith("Notes:"));
  const body = notesAt === -1 ? lines : lines.slice(0, notesAt);
  const notes = notesAt === -1 ? "" : lines.slice(notesAt).join("\n").replace(/^Notes:\s*/, "");
  const items = body.filter((line) => line.startsWith("•")).map(parseItem);
  const prose = body.filter((line) => !line.startsWith("•") && !line.startsWith("Project:")).join("\n");
  return { items, notes, prose };
}

export function InquiryDesk({ inquiries }: { inquiries: DeskInquiry[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [selectedId, setSelectedId] = useState<DeskInquiry["id"] | null>(null);
  const [reading, setReading] = useState(false);

  const counts = useMemo(() => {
    const tally: Record<FilterId, number> = { all: inquiries.length, submitted: 0, in_progress: 0, responded: 0 };
    for (const inquiry of inquiries) {
      if (inquiry.status in tally) tally[inquiry.status as FilterId] += 1;
    }
    return tally;
  }, [inquiries]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inquiries.filter((inquiry) => {
      if (filter !== "all" && inquiry.status !== filter) return false;
      if (!needle) return true;
      const haystack = [inquiry.reference, inquiry.listName, inquiry.message, KIND_LABEL[inquiry.kind], STATUS_LABEL[inquiry.status]]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [inquiries, filter, query]);

  const selected = visible.find((inquiry) => inquiry.id === selectedId) ?? visible[0] ?? null;
  const openCount = inquiries.filter((inquiry) => inquiry.status !== "responded").length;

  if (inquiries.length === 0) {
    return (
      <div className="border border-border px-6 py-10" data-testid="empty-account-inquiries">
        <p className="font-display text-2xl font-medium tracking-[-0.03em]">No enquiries yet</p>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          When you send a shortlist or write from the contact page, it appears here with its status.
        </p>
        <Link href="/contact" className="mt-6 inline-flex h-11 items-center bg-foreground px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-background" data-testid="link-account-contact">
          Send an enquiry
        </Link>
      </div>
    );
  }

  const openRow = (inquiry: DeskInquiry) => {
    setSelectedId(inquiry.id);
    setReading(true);
  };

  return (
    <div data-testid="inquiry-desk">
      <p className="text-sm text-muted-foreground">
        <span className="font-mono tabular-nums text-foreground">{inquiries.length}</span> {inquiries.length === 1 ? "enquiry" : "enquiries"}
        <span aria-hidden> · </span>
        <span className="font-mono tabular-nums text-foreground">{openCount}</span> still open
      </p>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search enquiries</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search reference, project or product"
            className="h-11 w-full border border-border bg-background pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            data-testid="input-inquiry-search"
          />
        </label>
        <div className="flex flex-wrap" role="group" aria-label="Filter by status">
          {FILTERS.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "inline-flex h-11 items-center gap-2 border border-border px-3 text-[11px] font-semibold uppercase tracking-[0.14em] -ml-px first:ml-0",
                  active ? "relative z-[1] border-foreground bg-foreground text-background" : "bg-background text-muted-foreground hover:text-foreground",
                )}
                data-testid={`button-inquiry-filter-${item.id}`}
              >
                {item.label}
                <span className={cn("font-mono text-[10px] tabular-nums", active ? "text-background/70" : "text-muted-foreground")}>{counts[item.id]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 border border-border px-6 py-10" data-testid="empty-inquiry-filter">
          <p className="text-sm text-foreground">Nothing matches this search.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
            data-testid="button-inquiry-clear"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 lg:grid lg:grid-cols-[minmax(28rem,0.9fr)_minmax(0,1.15fr)] lg:items-start lg:gap-8">
          <div className={cn("border border-border", reading && "hidden lg:block")} data-testid="list-account-inquiries">
            <div className="hidden grid-cols-[9.5rem_minmax(0,1fr)_7rem_6.5rem] border-b border-border bg-muted/40 py-2.5 pl-[19px] pr-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground md:grid">
              <span>Reference</span>
              <span>Enquiry</span>
              <span>Filed</span>
              <span className="text-right">Status</span>
            </div>
            <ul>
              {visible.map((inquiry) => {
                const active = selected?.id === inquiry.id;
                const parsed = parseMessage(inquiry.message ?? "");
                return (
                  <li key={inquiry.id} className="border-b border-border last:border-b-0">
                    <button
                      type="button"
                      onClick={() => openRow(inquiry)}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "grid w-full gap-2 px-4 py-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring md:grid-cols-[9.5rem_minmax(0,1fr)_7rem_6.5rem] md:items-center md:gap-3",
                        active ? "border-l-[3px] border-l-primary bg-tile" : "border-l-[3px] border-l-transparent hover:bg-tile/70",
                      )}
                      data-testid={`button-inquiry-${inquiry.id}`}
                    >
                      <span className="font-mono text-xs tabular-nums">{inquiry.reference ?? "—"}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-foreground">{subjectOf(inquiry)}</span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {KIND_LABEL[inquiry.kind] ?? inquiry.kind}
                          {parsed.items.length > 0 && (
                            <>
                              <span aria-hidden> · </span>
                              {parsed.items.length} {parsed.items.length === 1 ? "product" : "products"}
                            </>
                          )}
                          <span className="md:hidden">
                            <span aria-hidden> · </span>
                            {filedOn(inquiry.createdAt)}
                          </span>
                        </span>
                      </span>
                      <span className="hidden text-xs tabular-nums text-muted-foreground md:block">{filedOn(inquiry.createdAt)}</span>
                      <span className="justify-self-start md:justify-self-end">
                        <StatusChip status={inquiry.status} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {selected && (
            <InquirySheet
              key={selected.id}
              inquiry={selected}
              className={cn(reading ? "block" : "hidden lg:block")}
              onBack={() => setReading(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function InquirySheet({
  inquiry,
  className,
  onBack,
}: {
  inquiry: DeskInquiry;
  className?: string;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const parsed = parseMessage(inquiry.message?.trim() ?? "");
  const showFinish = parsed.items.some((item) => item.finish);

  const copy = async () => {
    if (!inquiry.reference) return;
    try {
      await navigator.clipboard.writeText(inquiry.reference);
      setCopied(true);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <article className={cn("border border-border lg:sticky lg:top-24", className)} data-testid="inquiry-detail">
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground lg:hidden"
            data-testid="button-inquiry-back"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            All enquiries
          </button>
          <p className="font-mono text-sm tabular-nums">{inquiry.reference ?? "—"}</p>
          <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.03em]">{subjectOf(inquiry)}</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            {KIND_LABEL[inquiry.kind] ?? inquiry.kind}
            <span aria-hidden> · </span>
            Filed {filedOn(inquiry.createdAt)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusChip status={inquiry.status} />
          {inquiry.reference && (
            <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground" data-testid="button-copy-inquiry-reference">
              {copied ? <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />}
              {copied ? "Copied" : "Copy ref."}
            </button>
          )}
        </div>
      </div>

      {parsed.items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-3 py-3 font-semibold">Item no.</th>
                {showFinish && <th className="px-3 py-3 font-semibold">Finish</th>}
                <th className="px-5 py-3 text-right font-semibold">Qty</th>
              </tr>
            </thead>
            <tbody className="[&_td]:align-top">
              {parsed.items.map((item, index) => (
                <tr key={`${item.itemNo}-${index}`} className="border-b border-border last:border-b-0">
                  <td className="px-5 py-3">{item.title}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs tabular-nums">{item.itemNo || "—"}</td>
                  {showFinish && <td className="px-3 py-3 text-muted-foreground">{item.finish || "—"}</td>}
                  <td className="whitespace-nowrap px-5 py-3 text-right font-mono tabular-nums">{item.qty || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Your message</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground" data-testid="inquiry-content">
            {inquiry.message?.trim() || "No message included."}
          </p>
        </div>
      )}

      {parsed.notes && (
        <div className="border-t border-border px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Notes</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{parsed.notes}</p>
        </div>
      )}
      {parsed.items.length > 0 && parsed.prose && (
        <div className="border-t border-border px-5 py-5">
          <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{parsed.prose}</p>
        </div>
      )}
    </article>
  );
}
