import { ArrowDownRight, ArrowUpRight, Menu, X } from "lucide-react";
import { createContext, useContext, useState, type FormEvent, type ReactNode } from "react";
import "./_group.css";

const assetRoot = "/__mockup/images/";
type View = "home" | "catalog" | "brands" | "product" | "trade" | "showroom" | "resources" | "about" | "contact";
const NavContext = createContext<((href: string) => void) | null>(null);

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
  const navigate = useContext(NavContext);
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        navigate?.(href);
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
        <nav className="mx-4 border-t border-[#2b211c]/10 bg-white px-6 py-5 shadow-xl md:hidden">
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

function FlowHeader({ view, eyebrow, title, detail }: { view: Exclude<View, "home">; eyebrow: string; title: string; detail: string }) {
  return (
    <section className="border-b border-[#2b211c]/15 px-6 pb-20 pt-36 md:px-12 md:pb-28 md:pt-48">
      <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <SectionKicker>{eyebrow}</SectionKicker>
          <h1 className="mt-7 max-w-4xl font-serif text-6xl leading-[0.88] tracking-[-0.045em] md:text-8xl">{title}</h1>
        </div>
        <div className="md:col-span-4 md:pb-2">
          <p className="max-w-xs text-sm leading-6 text-[#2b211c]/60">{detail}</p>
          <span className="mt-8 block text-[9px] uppercase tracking-[0.22em] text-[#9d2f24]">ATC / {view}</span>
        </div>
      </div>
    </section>
  );
}

