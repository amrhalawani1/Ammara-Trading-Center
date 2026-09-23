import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { BrandLogo } from "@/components/brand-logo";
import { company } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/catalog", label: "Catalog" },
  { href: "/brands", label: "Brands" },
  { href: "/showroom", label: "Showroom" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

const SPRING = { type: "spring", stiffness: 320, damping: 32 } as const;

/**
 * Site header. Over an immersive hero it is transparent on the dark ground; once the page
 * scrolls it becomes a frosted bar (dark on hero pages, light elsewhere), hides on scroll-down
 * and returns on scroll-up. Links share a sliding indicator and the phone menu takes the screen.
 */
export function Navbar({ overlay = false }: { overlay?: boolean }) {
  const [location] = useLocation();
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 160 && y > previous && !menuOpen);
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Pages with their own sticky rail (the catalogue) sit it directly under the bar and follow it
  // out of view, so the offset is published as a CSS variable instead of hard-coded there.
  useEffect(() => {
    document.documentElement.style.setProperty("--nav-offset", hidden || overlay ? "0px" : "76px");
    return () => {
      document.documentElement.style.removeProperty("--nav-offset");
    };
  }, [hidden, overlay]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const menu = menuRef.current;
    const focusable = menu?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !focusable || focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const transparent = overlay && !scrolled && !menuOpen;
  const indicatorTarget = hovered ?? NAV_LINKS.find((link) => location.startsWith(link.href))?.href ?? null;

  return (
    // The header itself never transforms: a transformed ancestor would turn the fixed phone menu
    // into a box the size of the bar. The hide-on-scroll motion lives on the inner bar.
    <header className={cn("z-50 w-full", overlay ? "fixed inset-x-0 top-0" : "sticky top-0")} data-testid="site-header" data-state={transparent ? "transparent" : "solid"}>
      <motion.div
        animate={hidden ? "hidden" : "shown"}
        variants={reduce ? undefined : { shown: { y: 0 }, hidden: { y: "-100%" } }}
        transition={SPRING}
        className={cn(
          "text-foreground transition-[background-color,border-color] duration-300",
          transparent && "dark",
          !transparent && overlay && "dark border-b border-foreground/10 bg-background/85 backdrop-blur-xl",
          !transparent && !overlay && "border-b border-foreground/10 bg-background/85 backdrop-blur-xl",
        )}
        data-testid="site-header-bar"
      >
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-10 px-6 md:px-12">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Amara Trading Center home">
          <BrandLogo size="nav" priority />
        </Link>

        <nav className="hidden flex-1 items-center justify-end gap-10 lg:flex" aria-label="Primary" onMouseLeave={() => setHovered(null)}>
          <LayoutGroup id="primary-nav">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = location.startsWith(link.href);
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      onMouseEnter={() => setHovered(link.href)}
                      onFocus={() => setHovered(link.href)}
                      aria-current={active ? "page" : undefined}
                      data-testid={`link-nav-${link.label.toLowerCase()}`}
                      className={cn("relative block px-3.5 py-2.5 text-[15px] font-medium tracking-[-0.01em] transition-colors", active ? "text-foreground" : "text-foreground/70 hover:text-foreground")}
                    >
                      {link.label}
                    </Link>
                    {indicatorTarget === link.href && (
                      <motion.span layoutId="nav-indicator" className="absolute inset-x-3.5 bottom-0 h-0.5 bg-primary" transition={SPRING} aria-hidden />
                    )}
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>

          <Link
            href="/contact"
            className="group inline-flex h-11 items-center gap-2 bg-primary px-5 text-[15px] font-semibold tracking-[-0.01em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background active:scale-[0.98]"
            data-testid="link-nav-contact"
          >
            Contact us
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="relative z-[60] flex h-10 w-10 items-center justify-center text-foreground lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X className="h-6 w-6" strokeWidth={1.75} /> : <Menu className="h-6 w-6" strokeWidth={1.75} />}
        </button>
      </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            ref={menuRef}
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="dark fixed inset-0 top-0 flex flex-col bg-background px-6 pb-8 pt-24 text-foreground lg:hidden"
            data-testid="mobile-menu"
          >
            <motion.nav
              aria-label="Mobile"
              className="flex flex-1 flex-col justify-center"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            >
              <ul>
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.href} variants={reduce ? undefined : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: SPRING } }}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
                      className={cn("flex items-center justify-between border-b border-foreground/10 py-4 font-display text-4xl font-medium tracking-[-0.04em] transition-colors", location.startsWith(link.href) ? "text-primary" : "text-foreground")}
                    >
                      {link.label}
                      <ArrowUpRight className="h-5 w-5 text-foreground/40" strokeWidth={1.75} />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="flex h-12 items-center justify-center bg-primary text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
                Contact us
              </Link>
              <a href={whatsappUrl("Hello ATC, I have a question about a product.")} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 border border-foreground/25 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> WhatsApp
              </a>
            </div>
            <p className="mt-4 text-xs text-foreground/50">{company.showrooms.map((s) => s.name).join(" and ")}, Amman</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
