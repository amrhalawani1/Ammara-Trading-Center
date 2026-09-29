import { useState } from "react";
import {
  getListContentInquiriesQueryKey,
  useListContentInquiries,
  usePatchContentInquiry,
  type InquiryStatus,
} from "@workspace/api-client-react";

const STATUSES: { value: InquiryStatus; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "in_progress", label: "In progress" },
  { value: "responded", label: "Responded" },
];

export function InquiriesTab() {
  const [status, setStatus] = useState<InquiryStatus | "">("");
  const [kind, setKind] = useState<"" | "general" | "shortlist" | "newsletter">("");
  const inquiryParams = { status: status || undefined, kind: kind || undefined };
  const list = useListContentInquiries(inquiryParams, {
    query: { queryKey: getListContentInquiriesQueryKey(inquiryParams), refetchOnWindowFocus: true },
  });
  const patch = usePatchContentInquiry({
    mutation: { onSuccess: () => { void list.refetch(); } },
  });
  const rows = list.data ?? [];

  return (
    <div data-testid="tab-content-inquiries">
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as InquiryStatus | "")}
          className="h-10 border border-border bg-background px-3 text-xs uppercase tracking-widest"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={kind}
          onChange={(event) => setKind(event.target.value as typeof kind)}
          className="h-10 border border-border bg-background px-3 text-xs uppercase tracking-widest"
          aria-label="Filter by kind"
        >
          <option value="">All kinds</option>
          <option value="general">General</option>
          <option value="shortlist">Shortlist</option>
          <option value="newsletter">Newsletter</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No inquiries match these filters.</p>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-card text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Kind</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0" data-testid={`row-inquiry-${row.id}`}>
                  <td className="px-4 py-3 font-mono text-xs">{row.reference ?? "—"}</td>
                  <td className="px-4 py-3">
                    <p>{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                    {row.company && <p className="text-xs text-muted-foreground">{row.company}</p>}
                  </td>
                  <td className="px-4 py-3 capitalize">{row.kind}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(row.createdAt))}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.status}
                      disabled={patch.isPending}
                      onChange={(event) =>
                        patch.mutate({
                          id: row.id,
                          data: { status: event.target.value as InquiryStatus },
                        })
                      }
                      className="h-9 border border-border bg-background px-2 text-xs"
                      aria-label={`Status for ${row.reference ?? row.id}`}
                      data-testid={`select-inquiry-status-${row.id}`}
                    >
                      {STATUSES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
