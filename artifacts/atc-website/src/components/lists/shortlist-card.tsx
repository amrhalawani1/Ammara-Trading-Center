import { useEffect, useState } from "react";
import { ArrowRight, Mail, MessageCircle, Minus, Plus, Send, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { EnquiryDialog } from "@/components/lists/enquiry-dialog";
import { btn, eyebrow } from "@/components/lists/ui";
import { MediaImage } from "@/components/media-image";
import { useShortlists } from "@/hooks/use-shortlists";
import { shortlistMailto, shortlistWhatsappUrl } from "@/lib/shortlist-message";
import { LIST_NAME_MAX, QUANTITY_MAX, referenceCount, type Shortlist, type ShortlistItem } from "@/lib/shortlists";
import { cn } from "@/lib/utils";

/**
 * One project shortlist: its numbered title (edited in place), the saved references with
 * quantities, and the three ways to send it once it holds at least one line. Deleting asks
 * inline rather than in a modal.
 */
export function ShortlistCard({ list, index }: { list: Shortlist; index: number }) {
  const { renameList, deleteList } = useShortlists();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const hasItems = list.items.length > 0;

  return (
    <article className="border-b border-border pb-14" data-testid={`card-list-${list.id}`}>
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className={eyebrow}>Shortlist {String(index + 1).padStart(2, "0")}</p>
          <TitleEditor list={list} onRename={(name) => renameList(list.id, name)} />
          <p className="mt-2 text-xs tabular-nums text-muted-foreground" data-testid={`text-list-count-${list.id}`}>
            {referenceCount(list.items.length)} · Saved on this device
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasItems && (
            <>
              <button type="button" onClick={() => setEnquiryOpen(true)} className={btn("primary")} data-testid={`button-send-enquiry-${list.id}`}>
                <Send /> Send to ATC
              </button>
              <a href={shortlistWhatsappUrl(list)} target="_blank" rel="noreferrer" className={btn("outline")} data-testid={`link-list-whatsapp-${list.id}`}>
                <MessageCircle /> WhatsApp
              </a>
              <a href={shortlistMailto(list)} className={btn("outline")} data-testid={`link-list-email-${list.id}`}>
                <Mail /> Email shortlist
              </a>
            </>
          )}
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className={btn("ghost", "h-11 w-11")}
            aria-label={`Delete ${list.name}`}
            aria-expanded={confirming}
            data-testid={`button-delete-list-${list.id}`}
          >
            <Trash2 />
          </button>
        </div>
      </div>

      {confirming && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border border-destructive/30 bg-destructive/5 p-4" role="alert" data-testid={`confirm-delete-${list.id}`}>
          <p className="text-sm">
            Delete “{list.name}” and all its saved references?
          </p>
          <div className="flex">
            <button type="button" onClick={() => setConfirming(false)} className={btn("ghost", "h-11 px-3 text-xs")} data-testid="button-keep-list">
              Keep shortlist
            </button>
            <button type="button" onClick={() => deleteList(list.id)} className={btn("destructive")} data-testid="button-confirm-delete">
              Delete
            </button>
          </div>
        </div>
      )}

      {hasItems ? (
        <ul className="mt-8 border-t border-border" aria-label={`References in ${list.name}`}>
          {list.items.map((item) => (
            <ShortlistLine key={item.key} list={list} item={item} />
          ))}
        </ul>
      ) : (
        <div className="mt-8 grid min-h-48 place-items-center bg-card px-6 py-12 text-center" data-testid={`empty-list-${list.id}`}>
          <div>
            <h3 className="font-display text-2xl font-medium tracking-[-0.02em]">Ready for its first reference.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">Browse the catalogue and save the products you want ATC to review together.</p>
            <Link href="/catalog" className={btn("outline", "mt-6")} data-testid="link-empty-catalogue">
              Explore the catalogue <ArrowRight />
            </Link>
          </div>
        </div>
      )}

      {hasItems && <EnquiryDialog list={list} open={enquiryOpen} onOpenChange={setEnquiryOpen} />}
    </article>
  );
}

