import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUpRight, FolderHeart, Menu, MessageCircle, Search, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { AccountControl, MobileAccountLink } from "@/components/account/account-control";
import { BrandLogo } from "@/components/brand-logo";
import { openSearch } from "@/hooks/use-search-overlay";
import { useShortlistCount } from "@/hooks/use-shortlists";
import { company } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/catalog", label: "Catalogue" },
  { href: "/brands", label: "Brands" },
  { href: "/showroom", label: "Showrooms" },
  { href: "/projects", label: "Projects" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** The phone menu lists the shortlists too; on desktop they sit behind the folder icon. */
const MOBILE_LINKS = [...NAV_LINKS, { href: "/lists", label: "Quote" }];

const SPRING = { type: "spring", stiffness: 320, damping: 32 } as const;

/** `/catalog` is the product catalogue; `/catalogues` is a different page and must not light that link. */
function isNavActive(location: string, href: string) {
  const path = location.split("?")[0] ?? location;
  return path === href || path.startsWith(`${href}/`);
}

/**
 * Site header. Over an immersive hero it is transparent on the dark ground; once the page
 * scrolls it becomes a white frosted bar, on every page, and stays in view.
 * Links share a sliding indicator and the phone menu takes the screen.
 */
export function Navbar({ overlay = false }: { overlay?: boolean }) {
  const [location] = useLocation();
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const shortlistCount = useShortlistCount();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Pages with their own sticky rail (the catalogue) sit it directly under the bar, so the bar's
  // height is published as a CSS variable instead of hard-coded there. Over an immersive hero the
  // bar floats, so nothing needs to clear it.
  useEffect(() => {
    document.documentElement.style.setProperty("--nav-offset", overlay ? "0px" : "76px");
    return () => {
      document.documentElement.style.removeProperty("--nav-offset");
    };
  }, [overlay]);

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
  const indicatorTarget = hovered ?? NAV_LINKS.find((link) => isNavActive(location, link.href))?.href ?? null;

  return (
    // The header itself never transforms: a transformed ancestor would turn the fixed phone menu
    // into a box the size of the bar.
    <header className={cn("z-50 w-full", overlay ? "fixed inset-x-0 top-0" : "sticky top-0")} data-testid="site-header" data-state={transparent ? "transparent" : "solid"}>
      <div
        className={cn(
          "relative z-[60] text-foreground transition-[background-color,border-color] duration-300",
          (transparent || menuOpen) && "dark",
          menuOpen && "border-b border-white/10 bg-background",
          !transparent && !menuOpen && "border-b border-foreground/10 bg-background/85 backdrop-blur-xl",
        )}
        data-testid="site-header-bar"
      >
      <div className="mx-auto grid h-[76px] max-w-[1560px] grid-cols-[1fr_auto] items-center px-6 md:px-12 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="flex shrink-0 items-center justify-self-start" aria-label="Amara Trading Center home">
          <BrandLogo size="nav" priority />
        </Link>

        {/* Centred links, uppercase and tracked, with the sliding red indicator. */}
        <nav className="hidden justify-self-center lg:block" aria-label="Primary" onMouseLeave={() => setHovered(null)}>
          <LayoutGroup id="primary-nav">
            <ul className="flex items-center gap-2 xl:gap-4">
              {NAV_LINKS.map((link) => {
                const active = isNavActive(location, link.href);
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      onMouseEnter={() => setHovered(link.href)}
                      onFocus={() => setHovered(link.href)}
                      aria-current={active ? "page" : undefined}
                      data-testid={`link-nav-${link.label.toLowerCase()}`}
                      className={cn("relative block px-3.5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors", active ? "text-foreground" : "text-foreground/75 hover:text-foreground")}
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
        </nav>

        <div className="flex items-center justify-self-end gap-1">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openSearch();
            }}
            aria-label="Search products, brands or a problem"
            className="group relative flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:text-primary"
            data-testid="button-nav-search"
          >
            <Search className="h-5 w-5" strokeWidth={1.4} />
            <span
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap bg-foreground px-2.5 py-1.5 text-[11px] font-medium tracking-normal text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              Search <span aria-hidden="true" className="ml-1.5 hidden font-mono text-[10px] text-background/60 sm:inline">⌘K</span>
            </span>
          </button>

          {/* Project shortlists: the folder, with how many references it holds. */}
          <Link
            href="/lists"
            aria-label={shortlistCount > 0 ? `Quote list, ${shortlistCount} ${shortlistCount === 1 ? "product" : "products"}` : "Quote list"}
            aria-current={location.startsWith("/lists") ? "page" : undefined}
            className={cn("group relative hidden h-11 w-11 items-center justify-center transition-colors sm:flex", location.startsWith("/lists") ? "text-primary" : "text-foreground hover:text-primary")}
            data-testid="link-nav-lists"
          >
            <FolderHeart
              className={cn("h-5 w-5", location.startsWith("/lists") && "[&_path:last-child]:fill-current")}
              strokeWidth={1.4}
            />
            {shortlistCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-primary px-1 font-mono text-[10px] leading-none tabular-nums text-primary-foreground" data-testid="text-nav-shortlist-count">
                {shortlistCount}
              </span>
            )}
            <span
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap bg-foreground px-2.5 py-1.5 text-[11px] font-medium tracking-normal text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {shortlistCount > 0 ? `Quote list, ${shortlistCount} ${shortlistCount === 1 ? "product" : "products"}` : "Quote list"}
            </span>
          </Link>

          <AccountControl />

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
      </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            ref={menuRef}
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="dark fixed inset-0 top-0 z-40 flex flex-col overflow-y-auto bg-background px-6 pb-8 pt-24 text-foreground lg:hidden"
            data-testid="mobile-menu"
          >
            <motion.nav
              aria-label="Mobile"
              className="flex flex-1 flex-col justify-center"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openSearch();
                }}
                className="mb-4 flex h-12 w-full items-center gap-3 border border-foreground/15 px-4 text-left text-sm text-foreground/80"
                data-testid="button-mobile-search"
              >
                <Search className="h-4 w-4" strokeWidth={1.75} />
                Search products, brands or a problem
              </button>
              <ul>
                {MOBILE_LINKS.filter((link) => link.href !== "/contact").map((link) => (
                  <motion.li key={link.href} variants={reduce ? undefined : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: SPRING } }}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}
                      className={cn("flex items-center justify-between border-b border-foreground/10 py-4 font-display text-4xl font-medium tracking-[-0.04em] transition-colors", isNavActive(location, link.href) ? "text-primary" : "text-foreground")}
                    >
                      <span>
                        {link.label}
                        {link.href === "/lists" && shortlistCount > 0 && <span className="ml-2 font-mono text-lg text-primary">{shortlistCount}</span>}
                      </span>
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
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Ask on WhatsApp
              </a>
            </div>
            <MobileAccountLink onNavigate={() => setMenuOpen(false)} />
            <p className="mt-4 text-xs text-foreground/50">{company.showrooms.map((s) => s.name).join(" and ")}, Amman</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
