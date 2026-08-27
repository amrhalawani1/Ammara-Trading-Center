import { Menu, X } from "lucide-react";
import { useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import "./_group.css";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };

function Link({ href, children, onClick, ...props }: LinkProps) {
  return <a href={href} onClick={(event) => { event.preventDefault(); onClick?.(event); }} {...props}>{children}</a>;
}

function Button({ children, className = "", variant = "default" }: { children: ReactNode; className?: string; variant?: "default" | "outline" }) {
  const style = variant === "outline"
    ? "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground"
    : "bg-primary text-primary-foreground hover:bg-primary/90";
  return <span className={`inline-flex h-14 items-center justify-center whitespace-nowrap px-8 text-base font-medium transition-colors ${style} ${className}`}>{children}</span>;
}

const navLinks = [
  { href: "/catalog", label: "Catalog" }, { href: "/brands", label: "Brands" },
  { href: "/trade", label: "Trade" }, { href: "/showroom", label: "Showroom" },
  { href: "/resources", label: "Resources" }, { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function Brand({ inverted = false }: { inverted?: boolean }) {
  const color = inverted ? "bg-background/50" : "bg-foreground/70";
  const text = inverted ? "text-background" : "text-foreground";
  return <div className="flex flex-col items-start leading-none tracking-wider">
    <div className="flex items-center gap-1.5">
      <div className="flex h-4 gap-[2px]"><div className={`w-[3px] -skew-x-12 ${color}`} /><div className={`w-[3px] -skew-x-12 ${color}`} /><div className={`w-[3px] -skew-x-12 ${color}`} /></div>
      <span className={`font-serif text-lg font-medium tracking-[0.2em] uppercase ${text}`}><span className={inverted ? "text-background/50" : "text-foreground/70"}>A</span><span className="text-primary">MARA</span></span>
    </div>
    {!inverted && <span className="mt-0.5 text-[9px] uppercase tracking-widest text-muted-foreground">Trading Center</span>}
  </div>;
}

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <Link href="/" className="group flex items-center gap-3"><Brand /></Link>
      <nav className="hidden items-center gap-8 md:flex">
        {navLinks.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>)}
        <Button className="h-9 px-5 text-sm"><Link href="/contact">Trade Inquiry</Link></Button>
      </nav>
      <button className="p-2 text-foreground md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
    </div>
    {isMobileMenuOpen && <div className="border-t border-border bg-background md:hidden"><nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
      {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-base font-medium text-foreground transition-colors">{link.label}</Link>)}
      <div className="border-t border-border pt-4"><Button className="w-full"><Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Trade Inquiry</Link></Button></div>
    </nav></div>}
  </header>;
}

function Footer() {
  return <footer className="mt-auto bg-foreground py-16 text-background"><div className="container mx-auto grid grid-cols-1 gap-12 px-4 md:grid-cols-4">
    <div className="space-y-4"><div className="mb-6"><Brand inverted /></div><p className="max-w-xs text-sm leading-relaxed text-background/60">Premium distributor of kitchen systems, furniture fittings, and hardware serving Jordan since 1977.</p></div>
    <div><h4 className="mb-4 text-lg text-primary">Showrooms</h4><address className="space-y-3 text-sm not-italic text-background/60"><p><strong className="mb-1 block font-medium text-background">Al-Bayader</strong>Industrial Area, 8th Circle<br />Amman, Jordan</p><p><strong className="mb-1 mt-4 block font-medium text-background">Al-Wehdat</strong>Building Materials St.<br />Amman, Jordan</p></address></div>
    <div><h4 className="mb-4 text-lg text-primary">Quick Links</h4><ul className="space-y-2 text-sm text-background/60"><li><Link href="/brands" className="transition-colors hover:text-background">Our Brands</Link></li><li><Link href="/trade" className="transition-colors hover:text-background">Trade Portal</Link></li><li><Link href="/resources" className="transition-colors hover:text-background">Resources</Link></li><li><Link href="/about" className="transition-colors hover:text-background">Our Story</Link></li></ul></div>
    <div><h4 className="mb-4 text-lg text-primary">Contact</h4><ul className="space-y-2 text-sm text-background/60"><li>+962 6 581 0000</li><li>info@amara.jo</li><li className="pt-2"><Link href="/contact" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary/80">Send an Inquiry &rarr;</Link></li></ul></div>
  </div><div className="container mx-auto mt-16 flex flex-col items-center justify-between gap-4 border-t border-background/10 px-4 pt-8 text-xs text-background/40 md:flex-row"><p>&copy; {new Date().getFullYear()} Amara Trading Center. All rights reserved.</p><p>A quiet authority in hardware.</p></div></footer>;
}

function TrustItem({ label, value }: { label: string; value: string }) {
  return <div className="first:border-0 first:pl-0 flex flex-col gap-1 border-l border-border pl-4 md:pl-6"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span><span className="font-serif text-lg text-foreground md:text-xl">{value}</span></div>;
}

export function Current() {
  return <div className="atc-home flex min-h-screen w-full flex-col bg-background text-foreground selection:bg-primary/20">
    <Navbar />
    <main className="flex w-full flex-1 flex-col">
      <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-16 md:pt-0"><div className="absolute inset-0 z-0"><img src="/__mockup/images/atc-hero-kitchen.jpg" alt="Premium kitchen hardware detail" className="h-full w-full object-cover object-center opacity-40 grayscale-[20%]" /><div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20 mix-blend-multiply" /><div className="absolute inset-0 bg-background/60" /></div>
        <div className="container relative z-10 mx-auto grid items-center gap-8 px-4 md:grid-cols-12"><div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 md:col-span-7 lg:col-span-6"><div className="space-y-4"><span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Since 1977</span><h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">Quiet authority <br /><span className="italic text-muted-foreground">in hardware.</span></h1></div><p className="max-w-md text-base font-light leading-relaxed text-muted-foreground md:text-lg">We provide architects, fabricators, and homeowners with premium kitchen systems and furniture fittings that speak for themselves.</p><div className="flex flex-col gap-4 pt-4 sm:flex-row"><Button className="w-full rounded-none text-xs font-bold uppercase tracking-widest sm:w-auto"><Link href="/trade">Trade Inquiry</Link></Button><Button variant="outline" className="w-full rounded-none border-foreground/20 text-xs font-bold uppercase tracking-widest hover:border-foreground hover:bg-transparent sm:w-auto"><Link href="/showroom">Book a Visit</Link></Button></div><Link href="/catalog" className="inline-flex w-fit items-center text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:text-primary">Browse the curated catalog <span className="ml-2">&rarr;</span></Link></div></div>
      </section>
      <section className="relative z-20 border-y border-border/60 bg-background"><div className="container mx-auto px-4 py-8"><div className="flex flex-wrap justify-between gap-8 md:justify-start md:gap-16"><TrustItem label="Established" value="1977" /><TrustItem label="Exclusive Brands" value="~30" /><TrustItem label="Showrooms" value="Al-Bayader & Al-Wehdat" /></div></div></section>
      <section className="bg-background py-24 md:py-32"><div className="container mx-auto px-4"><div className="mx-auto mb-16 max-w-2xl text-center md:mb-24"><h2 className="mb-4 text-3xl md:text-4xl">Dedicated to your process</h2><p className="text-sm text-muted-foreground md:text-base">Whether you are scaling a commercial development or perfecting a single kitchen, our showrooms and teams are structured to support how you work.</p></div><div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <Journey href="/trade" image="/__mockup/images/atc-trade-workshop.jpg" alt="Fabricator workshop" type="B2B" title="Architects & Fabricators" copy="Access specification sheets, technical training, and direct procurement channels designed for speed and accountability." action="Enter Trade Portal" />
        <Journey href="/showroom" image="/__mockup/images/atc-showroom-wide.jpg" alt="ATC Showroom" type="B2C" title="Homeowners" copy="Experience the tactile difference of premium hardware. Let our consultants guide you through material choices and system capabilities." action="Plan a Visit" />
      </div></div></section>
      <section className="relative overflow-hidden bg-foreground py-24 text-background md:py-32"><div className="pointer-events-none absolute inset-0 opacity-10"><svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="atc-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#atc-grid-pattern)" /></svg></div><div className="container relative z-10 mx-auto px-4"><div className="grid items-center gap-12 md:grid-cols-12"><div className="space-y-6 md:col-span-5 md:col-start-2"><h2 className="text-3xl leading-tight md:text-5xl">See it.<br /><span className="italic text-primary">Feel it.</span></h2><p className="font-light leading-relaxed text-background/70">A catalog can only tell you dimensions. True quality is understood through weight, motion, and finish. Visit our showrooms in Al-Bayader or Al-Wehdat to explore curated displays of the world's leading hardware systems.</p><div className="pt-4"><Button variant="outline" className="rounded-none border-background/30 text-xs font-bold uppercase tracking-widest text-background hover:bg-background hover:text-foreground"><Link href="/showroom">Showroom Details</Link></Button></div></div><div className="relative md:col-span-5"><div className="relative aspect-[3/4] border border-background/20"><div className="absolute inset-4 border border-background/10" /><img src="/__mockup/images/atc-showroom-wide.jpg" alt="ATC Showroom detail" className="h-full w-full object-cover object-right opacity-80" /></div></div></div></div></section>
    </main>
    <Footer />
  </div>;
}

function Journey({ href, image, alt, type, title, copy, action }: { href: string; image: string; alt: string; type: string; title: string; copy: string; action: string }) {
  return <Link href={href} className="group relative block overflow-hidden border border-border bg-accent/20 p-8 transition-colors hover:border-primary/30 md:p-12"><div className="relative mb-8 aspect-[4/3] overflow-hidden bg-muted"><img src={image} alt={alt} className="h-full w-full object-cover grayscale-[30%] transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0" /></div><div className="space-y-4"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{type}</span><h3 className="text-2xl">{title}</h3><p className="pb-4 text-sm leading-relaxed text-muted-foreground">{copy}</p><div className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-foreground transition-colors group-hover:text-primary">{action} <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span></div></div></Link>;
}