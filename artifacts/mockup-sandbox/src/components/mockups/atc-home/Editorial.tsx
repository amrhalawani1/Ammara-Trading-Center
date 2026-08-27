import { ArrowDownRight, ArrowUpRight, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import "./_group.css";

const assetRoot = "/__mockup/images/";

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
      className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9d2f24] focus-visible:ring-offset-4 ${className}`}
    >
      {children}
    </a>
  );
}

function Mark({ light = false }: { light?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${light ? "text-[#f2ede5]" : "text-[#2b211c]"}`}>
      <span className="flex h-6 items-end gap-[3px]" aria-hidden="true">
        <i className={`h-3 w-[3px] -skew-x-12 ${light ? "bg-[#f2ede5]/70" : "bg-[#2b211c]/80"}`} />
        <i className={`h-5 w-[3px] -skew-x-12 ${light ? "bg-[#f2ede5]/70" : "bg-[#2b211c]/80"}`} />
        <i className="h-4 w-[3px] -skew-x-12 bg-[#9d2f24]" />
      </span>
      <span className="font-serif text-[21px] uppercase leading-none tracking-[0.2em]">
        <span className={light ? "text-[#f2ede5]/65" : "text-[#2b211c]/65"}>A</span>mara
      </span>
      <span className={`hidden border-l pl-3 text-[9px] uppercase tracking-[0.25em] sm:block ${light ? "border-[#f2ede5]/25 text-[#f2ede5]/60" : "border-[#2b211c]/20 text-[#2b211c]/55"}`}>
        Trading Center
      </span>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["The collection", "/catalog"],
    ["Our partners", "/brands"],
    ["Showroom", "/showroom"],
    ["Trade", "/trade"],
  ];
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-12 md:py-8">
         <Anchor href="/" aria-label="Amara Trading Center home"><Mark light /></Anchor>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
             <Anchor key={href} href={href} className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f2ede5]/75 transition-colors hover:text-[#f2ede5]">
              {label}
            </Anchor>
          ))}
           <Anchor href="/contact" className="border-b border-[#e2a093] pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f2ede5]">
            Start an inquiry
          </Anchor>
        </nav>
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
           className="rounded-full p-2 text-[#f2ede5] transition-colors hover:bg-[#f2ede5]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a093] md:hidden"
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <nav className="mx-4 border-t border-[#2b211c]/10 bg-[#f2ede5] px-6 py-5 shadow-xl md:hidden">
          {links.map(([label, href]) => (
            <Anchor key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-[#2b211c]/10 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#2b211c]">
              {label}
            </Anchor>
          ))}
          <Anchor href="/contact" onClick={() => setOpen(false)} className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-[#9d2f24]">
            Start an inquiry <ArrowUpRight className="ml-2 h-4 w-4" />
          </Anchor>
        </nav>
      )}
    </header>
  );
}

function SectionKicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className={`flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] ${light ? "text-[#f2ede5]/60" : "text-[#9d2f24]"}`}>
      <span className={`h-px w-8 ${light ? "bg-[#9d2f24]" : "bg-[#9d2f24]"}`} />
      {children}
    </div>
  );
}

