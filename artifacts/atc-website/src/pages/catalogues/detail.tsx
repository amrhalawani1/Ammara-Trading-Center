import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Download, FileText } from "lucide-react";
import { Link, useParams } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { cataloguePdfSrc, findCatalogue } from "@/lib/catalogues";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import NotFound from "@/pages/not-found";

type ViewMode = "catalogue" | "pdf";

export default function CatalogueDetail() {
  const params = useParams<{ id: string }>();
  const item = findCatalogue(params.id);
  const [mode, setMode] = useState<ViewMode>(item?.viewer ? "catalogue" : "pdf");

  useEffect(() => {
    if (item) {
      setMode(item.viewer ? "catalogue" : "pdf");
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [item?.id]);

  if (!item) return <NotFound />;

  const pdfSrc = item.download ? cataloguePdfSrc(item.download) : null;
  const requestHref = whatsappUrl(`Hello ATC, could you send me the ${item.brandName} "${item.title}" catalogue${item.edition ? ` (${item.edition})` : ""}?`);
  const frameSrc = mode === "catalogue" ? item.viewer : pdfSrc;

  return (
    <MainLayout>
      <article>
        <header className="border-b border-border px-6 py-8 md:px-12 md:py-10" data-testid="section-catalogue-header">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <Link href={`/brands/${item.brandSlug}`} className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary" data-testid="link-back-brand">
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} /> {item.brandName}
              </Link>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                {item.kind}
                {item.edition ? <span className="text-muted-foreground"> · {item.edition}</span> : null}
              </p>
              <h1 className="mt-2 font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl" data-testid="text-catalogue-title">{item.title}</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{item.line}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {(item.viewer || pdfSrc) && (
                <div className="flex gap-2" role="group" aria-label="Catalogue view">
                  {item.viewer && (
                    <button type="button" onClick={() => setMode("catalogue")} aria-pressed={mode === "catalogue"} className={cn("inline-flex h-12 items-center gap-2 border px-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors", mode === "catalogue" ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:border-foreground")} data-testid="button-view-catalogue">
                      <BookOpen className="h-4 w-4" strokeWidth={1.75} /> Catalogue
                    </button>
                  )}
                  {pdfSrc && (
                    <button type="button" onClick={() => setMode("pdf")} aria-pressed={mode === "pdf"} className={cn("inline-flex h-12 items-center gap-2 border px-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors", mode === "pdf" ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:border-foreground")} data-testid="button-view-pdf">
                      <FileText className="h-4 w-4" strokeWidth={1.75} /> PDF
                    </button>
                  )}
                </div>
              )}
              {item.download && (
                <a href={item.download} className="inline-flex h-12 items-center gap-2 bg-primary px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background" data-testid="button-download-catalogue">
                  <Download className="h-4 w-4" strokeWidth={2} /> Download
                </a>
              )}
            </div>
          </div>
        </header>

        <section className="bg-muted/40 px-6 py-8 md:px-12 md:py-10" data-testid="section-catalogue-viewer">
          <div className="mx-auto max-w-[1440px]">
            {frameSrc ? (
              <iframe
                key={frameSrc}
                src={frameSrc}
                title={`${item.title} ${mode === "pdf" ? "PDF" : "catalogue"}`}
                className="h-[min(920px,calc(100dvh-12rem))] w-full border border-border bg-background"
                data-testid="frame-catalogue"
              />
            ) : (
              <div className="grid items-center gap-10 border border-border bg-background p-8 md:grid-cols-[16rem_minmax(0,1fr)] md:p-12">
                <MediaImage src={item.cover} alt="" width={480} height={640} className="aspect-[3/4] w-full object-contain" />
                <div>
                  <p className="max-w-md text-base leading-7 text-muted-foreground">This title is listed at the counter. Ask the showroom for a printed copy or the file.</p>
                  <a href={requestHref} target="_blank" rel="noreferrer" className="mt-6 inline-flex h-12 items-center bg-primary px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
                    Request a copy
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      </article>
    </MainLayout>
  );
}
