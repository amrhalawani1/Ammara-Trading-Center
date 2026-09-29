import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";
import { Link, useParams } from "wouter";
import { BRAND_LOGOS, BrandMark } from "@/components/home/partner-brands";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { PhotoLightbox, type LightboxPhoto } from "@/components/shared/photo-lightbox";
import { brandName, findProject, isExample, PROJECTS, projectHref, type Project } from "@/lib/projects";
import { solutionBySlug } from "@/lib/solutions";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import NotFound from "@/pages/not-found";

export default function ProjectDetail() {
  const params = useParams<{ slug: string }>();
  const project = findProject(params.slug);
  const [viewing, setViewing] = useState<number | null>(null);

  useEffect(() => {
    if (project) window.scrollTo({ top: 0, behavior: "auto" });
    setViewing(null);
  }, [project?.slug]);

  if (!project) return <NotFound />;

  const related = PROJECTS.filter((item) => item.slug !== project.slug && item.sector === project.sector)
    .concat(PROJECTS.filter((item) => item.slug !== project.slug && item.sector !== project.sector))
    .slice(0, 3);
  const gallery = project.gallery.filter((shot) => shot.src !== project.cover);
  const photos: LightboxPhoto[] = gallery;
  const systems = project.systems.map((slug) => solutionBySlug(slug)).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const askHref = whatsappUrl(`Hello ATC, I am working on a ${project.sector.toLowerCase()} project and saw the "${project.title}" reference. Could we talk about hardware for it?`);

  return (
    <MainLayout>
      <article>
        <header className="mx-auto max-w-[760px] px-6 pb-10 pt-14 md:pt-20" data-testid="section-project-hero">
          <Link href="/projects" className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary" data-testid="link-back-projects">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} /> All projects
          </Link>
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {project.sector}
            <span aria-hidden> · </span>
            {project.location}
            {project.year ? (
              <>
                <span aria-hidden> · </span>
                {project.year}
              </>
            ) : null}
          </p>
          {isExample(project) && (
            <p className="mt-4 inline-block bg-foreground px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-background" data-testid="text-project-example">
              Example project
            </p>
          )}
          <h1 className="mt-4 font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.05em]">{project.title}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{project.scope}</p>
        </header>

        <div className="mx-auto max-w-[1100px] px-6">
          <MediaImage
            src={project.cover}
            alt=""
            width={1600}
            height={1000}
            lazy={false}
            fetchPriority="high"
            sizes="(min-width: 1100px) 1100px, 100vw"
            className="aspect-[16/10] w-full object-cover"
          />
        </div>

        <div className="mx-auto max-w-[680px] px-6 py-14 md:py-20">
          <div className="space-y-6 text-base leading-8 text-foreground/85 md:text-lg">
            {project.story.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-14 grid gap-x-10 gap-y-6 border-t border-border pt-8 sm:grid-cols-2" data-testid="project-facts">
            <Fact label="Sector" value={project.sector} />
            <Fact label="Location" value={project.location} />
            {project.year && <Fact label="Completed" value={project.year} />}
            {project.client && project.clientCleared && <Fact label="Client" value={project.client} />}
            <Fact label="Scope" value={project.scope} />
          </dl>

          {project.brands.length > 0 && (
            <div className="mt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Hardware by</p>
              <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4" aria-label="Manufacturers">
                {project.brands.map((slug) => (
                  <li key={slug}>
                    <Link href={`/brands/${slug}`} className="group block" data-testid={`link-project-brand-${slug}`}>
                      <BrandMark slug={slug} name={brandName(slug)} className={BRAND_LOGOS[slug] ? "h-6 max-w-[6rem] bg-foreground/80 transition-colors group-hover:bg-primary" : "text-base text-foreground/80 group-hover:text-primary"} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {gallery.length > 0 && (
            <div className="mt-16 space-y-10">
              {gallery.map((shot, index) => (
                <figure key={shot.src}>
                  <button type="button" onClick={() => setViewing(index)} className="block w-full cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`View photograph full screen: ${shot.caption}`} data-testid={`button-project-photo-${index}`}>
                    <MediaImage src={shot.src} alt={shot.alt} width={1200} height={800} sizes="(min-width: 680px) 680px, 100vw" className="w-full object-cover" />
                  </button>
                  <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">{shot.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}

          {systems.length > 0 && (
            <div className="mt-16 border-t border-border pt-8">
              <h2 className="font-display text-2xl font-medium tracking-[-0.03em]">Hardware used</h2>
              <ul className="mt-5 divide-y divide-border border-b border-border">
                {systems.map((solution) => (
                  <li key={solution.slug}>
                    <Link href={`/catalog?solution=${solution.slug}`} className="group flex items-baseline justify-between gap-4 py-4" data-testid={`link-system-${solution.slug}`}>
                      <span>
                        <span className="block text-base transition-colors group-hover:text-primary">{solution.name}</span>
                        <span className="mt-1 block text-sm leading-6 text-muted-foreground">{solution.line}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" strokeWidth={1.75} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-14">
            <p className="font-display text-2xl font-medium tracking-[-0.03em]">Planning something similar?</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/contact" className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-[background-color,color,transform] hover:bg-foreground hover:text-background active:translate-y-px" data-testid="link-project-enquiry">
                Send a trade enquiry <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Link>
              <a href={askHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-foreground" data-testid="link-project-whatsapp">
                <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
        <aside className="border-t border-border px-6 py-14 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">More projects</h2>
            <ul className="mt-8 flex flex-col gap-3 md:h-[460px] md:flex-row" aria-label="More projects">
              {related.map((item) => (
                <li key={item.slug} className="min-h-[280px] md:min-h-0 md:flex-1 md:transition-[flex-grow] md:duration-500 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:flex-[2.4] md:focus-within:flex-[2.4] motion-reduce:transition-none">
                  <Related project={item} />
                </li>
              ))}
            </ul>
          </div>
        </aside>
        )}
      </article>
      <PhotoLightbox photos={photos} index={viewing} onChange={setViewing} onClose={() => setViewing(null)} label={project.title} />
    </MainLayout>
  );
}

function Fact({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</dt>
      <dd className={cn("mt-2 text-base leading-6", muted && "text-muted-foreground")}>{value}</dd>
    </div>
  );
}

function Related({ project }: { project: Project }) {
  return (
    <Link
      href={projectHref(project.slug)}
      className="group relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden bg-neutral-950 text-white outline-none focus-visible:ring-2 focus-visible:ring-primary md:min-h-0"
      data-testid={`link-related-${project.slug}`}
    >
      <MediaImage
        src={project.cover}
        alt=""
        width={960}
        height={720}
        sizes="(min-width: 768px) 40vw, 100vw"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] group-focus-visible:scale-[1.05] motion-reduce:transition-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 transition-colors duration-500 group-hover:from-black/85" aria-hidden />
      <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none" aria-hidden />
      <span className="relative flex items-end justify-between gap-4 p-5 md:p-6">
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
            {project.sector}
            {isExample(project) && <span className="ml-2 bg-white px-1.5 py-0.5 text-[9px] text-neutral-950">Example</span>}
          </span>
          <span className="mt-2 block font-display text-2xl font-medium leading-[1.05] tracking-[-0.03em] md:text-3xl">{project.title}</span>
          <span className="mt-2 block text-sm leading-6 text-white/80 md:max-h-0 md:overflow-hidden md:opacity-0 md:transition-all md:duration-500 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:max-h-16 md:group-hover:opacity-100 md:group-focus-visible:max-h-16 md:group-focus-visible:opacity-100 motion-reduce:transition-none">
            {project.scope}
          </span>
        </span>
        <ArrowUpRight className="mb-1 h-5 w-5 shrink-0 text-white/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:text-primary" strokeWidth={1.75} />
      </span>
    </Link>
  );
}
