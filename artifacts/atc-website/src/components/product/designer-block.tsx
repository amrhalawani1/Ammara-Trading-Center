import { ArrowUpRight } from "lucide-react";

interface DesignerBlockProps {
  name: string;
  bio: string;
  url?: string | null;
}

/** DND credits the designer as a chapter of its own: name large, a short bio, "discover more". */
export function DesignerBlock({ name, bio, url }: DesignerBlockProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Design</p>
        <h2 className="mt-5 font-display text-4xl font-light leading-[1.02] tracking-[-0.03em] md:text-5xl" data-testid="text-designer">{name}</h2>
      </div>
      <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
        <p className="text-base leading-8 text-foreground/85">{bio}</p>
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition hover:text-primary">
            Discover more <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </a>
        )}
      </div>
    </div>
  );
}
