import { Link } from "wouter";
import { BrandLogo } from "@/components/brand-logo";
import { company } from "@/lib/content";

export function Footer() {
  return (
    <footer className="dark bg-background text-foreground py-16 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4 md:col-span-1">
          <div className="mb-8">
            <BrandLogo size="md" />
          </div>
          <p className="text-sm text-foreground/60 max-w-xs leading-relaxed">
            Premium distributor of kitchen systems, furniture fittings, and hardware serving Jordan since {company.established}.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-primary">Showrooms</h4>
          <address className="not-italic text-sm text-foreground/60 space-y-3">
            {company.showrooms.map((showroom) => (
              <p key={showroom.name}>
                <strong className="text-foreground block font-medium mb-1">{showroom.name}</strong>
                {showroom.addressLines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            ))}
          </address>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-primary">Quick Links</h4>
          <ul className="space-y-2 text-sm text-foreground/60">
            <li><Link href="/brands" className="hover:text-foreground transition-colors">Our Brands</Link></li>
            <li><Link href="/resources" className="hover:text-foreground transition-colors">Resources</Link></li>
            <li><Link href="/lists" className="hover:text-foreground transition-colors">Project shortlists</Link></li>
            <li><Link href="/about" className="hover:text-foreground transition-colors">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-primary">Contact</h4>
          <ul className="space-y-2 text-sm text-foreground/60">
            <li>{company.showrooms[0].phone}</li>
            <li>
              <a href={`mailto:${company.email}`} className="hover:text-foreground transition-colors">
                {company.email}
              </a>
            </li>
            {company.contactUnconfirmed ? (
              <li className="pt-1 text-[10px] uppercase tracking-widest text-foreground/40">Unconfirmed — verify before print</li>
            ) : null}
            <li className="pt-2">
              <Link href="/contact" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors uppercase tracking-wider text-xs font-bold">
                Send an Inquiry &rarr;
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-foreground/10 text-xs text-foreground/40 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</p>
        <p>A quiet authority in hardware.</p>
      </div>
    </footer>
  );
}
