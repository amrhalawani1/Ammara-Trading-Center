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

export function Navbar({ overlay = false }: { overlay?: boolean }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "z-50 w-full",
        overlay
          ? "absolute inset-x-0 top-0 border-transparent bg-transparent"
          : "sticky top-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col items-start leading-none tracking-wider">
            {/* Minimal SVG representation inspired by the guidelines /// A MARA style */}
            <div className="flex items-center gap-1.5">
              <div className="flex gap-[2px] h-4">
                <div className={cn("w-[3px] -skew-x-12", overlay ? "bg-background/70" : "bg-foreground/70")} />
                <div className={cn("w-[3px] -skew-x-12", overlay ? "bg-background/70" : "bg-foreground/70")} />
                <div className="w-[3px] bg-primary -skew-x-12" />
              </div>
              <span className={cn("font-serif text-lg font-medium tracking-[0.2em] uppercase", overlay ? "text-background" : "text-foreground")}>
                <span className={overlay ? "text-background/70" : "text-foreground/70"}>A</span><span className="text-primary">MARA</span>
              </span>
            </div>
            <span className={cn("mt-0.5 text-[9px] uppercase tracking-widest", overlay ? "text-background/60" : "text-muted-foreground")}>Trading Center</span>
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
                "text-sm font-medium transition-colors",
                overlay
                  ? "text-background/80 hover:text-background"
                  : location.startsWith(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="default" className={cn("h-9 px-5", overlay && "bg-primary hover:bg-primary/90")}>
            <Link href="/contact">Trade Inquiry</Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={cn("p-2 md:hidden", overlay ? "text-background" : "text-foreground")}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
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
