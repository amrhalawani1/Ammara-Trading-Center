import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4 md:col-span-1">
          <div className="flex flex-col items-start leading-none tracking-wider mb-6">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-[2px] h-4">
                <div className="w-[3px] bg-background/50 -skew-x-12" />
                <div className="w-[3px] bg-background/50 -skew-x-12" />
                <div className="w-[3px] bg-background/50 -skew-x-12" />
              </div>
              <span className="font-serif text-lg font-medium text-background tracking-[0.2em] uppercase">
                <span className="text-background/50">A</span><span className="text-primary">MARA</span>
              </span>
            </div>
          </div>
          <p className="text-sm text-background/60 max-w-xs leading-relaxed">
            Premium distributor of kitchen systems, furniture fittings, and hardware serving Jordan since 1977.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-primary">Showrooms</h4>
          <address className="not-italic text-sm text-background/60 space-y-3">
            <p>
              <strong className="text-background block font-medium mb-1">Al-Bayader</strong>
              Industrial Area, 8th Circle<br />
              Amman, Jordan
            </p>
            <p>
              <strong className="text-background block font-medium mb-1 mt-4">Al-Wehdat</strong>
              Building Materials St.<br />
              Amman, Jordan
            </p>
          </address>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-primary">Quick Links</h4>
          <ul className="space-y-2 text-sm text-background/60">
            <li><Link href="/brands" className="hover:text-background transition-colors">Our Brands</Link></li>
            <li><Link href="/trade" className="hover:text-background transition-colors">Trade Portal</Link></li>
            <li><Link href="/resources" className="hover:text-background transition-colors">Resources</Link></li>
            <li><Link href="/about" className="hover:text-background transition-colors">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-4 text-primary">Contact</h4>
          <ul className="space-y-2 text-sm text-background/60">
            <li>+962 6 581 0000</li>
            <li>info@amara.jo</li>
            <li className="pt-2">
              <Link href="/contact" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors uppercase tracking-wider text-xs font-bold">
                Send an Inquiry &rarr;
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-background/10 text-xs text-background/40 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Amara Trading Center. All rights reserved.</p>
        <p>A quiet authority in hardware.</p>
      </div>
    </footer>
  );
}
