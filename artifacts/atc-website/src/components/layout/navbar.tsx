import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/catalog", label: "Catalog" },
  { href: "/brands", label: "Brands" },
  { href: "/trade", label: "Trade" },
  { href: "/showroom", label: "Showroom" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col items-start leading-none tracking-wider">
            {/* Minimal SVG representation inspired by the guidelines /// A MARA style */}
            <div className="flex items-center gap-1.5">
              <div className="flex gap-[2px] h-4">
                <div className="w-[3px] bg-foreground/70 -skew-x-12" />
                <div className="w-[3px] bg-foreground/70 -skew-x-12" />
                <div className="w-[3px] bg-foreground/70 -skew-x-12" />
              </div>
              <span className="font-serif text-lg font-medium text-foreground tracking-[0.2em] uppercase">
                <span className="text-foreground/70">A</span><span className="text-primary">MARA</span>
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Trading Center</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`link-nav-${link.label.toLowerCase()}`}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="default" className="h-9 px-5">
            <Link href="/contact">Trade Inquiry</Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
                className={cn(
                  "block py-2 text-base font-medium transition-colors",
                  location.startsWith(link.href) ? "text-primary" : "text-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <Button asChild className="w-full">
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Trade Inquiry</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
