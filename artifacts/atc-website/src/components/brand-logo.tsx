import { assetUrl } from "@/lib/env";
import { cn } from "@/lib/utils";

/**
 * The ATC logo: the `///` stripes, grey "A", red "MARA" and the "AMARA TRADING CENTER" line,
 * rendered from the supplied artwork as one locked unit.
 *
 * Brand rules (enforced here, do not work around them at call sites):
 * - Never restretch, recolor, rotate, crop, or separate elements. Size is set by height only;
 *   width follows the artwork's native 632:125 ratio.
 * - Minimum 120px wide. Every size below clears it.
 * - Clear space = the height of the `///` stripes (61.6% of the logo height) on all sides.
 *   Callers leave at least that much room; `LOGO_CLEAR_SPACE` exposes the ratio.
 * - The same artwork works on cream and on the dark ground, so there is no on-dark variant.
 */
export const LOGO_ASPECT = 632 / 125;
export const LOGO_CLEAR_SPACE = 77 / 125;

const SIZES = {
  /** Navbar: 131px wide on mobile, 167px from md. */
  nav: "h-[26px] md:h-[33px]",
  /** Footer and standalone screens: 182px wide, 202px from md. */
  md: "h-9 md:h-10",
  /** Hero-scale placements. */
  lg: "h-12 md:h-16",
} as const;

export function BrandLogo({
  className,
  size = "nav",
  priority = false,
}: {
  className?: string;
  size?: keyof typeof SIZES;
  priority?: boolean;
}) {
  return (
    <img
      src={assetUrl("/brand/amara-logo-632.webp")}
      srcSet={`${assetUrl("/brand/amara-logo-320.webp")} 320w, ${assetUrl("/brand/amara-logo-632.webp")} 632w`}
      sizes={size === "nav" ? "(min-width: 768px) 167px, 131px" : size === "md" ? "202px" : "324px"}
      width={632}
      height={125}
      alt="Amara Trading Center"
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      draggable={false}
      className={cn("block w-auto max-w-none select-none", SIZES[size], className)}
    />
  );
}
