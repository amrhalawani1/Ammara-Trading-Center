import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface StickyInquiryBarProps {
  visible: boolean;
  productName: string;
  finish?: string | null;
  href: string;
}

/** Mobile-only: WhatsApp stays one thumb away once the hero CTA has scrolled off (Fadi, on site, on a phone). */
export function StickyInquiryBar({ visible, productName, finish, href }: StickyInquiryBarProps) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { y: 72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: 72, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex items-center gap-4 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{productName}</p>
              {finish && <p className="truncate text-xs text-muted-foreground">{finish}</p>}
            </div>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-2 bg-primary px-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition active:scale-[0.98]"
              data-testid="button-sticky-whatsapp"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
