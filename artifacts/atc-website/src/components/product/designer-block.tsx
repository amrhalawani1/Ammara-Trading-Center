import { Link } from "wouter";

interface DesignerBlockProps {
  name: string;
  bio: string;
  href?: string | null;
}

/** DND credits the designer as a chapter of its own: name large, a short bio, "discover more". */
export function DesignerBlock({ name, bio, href }: DesignerBlockProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Design</p>
        <h2 className="mt-5 font-display text-4xl font-light leading-[1.02] tracking-[-0.03em] md:text-5xl" data-testid="text-designer">{name}</h2>
      </div>
      <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
        {bio && <p className="text-base leading-8 text-foreground/85">{bio}</p>}
        {href && (
          <Link href={href} className="mt-6 inline-flex text-sm font-semibold tracking-[-0.01em] transition-colors hover:text-primary">
            / discover more
          </Link>
        )}
      </div>
    </div>
  );
}
