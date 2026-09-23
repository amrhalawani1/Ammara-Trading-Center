import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/** Persistent WhatsApp entry point. `raised` lifts it clear of a bottom bar on small screens. */
export function FloatingWhatsApp({ href, raised = false }: { href: string; raised?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "fixed right-4 z-30 inline-flex h-12 items-center gap-2.5 bg-foreground px-4 text-sm font-medium text-background shadow-[0_18px_40px_-18px_rgba(26,18,18,0.6)] transition-[bottom,background-color] duration-300 hover:bg-primary md:right-6 md:px-5",
        raised ? "bottom-20 md:bottom-28" : "bottom-4 md:bottom-6",
      )}
      data-testid="button-floating-whatsapp"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
      <span className="sr-only sm:hidden">Chat on WhatsApp</span>
    </a>
  );
}
