import { ArrowUpRight, BookOpen, Download, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { MediaImage } from "@/components/media-image";
import { type Catalogue } from "@/lib/catalogues";
import { whatsappUrl } from "@/lib/whatsapp";

const KIND_LABEL: Record<Catalogue["kind"], string> = {
  catalogue: "Catalogue",
  brochure: "Brochure",
  technical: "Technical",
  finishes: "Finishes",
};

/**
 * One booklet. The cover carries the brand. `compact` keeps only that and the title,
 * for a brand page that is already about one maker.
 */
export function CatalogueCard({ item, showBrandLink = true, compact = false }: { item: Catalogue; showBrandLink?: boolean; compact?: boolean }) {
  const requestHref = whatsappUrl(`Hello ATC, could you send me the ${item.brandName} "${item.title}" catalogue${item.edition ? ` (${item.edition})` : ""}?`);
  const href = `/catalogues/${item.id}`;

  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="relative block aspect-[3/4] overflow-hidden bg-card" aria-label={`${item.title}, ${item.brandName}`} data-testid={`catalogue-cover-${item.id}`}>
        <MediaImage src={item.cover} alt="" width={720} height={960} sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw" className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" aria-hidden />
        <span className="absolute left-3 top-3 bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground">{item.brandName}</span>
        {item.edition && <span className="absolute right-3 top-3 bg-primary px-2 py-1 font-mono text-[10px] tabular-nums text-primary-foreground">{item.edition}</span>}
        <span className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">{KIND_LABEL[item.kind]}</span>
          <span className="flex h-9 w-9 items-center justify-center bg-white text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            {item.download ? <Download className="h-4 w-4" strokeWidth={2} /> : item.browse ? <BookOpen className="h-4 w-4" strokeWidth={2} /> : <MessageCircle className="h-4 w-4" strokeWidth={2} />}
          </span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className="font-display text-xl font-medium leading-[1.05] tracking-[-0.03em] md:text-2xl">
          <Link href={href} className="transition-colors hover:text-primary">{item.title}</Link>
        </h3>
        {!compact && <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.line}</p>}
        {!compact && item.languages && <p className="mt-2 font-mono text-[11px] tracking-wide text-muted-foreground">{item.languages.join(" · ")}</p>}
        {!compact && <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em]">
          {item.download && (
            <a href={item.download} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary transition-colors hover:text-foreground" data-testid={`link-download-${item.id}`}>
              <Download className="h-3.5 w-3.5" strokeWidth={2} /> Download
            </a>
          )}
          {item.browse && (
            <a href={item.browse} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-primary" data-testid={`link-browse-${item.id}`}>
              View online <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          )}
          <a href={requestHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary" data-testid={`link-request-${item.id}`}>
            Request a copy
          </a>
        </div>}
        {showBrandLink && (
          <Link href={`/brands/${item.brandSlug}`} className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            More from {item.brandName}
          </Link>
        )}
      </div>
    </article>
  );
}