export function Editorial() {
  return (
    <div className="atc-home min-h-screen w-full overflow-hidden bg-[#f2ede5] text-[#2b211c] selection:bg-[#9d2f24]/20">
      <Header />
      <main>
        <section className="relative flex min-h-[min(850px,100dvh)] items-end overflow-hidden px-6 pb-12 pt-32 md:px-12 md:pb-16">
          <img
            src={`${assetRoot}atc-hero-kitchen.jpg`}
            alt="Close detail of a dark kitchen pull against warm timber"
            className="absolute inset-0 h-full w-full object-cover object-center grayscale-[32%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1d1713]/75 via-[#1d1713]/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d1713]/70 via-transparent to-[#1d1713]/10" />
          <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-end gap-12 md:grid-cols-12">
            <div className="md:col-span-8 lg:col-span-7">
              <SectionKicker light>Amman · Jordan · Est. 1977</SectionKicker>
              <h1 className="mt-7 max-w-3xl font-serif text-[clamp(3.75rem,9vw,8.75rem)] leading-[0.84] tracking-[-0.045em] text-[#f2ede5]">
                Quiet authority
                <span className="block pl-[12%] pt-3 italic text-[#f2ede5]/75">in hardware.</span>
              </h1>
              <p className="mt-10 max-w-md text-sm leading-7 text-[#f2ede5]/80 md:text-base">
                A considered collection of kitchen systems, furniture fittings, and the small mechanisms that make a room feel resolved.
              </p>
            </div>
            <div className="flex items-end justify-between border-t border-[#f2ede5]/30 pt-4 text-[10px] uppercase tracking-[0.2em] text-[#f2ede5]/65 md:col-span-4 md:block md:border-l md:border-t-0 md:pl-7 md:pt-0">
              <span className="block max-w-[130px] leading-5">Curated for the way spaces are made</span>
              <Anchor href="/catalog" className="group mt-8 flex items-center gap-3 text-[#f2ede5]">
                Explore the collection
                <ArrowDownRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
              </Anchor>
            </div>
          </div>
          <span className="absolute bottom-5 right-6 text-[9px] uppercase tracking-[0.25em] text-[#f2ede5]/50 md:right-12">01 / 04</span>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-36">
          <div className="grid gap-14 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4">
              <SectionKicker>The ATC point of view</SectionKicker>
              <p className="mt-8 max-w-[250px] text-xs leading-6 text-[#2b211c]/60">Good hardware disappears into the rhythm of a room. Great hardware gives it rhythm.</p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <h2 className="max-w-3xl font-serif text-4xl leading-[0.98] tracking-[-0.03em] md:text-6xl">
                Materials chosen for their <em className="text-[#9d2f24]">quiet confidence.</em>
              </h2>
              <p className="mt-9 max-w-lg text-sm leading-7 text-[#2b211c]/65 md:text-base">
                Since 1977, ATC has helped Jordanian makers, architects, and homeowners specify the details that endure. We look closely at finish, movement, proportion, and the feeling a well-made object leaves behind.
              </p>
              <Anchor href="/about" className="group mt-9 inline-flex items-center gap-3 border-b border-[#2b211c]/30 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-[#9d2f24] hover:text-[#9d2f24]">
                Our story <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Anchor>
            </div>
          </div>
        </section>

        <section className="bg-[#ded5c9] px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-12 flex items-end justify-between gap-6 md:mb-16">
              <div>
                <SectionKicker>In good company</SectionKicker>
                <h2 className="mt-5 max-w-xl font-serif text-4xl leading-none md:text-6xl">Partners with a point of view.</h2>
              </div>
              <Anchor href="/brands" className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9d2f24] md:flex">All partners <ArrowUpRight size={15} /></Anchor>
            </div>
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <div className="relative aspect-[1.12] overflow-hidden">
                  <img src={`${assetRoot}atc-showroom-wide.jpg`} alt="ATC showroom with curated hardware displays" className="h-full w-full object-cover grayscale-[35%] transition-transform duration-700 hover:scale-[1.025]" />
                  <span className="absolute bottom-5 left-5 bg-[#f2ede5]/90 px-3 py-2 text-[9px] uppercase tracking-[0.2em]">The collection, in context</span>
                </div>
              </div>
              <div className="md:col-span-4 md:col-start-9 md:pb-3">
                <p className="font-serif text-3xl leading-tight md:text-4xl">The right detail is never incidental.</p>
                <p className="mt-6 text-sm leading-6 text-[#2b211c]/65">We represent a considered group of international partners, selected for the integrity of their systems and the depth of their craft.</p>
                <Anchor href="/brands" className="mt-8 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9d2f24] md:hidden">View partners <ArrowUpRight size={15} /></Anchor>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f2ede5] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-12 md:grid-cols-12 md:items-end">
              <div className="md:col-span-4">
                <SectionKicker>Study the detail</SectionKicker>
                <h2 className="mt-7 max-w-sm font-serif text-5xl leading-[0.92] tracking-[-0.035em] md:text-7xl">Material, movement, context.</h2>
                <p className="mt-7 max-w-xs text-sm leading-6 text-[#2b211c]/60">
                  A visual reference wall for the qualities we look for: honest finishes, precise motion, and hardware that belongs to the room.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 md:col-span-7 md:col-start-6">
                <div className="group">
                  <div className="aspect-[1.4] overflow-hidden bg-[#ded5c9]">
                    <img
                      src={`${assetRoot}editorial-dnd-bronze.webp`}
                      alt="Bronze handle finishes photographed as a material study"
                      className="h-full w-full object-cover grayscale-[18%] transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4 border-t border-[#2b211c]/15 pt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Material / bronze</span>
                    <span className="text-[9px] uppercase tracking-[0.16em] text-[#2b211c]/45">D&amp;D reference</span>
                  </div>
                </div>
                <div className="group sm:mt-16">
                  <div className="aspect-[1.4] overflow-hidden bg-[#ded5c9]">
                    <img
                      src={`${assetRoot}editorial-blum-hinges.jpg`}
                      alt="Blum hinge system shown in a cabinet application"
                      className="h-full w-full object-cover grayscale-[28%] transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4 border-t border-[#2b211c]/15 pt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Movement / hinge</span>
                    <span className="text-[9px] uppercase tracking-[0.16em] text-[#2b211c]/45">Blum reference</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 grid gap-5 border-t border-[#2b211c]/15 pt-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <p className="max-w-xl text-xs leading-5 text-[#2b211c]/55">
                Reference imagery shown for visual direction only. ATC’s curated collection is presented separately through its partner catalog.
              </p>
              <Anchor href="/catalog" className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9d2f24]">
                Enter the ATC catalog <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Anchor>
            </div>
          </div>
        </section>

        <section className="bg-[#2b211c] px-6 py-24 text-[#f2ede5] md:px-12 md:py-32">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-16 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-5">
                <SectionKicker light>Made for the work</SectionKicker>
                <h2 className="mt-7 font-serif text-5xl leading-[0.95] tracking-[-0.03em] md:text-7xl">A better detail starts with a better conversation.</h2>
              </div>
              <div className="md:col-span-5 md:col-start-8 md:pt-12">
                <p className="text-base leading-7 text-[#f2ede5]/65">Whether you are working through a specification or imagining one perfect kitchen, our team can help you move from an idea to the right system.</p>
                <div className="mt-12 space-y-5 border-t border-[#f2ede5]/20 pt-5">
                  <Anchor href="/trade" className="group flex items-center justify-between border-b border-[#f2ede5]/20 pb-5 text-xl transition-colors hover:text-[#e2a093]">
                    <span><small className="mr-4 text-[9px] uppercase tracking-[0.2em] text-[#9d2f24]">01</small> Trade inquiries</span>
                    <ArrowUpRight size={19} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Anchor>
                  <Anchor href="/showroom" className="group flex items-center justify-between border-b border-[#f2ede5]/20 pb-5 text-xl transition-colors hover:text-[#e2a093]">
                    <span><small className="mr-4 text-[9px] uppercase tracking-[0.2em] text-[#9d2f24]">02</small> Visit the showroom</span>
                    <ArrowUpRight size={19} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Anchor>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative min-h-[620px] overflow-hidden px-6 py-24 md:px-12 md:py-32">
          <img src={`${assetRoot}atc-trade-workshop.jpg`} alt="Craftsperson reviewing a technical drawing in a workshop" className="absolute inset-0 h-full w-full object-cover object-center grayscale-[45%]" />
          <div className="absolute inset-0 bg-[#2b211c]/55" />
          <div className="relative z-10 mx-auto flex min-h-[370px] max-w-[1440px] flex-col justify-between text-[#f2ede5]">
            <div className="flex justify-between">
              <SectionKicker light>For the people who make</SectionKicker>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#f2ede5]/60">03 / 04</span>
            </div>
            <div className="max-w-2xl">
              <h2 className="font-serif text-5xl leading-[0.92] tracking-[-0.04em] md:text-8xl">For rooms that earn their place.</h2>
              <p className="mt-8 max-w-md text-sm leading-6 text-[#f2ede5]/75">Technical support, considered recommendations, and a direct line to the details your project depends on.</p>
              <Anchor href="/trade" className="group mt-8 inline-flex items-center gap-3 border-b border-[#f2ede5]/50 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-[#e2a093] hover:text-[#e2a093]">Enter the trade route <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Anchor>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-12 md:py-36">
          <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionKicker>Come closer</SectionKicker>
              <h2 className="mt-7 font-serif text-5xl leading-none md:text-7xl">Feel the difference.</h2>
            </div>
            <div className="md:col-span-5 md:col-start-7 md:pt-16">
              <p className="text-xl leading-8 text-[#2b211c]/75 md:text-2xl">Visit us in Al-Bayader or Al-Wehdat. See the finishes in daylight. Open the drawer. Ask a better question.</p>
              <Anchor href="/showroom" className="group mt-10 inline-flex items-center gap-3 bg-[#9d2f24] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f2ede5] transition-colors hover:bg-[#7e261e]">Plan your visit <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Anchor>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#ded5c9] px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div><Mark /><p className="mt-5 max-w-xs text-xs leading-5 text-[#2b211c]/55">Premium kitchen systems and furniture fittings, serving Jordan since 1977.</p></div>
          <div className="flex flex-col gap-3 text-[10px] uppercase tracking-[0.17em] text-[#2b211c]/60 md:items-end"><span>Al-Bayader · Al-Wehdat · Amman</span><Anchor href="/contact" className="text-[#9d2f24] hover:underline">Send an inquiry</Anchor></div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1440px] justify-between border-t border-[#2b211c]/15 pt-5 text-[9px] uppercase tracking-[0.2em] text-[#2b211c]/45"><span>© {new Date().getFullYear()} Amara Trading Center</span><span className="hidden sm:block">Quiet authority in hardware.</span></div>
      </footer>
    </div>
  );
}