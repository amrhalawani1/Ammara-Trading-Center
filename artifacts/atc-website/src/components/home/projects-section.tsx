import { Link } from "wouter";
import { SolidLink } from "@/components/home/primitives";
import { MediaImage } from "@/components/media-image";
import { isExample, PROJECTS, projectHref } from "@/lib/projects";

const HOME_PROJECTS = PROJECTS.slice(0, 8);

/** Home project references: eight projects, above the showrooms. */
export function ProjectsSection() {
  return (
    <section className="dark bg-black text-foreground" data-testid="section-project-references">
      <div className="mx-auto max-w-[1560px] px-6 pb-6 pt-10 md:px-12 md:pb-8 md:pt-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Project references</p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">Eight projects</h2>
            <p className="mt-3 text-sm leading-6 text-white/70 md:text-base">Open a project to read it.</p>
          </div>
          <SolidLink href="/projects">All projects</SolidLink>
        </div>

        <ul className="mt-8 flex h-[min(26rem,62dvh)] gap-1.5 overflow-x-auto md:h-[min(32rem,calc(100dvh-17rem))] md:overflow-visible" aria-label="Project references">
          {HOME_PROJECTS.map((project, index) => (
            <li
              key={project.slug}
              className="flex min-w-[46%] shrink-0 md:min-w-0 md:shrink md:flex-1 md:transition-[flex-grow] md:duration-500 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:flex-[1.7] md:focus-within:flex-[1.7]"
            >
              <Link
                href={projectHref(project.slug)}
                className="group relative block h-full w-full overflow-hidden bg-neutral-900"
                data-testid={`link-home-project-${project.slug}`}
              >
                <MediaImage
                  src={project.cover}
                  alt=""
                  width={800}
                  height={1100}
                  lazy={index > 1}
                  sizes="(min-width: 768px) 20vw, 46vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25" aria-hidden />
                <span className="absolute inset-x-0 top-0 h-0.5 bg-primary opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                {isExample(project) && (
                  <span className="absolute right-3 top-3 z-10 bg-white px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-950">Example</span>
                )}
                <span className="absolute left-4 top-4 z-10 text-[11px] font-semibold uppercase tracking-[0.14em] text-white opacity-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                  {project.sector}
                </span>
                <span
                  aria-hidden
                  className="absolute bottom-6 left-5 max-h-[calc(100%-4.5rem)] overflow-hidden text-sm font-medium tracking-[0.02em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] [writing-mode:vertical-rl] rotate-180 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90 group-hover:opacity-0 group-focus-visible:rotate-90 group-focus-visible:opacity-0 motion-reduce:transition-none"
                >
                  {project.title}
                </span>
                <span className="absolute bottom-6 left-5 origin-bottom-left max-w-[calc(100%-2.5rem)] text-sm font-medium leading-tight tracking-[0.02em] text-white opacity-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] -rotate-90 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0 group-hover:opacity-100 group-focus-visible:rotate-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
                  {project.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
