import { mapsEmbedSrc, mapsHref } from "@/lib/maps";
import { cn } from "@/lib/utils";

/**
 * Branch map. The embed is centred on the showroom; a red pin sits on top so the location
 * reads as ATC rather than a generic Google pin. The iframe itself is the live map.
 */
export function ShowroomMap({
  name,
  addressLines,
  label,
  compact = false,
  className,
}: {
  name: string;
  addressLines: readonly string[];
  label?: string;
  /** Hides the Maps chip so the embed can sit inside a card. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-foreground/40", className)} data-testid={`showroom-map-${name.toLowerCase().replace(/\s+/g, "-")}`}>
      <iframe
        key={name}
        title={`Map of the ${name} showroom`}
        src={mapsEmbedSrc(name, addressLines)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0 opacity-35 grayscale-[0.35] contrast-[1.04]"
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[70%]" aria-hidden>
        <span className="relative flex h-4 w-4">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
          <span className="relative m-auto h-3 w-3 rounded-full bg-primary ring-4 ring-background/80" />
        </span>
      </div>
      {label && (
        <p className="pointer-events-none absolute left-4 top-4 bg-background/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur-sm">
          {label}
        </p>
      )}
      {!compact && (
        <a
          href={mapsHref(name, addressLines)}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-4 right-4 bg-background/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
          data-testid={`link-map-open-${name.toLowerCase().replace(/\s+/g, "-")}`}
        >
          Open in Maps
        </a>
      )}
    </div>
  );
}