function FlowPage({ view }: { view: Exclude<View, "home"> }) {
  const [category, setCategory] = useState("All");
  const [submitted, setSubmitted] = useState(false);
  const categories = ["All", "Kitchen systems", "Furniture fittings", "Hardware"];
  const products = [
    { name: "Sensys hinge system", brand: "Hettich", type: "Furniture fittings", image: "atc-hero-kitchen.jpg", copy: "Soft-close movement for a quieter, more resolved cabinet." },
    { name: "Free Fold door system", brand: "Salice", type: "Kitchen systems", image: "atc-showroom-wide.jpg", copy: "A considered opening solution for wide overhead storage." },
    { name: "Arena Pure", brand: "Kesseböhmer", type: "Kitchen systems", image: "atc-trade-workshop.jpg", copy: "Practical access and clean organization inside the cabinet." },
  ];
  const visibleProducts = category === "All" ? products : products.filter((product) => product.type === category);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (view === "catalog") {
    return (
      <>
        <FlowHeader view={view} eyebrow="The collection" title="A considered library of movement." detail="Browse the systems, fittings, and hardware we keep close at hand for Jordanian makers, architects, and homeowners." />
        <section className="px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-wrap gap-3 border-b border-[#2b211c]/15 pb-8">
              {categories.map((item) => (
                <button key={item} type="button" onClick={() => setCategory(item)} className={`border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${category === item ? "border-[#9d2f24] bg-[#9d2f24] text-[#f2ede5]" : "border-[#2b211c]/20 text-[#2b211c]/65 hover:border-[#9d2f24] hover:text-[#9d2f24]"}`}>
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {visibleProducts.map((product, index) => (
                <article key={product.name} className={`group ${index === 1 ? "md:mt-14" : ""}`}>
                  <div className="aspect-[0.9] overflow-hidden bg-[#ded5c9]">
                    <img src={`${assetRoot}${product.image}`} alt={`${product.name} application`} className="h-full w-full object-cover grayscale-[32%] transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="border-b border-[#2b211c]/20 py-5">
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.18em] text-[#9d2f24]"><span>{product.brand}</span><span>{product.type}</span></div>
                    <h2 className="mt-4 font-serif text-3xl">{product.name}</h2>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-[#2b211c]/60">{product.copy}</p>
                    <Anchor href="/product" className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9d2f24]">View product <ArrowUpRight size={14} /></Anchor>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  if (view === "brands") {
    return (
      <>
        <FlowHeader view={view} eyebrow="Our partners" title="The right company behind the right detail." detail="A focused portfolio of international specialists, represented in Jordan with the context and support to specify them well." />
        <section className="bg-[#ded5c9] px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-px border border-[#2b211c]/15 bg-[#2b211c]/15 sm:grid-cols-2 lg:grid-cols-3">
              {["Hettich", "Salice", "Kesseböhmer", "Vibo", "Olivari", "Simonswerk"].map((brand, index) => (
                <Anchor key={brand} href="/product" className="group min-h-44 bg-[#ded5c9] p-7 transition-colors hover:bg-[#f2ede5]">
                  <span className="text-[9px] uppercase tracking-[0.18em] text-[#9d2f24]">0{index + 1} / Partner</span>
                  <span className="mt-12 block font-serif text-4xl transition-transform group-hover:translate-x-1">{brand}</span>
                  <span className="mt-3 block text-xs text-[#2b211c]/55">{index % 2 === 0 ? "Kitchen systems & movement" : "Furniture fittings & hardware"}</span>
                </Anchor>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  if (view === "product") {
    return (
      <>
        <FlowHeader view={view} eyebrow="Product study / Hettich" title="Sensys hinge system." detail="A soft-close hinge system for the moments that should feel effortless. Designed for clean lines, consistent movement, and dependable installation." />
        <section className="grid gap-12 bg-[#2b211c] px-6 py-16 text-[#f2ede5] md:grid-cols-12 md:px-12 md:py-24">
          <div className="md:col-span-7"><img src={`${assetRoot}atc-hero-kitchen.jpg`} alt="Sensys hinge system shown in a kitchen application" className="aspect-[1.18] h-full w-full object-cover grayscale-[40%]" /></div>
          <div className="md:col-span-4 md:col-start-9 md:pt-4">
            <SectionKicker light>Specification notes</SectionKicker>
            <div className="mt-9 space-y-5 border-t border-[#f2ede5]/20 pt-5 text-sm text-[#f2ede5]/70">
              <p className="flex justify-between gap-5"><span>Application</span><span className="text-right text-[#f2ede5]">Concealed cabinet doors</span></p>
              <p className="flex justify-between gap-5"><span>Movement</span><span className="text-right text-[#f2ede5]">Integrated soft close</span></p>
              <p className="flex justify-between gap-5"><span>Support</span><span className="text-right text-[#f2ede5]">ATC trade guidance</span></p>
            </div>
            <Anchor href="/trade" className="mt-12 inline-flex items-center gap-3 bg-[#9d2f24] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f2ede5]">Request specification <ArrowUpRight size={15} /></Anchor>
          </div>
        </section>
      </>
    );
  }

  if (view === "trade") {
    return (
      <>
        <FlowHeader view={view} eyebrow="Trade / B2B" title="Bring us the detail your project depends on." detail="A direct route for architects, fabricators, contractors, and procurement teams who need one accountable partner across the specification." />
        <section className="grid gap-16 px-6 py-16 md:grid-cols-12 md:px-12 md:py-24">
          <div className="md:col-span-5"><SectionKicker>Why ATC</SectionKicker><h2 className="mt-7 font-serif text-5xl leading-[0.94] md:text-7xl">One conversation. A deeper portfolio.</h2><p className="mt-8 max-w-sm text-sm leading-7 text-[#2b211c]/60">From product selection to technical support, we help your team move with confidence through the details that make a project hold together.</p></div>
          <form onSubmit={submit} className="space-y-5 md:col-span-5 md:col-start-8">
            {submitted ? <div className="border border-[#9d2f24]/35 bg-[#f2e3dc] p-8"><SectionKicker>Inquiry received</SectionKicker><h3 className="mt-6 font-serif text-4xl">We will come back to you shortly.</h3><p className="mt-5 text-sm leading-6 text-[#2b211c]/65">Your project context is the right place to begin.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9d2f24]">Send another inquiry</button></div> : <><label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2b211c]/55">Your name<input required name="name" className="mt-3 block w-full border-b border-[#2b211c]/25 bg-transparent px-0 py-3 text-base outline-none focus:border-[#9d2f24]" /></label><label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2b211c]/55">Project type<input required name="project" className="mt-3 block w-full border-b border-[#2b211c]/25 bg-transparent px-0 py-3 text-base outline-none focus:border-[#9d2f24]" /></label><label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2b211c]/55">What are you specifying?<textarea required name="message" rows={4} className="mt-3 block w-full resize-none border-b border-[#2b211c]/25 bg-transparent px-0 py-3 text-base outline-none focus:border-[#9d2f24]" /></label><button type="submit" className="mt-6 bg-[#9d2f24] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f2ede5] transition-colors hover:bg-[#7e261e]">Start the conversation <ArrowUpRight className="ml-2 inline" size={15} /></button></>}
          </form>
        </section>
      </>
    );
  }

  if (view === "showroom") {
    return (
      <>
        <FlowHeader view={view} eyebrow="Come closer" title="The details make more sense in the room." detail="Two Amman showrooms, arranged for the slower work of comparing finishes, opening systems, and the feeling of a resolved space." />
        <section className="grid gap-10 bg-[#ded5c9] px-6 py-16 md:grid-cols-12 md:px-12 md:py-24">
          <div className="md:col-span-8"><img src={`${assetRoot}atc-showroom-wide.jpg`} alt="ATC showroom with curated hardware displays" className="aspect-[1.45] h-full w-full object-cover grayscale-[30%]" /></div>
          <div className="flex flex-col justify-end md:col-span-3 md:col-start-10"><SectionKicker>Visit ATC</SectionKicker><p className="mt-7 font-serif text-3xl leading-tight">Al-Bayader or Al-Wehdat. Open the drawer. Ask a better question.</p><Anchor href="/contact" className="mt-9 inline-flex items-center gap-3 border-b border-[#2b211c]/25 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9d2f24]">Plan your visit <ArrowUpRight size={15} /></Anchor></div>
        </section>
        <section className="grid gap-px bg-[#2b211c]/15 md:grid-cols-2"><div className="bg-[#f2ede5] p-8 md:p-12"><span className="text-[9px] uppercase tracking-[0.18em] text-[#9d2f24]">01 / Al-Bayader</span><h2 className="mt-10 font-serif text-4xl">Al-Bayader showroom</h2><p className="mt-4 text-sm text-[#2b211c]/60">Amman · +962 6 5811 896</p></div><div className="bg-[#f2ede5] p-8 md:p-12"><span className="text-[9px] uppercase tracking-[0.18em] text-[#9d2f24]">02 / Al-Wehdat</span><h2 className="mt-10 font-serif text-4xl">Al-Wehdat showroom</h2><p className="mt-4 text-sm text-[#2b211c]/60">Amman · +962 6 4707 504</p></div></section>
      </>
    );
  }

  if (view === "resources") {
    return (
      <>
        <FlowHeader view={view} eyebrow="Reference room" title="Useful before, during, and after the install." detail="Practical guidance for specifying with confidence: brand references, product care, technical support, and the questions worth asking early." />
        <section className="px-6 py-16 md:px-12 md:py-24"><div className="mx-auto max-w-[1000px] divide-y divide-[#2b211c]/15 border-t border-[#2b211c]/15">{["Brand guides", "Specification tips", "Product care & maintenance", "Training & technical support", "Articles and notes"].map((item, index) => <button key={item} type="button" onClick={() => setSubmitted(true)} className="flex w-full items-center justify-between py-7 text-left transition-colors hover:text-[#9d2f24]"><span><small className="mr-6 text-[9px] uppercase tracking-[0.18em] text-[#9d2f24]">0{index + 1}</small><span className="font-serif text-3xl">{item}</span></span><ArrowDownRight size={18} /></button>)}</div>{submitted && <p className="mt-8 text-sm text-[#9d2f24]">Resource access is prepared for the next content phase.</p>}</section>
      </>
    );
  }

  if (view === "about") {
    return (
      <>
        <FlowHeader view={view} eyebrow="Since 1977" title="A long view of the small things." detail="ATC began with a belief that the details of a room deserve the same care as the room itself. That belief still guides the collection." />
        <section className="grid gap-14 px-6 py-16 md:grid-cols-12 md:px-12 md:py-28"><div className="md:col-span-4"><SectionKicker>Quiet authority</SectionKicker><p className="mt-8 max-w-xs text-sm leading-7 text-[#2b211c]/60">Our role is not to make the most noise. It is to know the right mechanism, the right finish, and the right moment to recommend it.</p></div><div className="md:col-span-7 md:col-start-6"><p className="font-serif text-5xl leading-[0.95] md:text-7xl">A trusted Jordanian home for international craft.</p><p className="mt-10 max-w-lg text-sm leading-7 text-[#2b211c]/60">Founded in 1977, Amara Trading Center brings together kitchen systems, furniture fittings, and hardware from specialist makers around the world—supported locally by people who understand how spaces are made.</p></div></section>
      </>
    );
  }

  return (
    <>
      <FlowHeader view="contact" eyebrow="Contact ATC" title="Start with the question." detail="For a showroom visit, a product reference, or a project conversation, send us the context and we will point you to the right next step." />
      <section className="grid gap-16 px-6 py-16 md:grid-cols-12 md:px-12 md:py-24">
        <div className="md:col-span-4"><SectionKicker>Find us</SectionKicker><div className="mt-9 space-y-7 text-sm text-[#2b211c]/65"><p><strong className="block text-[#2b211c]">Al-Bayader</strong>+962 6 5811 896</p><p><strong className="block text-[#2b211c]">Al-Wehdat</strong>+962 6 4707 504</p><p><strong className="block text-[#2b211c]">General inquiries</strong>sales@atc-jo.com</p></div></div>
        <form onSubmit={submit} className="space-y-5 md:col-span-5 md:col-start-7">{submitted ? <div className="border border-[#9d2f24]/35 bg-[#f2e3dc] p-8"><SectionKicker>Message received</SectionKicker><h3 className="mt-6 font-serif text-4xl">Thank you. We have the thread.</h3><button type="button" onClick={() => setSubmitted(false)} className="mt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9d2f24]">Send another message</button></div> : <><label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2b211c]/55">Name<input required className="mt-3 block w-full border-b border-[#2b211c]/25 bg-transparent px-0 py-3 outline-none focus:border-[#9d2f24]" /></label><label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2b211c]/55">Email<input required type="email" className="mt-3 block w-full border-b border-[#2b211c]/25 bg-transparent px-0 py-3 outline-none focus:border-[#9d2f24]" /></label><label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2b211c]/55">Message<textarea required rows={4} className="mt-3 block w-full resize-none border-b border-[#2b211c]/25 bg-transparent px-0 py-3 outline-none focus:border-[#9d2f24]" /></label><button type="submit" className="mt-6 bg-[#9d2f24] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f2ede5]">Send inquiry <ArrowUpRight className="ml-2 inline" size={15} /></button></>}</form>
      </section>
    </>
  );
}

export function Editorial() {
  const [view, setView] = useState<View>("home");
  const navigate = (href: string) => {
    const next = href.replace("/", "") as View;
    setView(next || "home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <NavContext.Provider value={navigate}>
     <div className="atc-home min-h-screen w-full overflow-hidden bg-white text-[#2b211c] selection:bg-[#9d2f24]/20">
      <Header />
      <main>
        {view !== "home" && <div className="border-b border-[#2b211c]/15 px-6 py-4 md:px-12"><div className="mx-auto flex max-w-[1440px] items-center justify-between text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2b211c]/50"><Anchor href="/">Back to the opening</Anchor><span>Flow prototype / {view}</span></div></div>}
        {view !== "home" && <FlowPage view={view} />}
        {view === "home" && <>
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
                   <span className="absolute bottom-5 left-5 bg-white/90 px-3 py-2 text-[9px] uppercase tracking-[0.2em]">The collection, in context</span>
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

         <section className="bg-white px-6 py-24 md:px-12 md:py-32">
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

         <section className="bg-white px-6 py-24 md:px-12 md:py-36">
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
        </>}
      </main>
       {view === "home" && <footer className="bg-[#ded5c9] px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div><Mark /><p className="mt-5 max-w-xs text-xs leading-5 text-[#2b211c]/55">Premium kitchen systems and furniture fittings, serving Jordan since 1977.</p></div>
          <div className="flex flex-col gap-3 text-[10px] uppercase tracking-[0.17em] text-[#2b211c]/60 md:items-end"><span>Al-Bayader · Al-Wehdat · Amman</span><Anchor href="/contact" className="text-[#9d2f24] hover:underline">Send an inquiry</Anchor></div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1440px] justify-between border-t border-[#2b211c]/15 pt-5 text-[9px] uppercase tracking-[0.2em] text-[#2b211c]/45"><span>© {new Date().getFullYear()} Amara Trading Center</span><span className="hidden sm:block">Quiet authority in hardware.</span></div>
      </footer>}
    </div>
    </NavContext.Provider>
  );
}