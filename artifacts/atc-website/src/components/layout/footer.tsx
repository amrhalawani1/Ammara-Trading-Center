import { ArrowUpRight, Instagram } from "lucide-react";
import { Link } from "wouter";
import { BrandLogo } from "@/components/brand-logo";
import { company } from "@/lib/content";
import { cn } from "@/lib/utils";

const DIRECTORY = [
  {
    label: "Visit",
    links: [
      { href: "/catalog", label: "Products" },
      { href: "/brands", label: "Brands" },
      { href: "/showroom", label: "Showrooms" },
      { href: "/projects", label: "Projects" },
    ],
  },
  {
    label: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/resources", label: "Resources" },
      { href: "/catalogues", label: "Manufacturer catalogues" },
      { href: "/lists", label: "Quote" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export function Footer() {
  return (
    <footer className="dark mt-auto border-t border-white/10 bg-background text-foreground">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <BrandLogo size="md" />
            <p className="mt-8 max-w-[36ch] text-sm leading-6 text-foreground/70">
              Exclusive agent in Jordan for European kitchen systems, furniture fittings and door hardware. In Amman since {company.established}.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={company.instagram.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Amara Trading Center on Instagram, ${company.instagram.handle}`}
                data-testid="link-footer-instagram"
                className={cn("group inline-flex items-center gap-3 text-sm text-foreground transition-colors hover:text-primary", focusRing)}
              >
                <span className="flex h-10 w-10 items-center justify-center border border-white/20 transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <Instagram className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                {company.instagram.handle}
              </a>
              <a href={`mailto:${company.email}`} className={cn("text-sm text-foreground/80 transition-colors hover:text-primary", focusRing)}>
                {company.email}
              </a>
            </div>
            <Link
              href="/contact"
              className={cn("group mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary", focusRing)}
            >
              Send an enquiry
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
            </Link>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:gap-10 lg:col-span-6 lg:col-start-7 lg:content-start">
            {DIRECTORY.map((group) => (
              <div key={group.label}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">{group.label}</p>
                <ul className="mt-4 grid gap-2.5">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn("text-sm text-foreground/80 transition-colors hover:text-primary", focusRing)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 pb-[calc(1.5rem+var(--sticky-quote-bar,0px))] text-xs leading-5 text-foreground/45 sm:flex-row sm:items-baseline sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {company.name}</p>
          <p>Al-Bayader and Al-Wehdat, Amman. Sat–Thu.</p>
        </div>
      </div>
    </footer>
  );
}
