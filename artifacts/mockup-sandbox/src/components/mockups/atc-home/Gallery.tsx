import { ArrowDown, ArrowUpRight, Menu, Plus, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import "./_group.css";

const assetRoot = "/__mockup/images/";
const ink = "#241c18";
const cream = "#eee7dc";
const red = "#a4382d";

function Anchor({
  href,
  children,
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
      className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d36e60] focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </a>
  );
}

function Mark({ light = false }: { light?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${light ? "text-[#eee7dc]" : "text-[#241c18]"}`}>
      <span className="flex h-6 items-end gap-[3px]" aria-hidden="true">
        <i className={`h-3 w-[3px] -skew-x-12 ${light ? "bg-[#eee7dc]/70" : "bg-[#241c18]/80"}`} />
        <i className={`h-5 w-[3px] -skew-x-12 ${light ? "bg-[#eee7dc]/70" : "bg-[#241c18]/80"}`} />
        <i className="h-4 w-[3px] -skew-x-12 bg-[#a4382d]" />
      </span>
      <span className="font-serif text-[21px] uppercase leading-none tracking-[0.2em]">
        <span className={light ? "text-[#eee7dc]/65" : "text-[#241c18]/65"}>A</span>mara
      </span>
      <span className={`hidden border-l pl-3 text-[9px] uppercase tracking-[0.25em] sm:block ${light ? "border-[#eee7dc]/25 text-[#eee7dc]/60" : "border-[#241c18]/20 text-[#241c18]/55"}`}>
        Trading Center
      </span>
    </div>
  );
}

function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className={`flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.28em] ${light ? "text-[#eee7dc]/55" : "text-[#a4382d]"}`}>
      <span className="h-px w-7 bg-[#a4382d]" />
      {children}
    </div>
  );
}

export function Gallery() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("All objects");
  const filters = ["All objects", "Handles", "Systems", "Surfaces"];

  return (
    <div className="atc-home min-h-screen w-full overflow-hidden bg-[#241c18] text-[#eee7dc] selection:bg-[#a4382d]/40">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-6 py-6 md:px-12 md:py-8">
          <Anchor href="/" aria-label="Amara Trading Center home"><Mark light /></Anchor>
          <nav className="hidden items-center gap-8 md:flex">
            {["Collection", "Material library", "Trade desk", "Showroom"].map((label) => (
              <Anchor key={label} href={`/${label.toLowerCase().replace(" ", "-")}`} className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#eee7dc]/65 transition-colors hover:text-[#eee7dc]">{label}</Anchor>
            ))}
            <Anchor href="/contact" className="border-b border-[#d36e60] pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d36e60]">Start an inquiry</Anchor>
          </nav>
          <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)} className="rounded-full p-2 text-[#eee7dc] md:hidden">
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
        {open && (
          <nav className="mx-4 border border-[#eee7dc]/15 bg-[#241c18] px-6 py-4 shadow-2xl md:hidden">
            {["Collection", "Material library", "Trade desk", "Showroom"].map((label) => (
              <Anchor key={label} href="/" onClick={() => setOpen(false)} className="block border-b border-[#eee7dc]/10 py-4 text-xs uppercase tracking-[0.18em] text-[#eee7dc]">{label}</Anchor>
            ))}
            <Anchor href="/contact" onClick={() => setOpen(false)} className="mt-5 inline-flex text-xs uppercase tracking-[0.18em] text-[#d36e60]">Start an inquiry <ArrowUpRight className="ml-2 h-4 w-4" /></Anchor>
          </nav>
        )}
      </header>

      <main>
        <section className="relative flex min-h-[min(800px,100dvh)] items-end overflow-hidden border-b border-[#eee7dc]/10 px-6 pb-12 pt-32 md:px-12 md:pb-16">
          <img src={`${assetRoot}atc-hero-kitchen.jpg`} alt="Dark kitchen hardware detail" className="absolute inset-0 h-full w-full object-cover object-center grayscale-[55%] contrast-[1.12]" />
          <div className="absolute inset-0 bg-[#241c18]/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241c18] via-[#241c18]/25 to-[#241c18]/55" />
          <div className="relative z-10 mx-auto grid w-full max-w-[1480px] gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Kicker light>Gallery 01 — The quiet collection</Kicker>
              <h1 className="mt-8 max-w-4xl font-serif text-[clamp(4.5rem,11vw,10.5rem)] leading-[.77] tracking-[-.055em]">Objects<br /><em className="pl-[11%] text-[#d6c4b0]">with intent.</em></h1>
              <p className="mt-10 max-w-sm text-sm leading-7 text-[#eee7dc]/68">A living archive of tactile systems, architectural hardware, and the details that hold a room together.</p>
            </div>
            <div className="flex items-end justify-between border-t border-[#eee7dc]/25 pt-4 text-[9px] uppercase tracking-[0.22em] text-[#eee7dc]/55 md:col-span-4 md:block md:border-l md:border-t-0 md:pl-7 md:pt-0">
              <span className="max-w-[160px] leading-5">Amman, Jordan<br />Since 1977</span>
              <Anchor href="#collection" className="group mt-8 flex items-center gap-3 text-[#eee7dc]">Enter the archive <ArrowDown size={16} className="transition-transform group-hover:translate-y-1" /></Anchor>
            </div>
          </div>
          <span className="absolute bottom-5 right-6 text-[9px] uppercase tracking-[0.25em] text-[#eee7dc]/45 md:right-12">01 / 04</span>
        </section>

        <section id="collection" className="bg-[#eee7dc] px-6 py-20 text-[#241c18] md:px-12 md:py-28">
          <div className="mx-auto max-w-[1480px]">
            <div className="flex flex-col justify-between gap-8 border-b border-[#241c18]/20 pb-8 md:flex-row md:items-end">
              <div><Kicker>Selected inventory</Kicker><h2 className="mt-5 font-serif text-5xl leading-none md:text-7xl">The archive</h2></div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button type="button" key={filter} onClick={() => setActive(filter)} className={`border px-3 py-2 text-[9px] uppercase tracking-[0.18em] transition-colors ${active === filter ? "border-[#a4382d] bg-[#a4382d] text-[#eee7dc]" : "border-[#241c18]/25 text-[#241c18]/65 hover:border-[#a4382d] hover:text-[#a4382d]"}`}>{filter}</button>
                ))}
              </div>
            </div>
            <div className="grid gap-px bg-[#241c18]/20 md:grid-cols-12">
              <article className="group bg-[#eee7dc] py-10 md:col-span-7 md:pr-10">
                <div className="relative aspect-[1.2] overflow-hidden bg-[#d8cec0]"><img src={`${assetRoot}atc-showroom-wide.jpg`} alt="Curated hardware in the ATC showroom" className="h-full w-full object-cover grayscale-[30%] transition-transform duration-700 group-hover:scale-[1.035]" /><span className="absolute left-4 top-4 bg-[#eee7dc] px-3 py-2 text-[9px] uppercase tracking-[0.17em]">01 / 12</span></div>
                <div className="mt-5 flex items-start justify-between"><div><h3 className="font-serif text-3xl">The architectural pull</h3><p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#241c18]/50">Brushed bronze · 320 mm</p></div><button aria-label="Add architectural pull to inquiry" type="button" className="rounded-full border border-[#241c18]/30 p-3 transition-colors hover:border-[#a4382d] hover:text-[#a4382d]"><Plus size={17} strokeWidth={1.5} /></button></div>
              </article>
              <article className="group bg-[#eee7dc] py-10 md:col-span-4 md:col-start-9 md:pt-24">
                <div className="relative aspect-[.83] overflow-hidden bg-[#d8cec0]"><img src={`${assetRoot}atc-trade-workshop.jpg`} alt="Material detail in the ATC workshop" className="h-full w-full object-cover object-center grayscale-[55%] transition-transform duration-700 group-hover:scale-[1.035]" /><span className="absolute left-4 top-4 bg-[#eee7dc] px-3 py-2 text-[9px] uppercase tracking-[0.17em]">04 / 12</span></div>
                <div className="mt-5 flex items-start justify-between"><div><h3 className="font-serif text-3xl">The maker's line</h3><p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#241c18]/50">Hand-finished steel · 1977</p></div><button aria-label="Add maker's line to inquiry" type="button" className="rounded-full border border-[#241c18]/30 p-3 transition-colors hover:border-[#a4382d] hover:text-[#a4382d]"><Plus size={17} strokeWidth={1.5} /></button></div>
              </article>
            </div>
            <div className="mt-10 flex items-center justify-between border-t border-[#241c18]/20 pt-5"><span className="text-[9px] uppercase tracking-[0.2em] text-[#241c18]/50">{active} · 12 objects</span><Anchor href="/catalog" className="group flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a4382d]">View full collection <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Anchor></div>
          </div>
        </section>

        <section className="grid gap-12 border-t border-[#eee7dc]/10 bg-[#2e2420] px-6 py-24 md:grid-cols-12 md:gap-8 md:px-12 md:py-32">
          <div className="md:col-span-5"><Kicker light>Not a catalogue</Kicker><h2 className="mt-7 font-serif text-5xl leading-[.9] md:text-7xl">Come for the object.<br /><em className="text-[#d6c4b0]">Stay for the material.</em></h2></div>
          <div className="md:col-span-5 md:col-start-8 md:pt-16"><p className="text-base leading-7 text-[#eee7dc]/65">The showroom is a working archive: open drawers, compare finishes, and see how a small decision changes the whole room.</p><Anchor href="/showroom" className="group mt-10 inline-flex items-center gap-3 border-b border-[#eee7dc]/35 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] hover:border-[#d36e60] hover:text-[#d36e60]">Visit the showroom <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Anchor></div>
        </section>
      </main>
      <footer className="bg-[#eee7dc] px-6 py-10 text-[#241c18] md:px-12"><div className="mx-auto flex max-w-[1480px] flex-col gap-7 md:flex-row md:items-end md:justify-between"><div><Mark /><p className="mt-5 text-xs text-[#241c18]/55">A considered collection for rooms in progress.</p></div><div className="text-[9px] uppercase tracking-[0.2em] text-[#241c18]/55">Al-Bayader · Amman <span className="mx-3 text-[#a4382d]">/</span> Send an inquiry</div></div></footer>
    </div>
  );
}