/** The list name as an input that reads as a heading. Commits on blur or Enter, Escape reverts. */
function TitleEditor({ list, onRename }: { list: Shortlist; onRename: (name: string) => void }) {
  const [draft, setDraft] = useState(list.name);
  useEffect(() => setDraft(list.name), [list.name]);
  const commit = () => {
    onRename(draft);
    // A duplicate name is refused by the store; fall back to what it kept.
    window.setTimeout(() => setDraft((current) => (current.trim().toLowerCase() === list.name.trim().toLowerCase() ? current : list.name)), 0);
  };
  return (
    <input
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") {
          setDraft(list.name);
          event.currentTarget.blur();
        }
      }}
      maxLength={LIST_NAME_MAX}
      aria-label={`Rename ${list.name}`}
      className="mt-2 h-auto w-full max-w-xl border-0 border-b border-transparent bg-transparent p-0 font-display text-3xl font-medium tracking-[-0.03em] text-foreground outline-none transition-colors hover:border-border focus:border-foreground"
      data-testid={`input-list-title-${list.id}`}
    />
  );
}

function ShortlistLine({ list, item }: { list: Shortlist; item: ShortlistItem }) {
  const { setQuantity, removeItem } = useShortlists();
  const href = `/products/${item.slug}`;
  return (
    <li className="grid gap-5 border-b border-border py-5 sm:grid-cols-[112px_1fr] lg:grid-cols-[112px_1fr_auto] lg:items-center" data-testid={`line-${item.key}`}>
      <Link href={href} aria-label={`View ${item.name}`} className="group block">
        <div className="relative grid aspect-square place-items-center overflow-hidden bg-card transition-colors duration-200 group-hover:bg-tile">
          <MediaImage src={item.image} alt="" width={224} height={224} sizes="112px" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" fallbackLabel={item.brandName} />
        </div>
      </Link>
      <div>
        <p className={eyebrow}>{item.brandName}</p>
        <Link href={href} className="mt-2 block font-display text-xl font-medium tracking-[-0.02em] transition-colors hover:text-primary">{item.name}</Link>
        <p className="mt-2 text-xs tabular-nums text-muted-foreground">
          Reference {item.reference || "on request"}
          {item.variant && <> · {item.variant}</>}
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 sm:col-start-2 lg:col-start-auto">
        <QuantityControl value={item.quantity} onChange={(quantity) => setQuantity(list.id, item.key, quantity)} name={item.name} />
        <button type="button" onClick={() => removeItem(list.id, item.key)} className={btn("ghost", "h-11 w-11")} aria-label={`Remove ${item.name} from ${list.name}`} data-testid={`button-remove-${item.key}`}>
          <Trash2 />
        </button>
      </div>
    </li>
  );
}

/** Minus and plus step by one; the field takes typed values and clamps anything invalid to 1. */
function QuantityControl({ value, onChange, name }: { value: number; onChange: (quantity: unknown) => void; name: string }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  return (
    <div className="inline-grid h-11 grid-cols-[42px_58px_42px] border border-border" role="group" aria-label={`Quantity of ${name}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} className={btn("ghost", "size-10 min-h-0 self-center justify-self-center")} aria-label={`Decrease ${name} quantity`} data-testid="button-qty-minus">
        <Minus />
      </button>
      <input
        value={draft}
        inputMode="numeric"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => onChange(draft)}
        onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
        aria-label={`Quantity for ${name}`}
        className={cn("h-10 w-full self-center border-x border-border bg-transparent px-1 text-center text-base tabular-nums text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm")}
        data-testid="input-qty"
      />
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= QUANTITY_MAX} className={btn("ghost", "size-10 min-h-0 self-center justify-self-center")} aria-label={`Increase ${name} quantity`} data-testid="button-qty-plus">
        <Plus />
      </button>
    </div>
  );
}
