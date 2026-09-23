import { MediaImage } from "@/components/media-image";
import { PROJECTS } from "@/lib/home-content";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, Section, SolidLink } from "./primitives";

/**
 * Project references as a 2/1/1 bento with a large lead. Entries flagged `placeholder` show a
 * notice rather than pretending to be cleared case studies.
 */
export function ProjectsSection() {
  const placeholders = PROJECTS.some((p) => p.placeholder);
  if (PROJECTS.length === 0) return null;

  return (
    <Section tone="panel">
      <Reveal className="max-w-3xl">
        <h2 className="font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">Where the hardware went.</h2>
        <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Hotels, villas, offices and joinery programmes across Jordan, supplied from stock and supported on site.</p>
      </Reveal>

      {placeholders && (
        <Reveal className="mt-8 inline-block border border-primary/60 px-4 py-2 text-xs leading-5 text-foreground/80">
          <span className="font-semibold text-primary">Placeholder. </span>
          These entries show the layout only. Cleared projects will replace them.
        </Reveal>
      )}

      <RevealGroup as="ul" className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2" aria-label="Project references">
        {PROJECTS.map((project, index) => {
          const isLead = index === 0;
          return (
            <Reveal as="li" key={project.title} className={cn(isLead && "md:col-span-2 lg:row-span-2")}>
              <article className="dark group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden bg-background text-foreground">
                <MediaImage src={project.image} alt={project.title} width={isLead ? 1400 : 700} height={isLead ? 1050 : 700} className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="relative p-6 md:p-8">
                  <p className="text-xs text-muted-foreground">{project.sector}, {project.location}</p>
                  <h3 className={cn("mt-3 font-display font-medium leading-[0.95] tracking-[-0.04em]", isLead ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl")}>{project.title}</h3>
                  <p className="mt-3 text-sm text-foreground/80">{project.scope}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Systems supplied">
                    {project.systems.map((system) => (
                      <li key={system} className="bg-foreground/10 px-2.5 py-1 text-xs text-foreground/90 backdrop-blur-sm">{system}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          );
        })}
      </RevealGroup>
      <SolidLink href="/contact" className="mt-12">Talk to us about your project</SolidLink>
    </Section>
  );
}
