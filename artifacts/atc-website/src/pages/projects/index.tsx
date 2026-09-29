import { ArrowUpRight, MessageCircle } from "lucide-react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Link, useSearch } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { SolidLink, SPRING } from "@/components/home/primitives";
import { isExample, PROJECTS, projectHref, PUBLISHED_SECTORS, sectorFromParam, sectorSlug, type Project } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

const TABS = [{ sector: null, label: "All" }, ...PUBLISHED_SECTORS.map((sector) => ({ sector, label: sector }))] as const;
const ENQUIRY_MESSAGE = "Hello ATC, I am planning a project and would like to talk about hardware for it.";

/**
 * Project references in an even grid. Real references come first; every stand-in carries an
 * Example label. The page ends on a trade enquiry.
 */
export default function Projects() {
  const search = useSearch();
  const reduce = useReducedMotion();
  const active = sectorFromParam(new URLSearchParams(search).get("sector"));
  const shown = active ? PROJECTS.filter((project) => project.sector === active) : PROJECTS;

  function keepListInView() {
    const list = document.getElementById("project-list");
    if (!list || list.getBoundingClientRect().top >= 140) return;
    document.getElementById("project-categories")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <MainLayout>
      <section className="px-6 pb-2 pt-10 md:px-12 md:pt-14" data-testid="section-projects-hero">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Project references</p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-none tracking-[-0.04em] md:text-5xl">Projects</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground" data-testid="text-projects-intro">
            Hotels, homes and institutions across Jordan fitted with hardware supplied by ATC. Entries marked Example show how a reference will appear until the client agrees to be named.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12 md:pb-32" data-testid="section-projects-list">
        <div className="mx-auto max-w-[1440px]">
          <nav
            id="project-categories"
            aria-label="Project categories"
            className="sticky top-[var(--nav-offset,76px)] z-30 mt-8 scroll-mt-[var(--nav-offset,76px)] border-b border-border bg-background/95 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="-mx-6 min-w-0 flex-1 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
                <LayoutGroup id="project-categories">
                  <ul className="flex w-max gap-x-6">
                    {TABS.map((tab) => {
                      const current = tab.sector === active;
                      const count = tab.sector ? PROJECTS.filter((project) => project.sector === tab.sector).length : PROJECTS.length;
                      const href = tab.sector ? `/projects?sector=${sectorSlug(tab.sector)}` : "/projects";
                      return (
                        <li key={tab.label} className="relative">
                          <Link
                            href={href}
                            aria-current={current ? "page" : undefined}
                            onClick={keepListInView}
                            className={cn(
                              "flex h-12 items-center gap-2 whitespace-nowrap text-sm outline-none transition-colors focus-visible:text-primary",
                              current ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                            )}
                            data-testid={`link-sector-${tab.sector ? sectorSlug(tab.sector) : "all"}`}
                          >
                            {tab.label}
                            <span className="font-mono text-[11px] tabular-nums opacity-70">{count}</span>
                          </Link>
                          {current && (
                            <motion.span
                              layoutId="project-category-indicator"
                              className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                              transition={{ ...SPRING, duration: reduce ? 0 : undefined }}
                              aria-hidden
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </LayoutGroup>
              </div>
              <p className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground" aria-live="polite">
                {shown.length} {shown.length === 1 ? "project" : "projects"}
              </p>
            </div>
          </nav>

          <h2 className="sr-only">{active ?? "All projects"}</h2>
          <ul id="project-list" className="mt-10 grid scroll-mt-36 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" aria-label={active ?? "All projects"}>
            {shown.map((project, index) => (
              <li key={project.slug} className="h-full" data-testid={`project-${project.slug}`}>
                <ProjectCard project={project} priority={index < 3} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Closing />
    </MainLayout>
  );
}

function metaLine(parts: Array<string | undefined>) {
  return parts
    .filter((part): part is string => Boolean(part))
    .map((part, index) => (
      <span key={`${part}-${index}`}>
        {index > 0 && <span aria-hidden> · </span>}
        {part}
      </span>
    ));
}

function ProjectCard({ project, priority }: { project: Project; priority: boolean }) {
  return (
    <Link href={projectHref(project.slug)} className="group flex h-full flex-col outline-none" data-testid={`link-project-${project.slug}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-card">
        <MediaImage
          src={project.cover}
          alt=""
          width={900}
          height={675}
          lazy={!priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        {isExample(project) && (
          <span className="absolute left-3 top-3 bg-foreground px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-background">Example</span>
        )}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{metaLine([project.sector, project.location, project.year])}</p>
      <h3 className="mt-2 font-display text-2xl font-medium leading-tight tracking-[-0.03em] transition-colors group-hover:text-primary group-focus-visible:text-primary">
        {project.title}
      </h3>
      <p className="mb-4 mt-2 text-sm leading-6 text-muted-foreground">{project.scope}</p>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-3">
        <p className="min-h-6 text-sm leading-6">
          {project.figure ? (
            <>
              <span className="font-medium tabular-nums">{project.figure.value}</span> <span className="text-muted-foreground">{project.figure.label}</span>
            </>
          ) : null}
        </p>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" strokeWidth={1.75} aria-hidden />
      </div>
    </Link>
  );
}

/** The procurement path ends here: references, then a formal enquiry. */
function Closing() {
  return (
    <section className="border-t border-border px-6 py-16 md:px-12 md:py-20" data-testid="section-projects-closing">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-3xl font-medium leading-tight tracking-[-0.03em] md:text-4xl">Planning a project?</p>
          <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">Send the door schedule or the brief, and a consultant will come back with the hardware for it.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <SolidLink href="/contact">Send a trade enquiry</SolidLink>
          <a
            href={whatsappUrl(ENQUIRY_MESSAGE)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-foreground"
            data-testid="link-projects-whatsapp"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
