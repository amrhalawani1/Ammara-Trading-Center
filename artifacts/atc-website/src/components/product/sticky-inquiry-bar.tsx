import { useEffect } from "react";
import { Check, MessageCircle } from "lucide-react";
import { track } from "@/lib/analytics";

interface StickyInquiryBarProps {
  productName: string;
  finish?: string | null;
  href: string;
  quoted: boolean;
  onQuote: () => void;
}

/** Phone only. WhatsApp and Add to quote stay in thumb reach and do not cover the page end. */
export function StickyInquiryBar({ productName, finish, href, quoted, onQuote }: StickyInquiryBarProps) {
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const apply = () => document.documentElement.style.setProperty("--sticky-quote-bar", media.matches ? "5.5rem" : "0px");
    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      document.documentElement.style.removeProperty("--sticky-quote-bar");
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <p className="truncate px-3 pt-2 text-xs text-muted-foreground">
        <span className="text-foreground">{productName}</span>
        {finish ? ` · ${finish}` : ""}
      </p>
      <div className="grid grid-cols-2 gap-2 px-3 py-2">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("whatsapp_click", { item_id: productName })}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-border px-3 text-sm font-medium text-foreground"
          data-testid="button-sticky-whatsapp"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> WhatsApp
        </a>
        <button
          type="button"
          onClick={onQuote}
          className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-3 text-sm font-medium text-primary-foreground"
          data-testid="button-sticky-quote"
        >
          {quoted ? <Check className="h-4 w-4" strokeWidth={2} /> : null}
          {quoted ? "Added" : "Add to quote"}
        </button>
      </div>
    </div>
  );
}
