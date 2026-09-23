/**
 * Editorial content for the homepage. Anything derived from the catalogue (brand counts,
 * product counts, solution counts) is computed in the page from live data; only the prose and
 * the imagery pairings live here.
 */

export interface Pillar {
  index: string;
  title: string;
  body: string;
  image: string;
  alt: string;
}

/** "What is Amara Trading Center": the three things the company actually does. */
export const PILLARS: Pillar[] = [
  {
    index: "01",
    title: "We represent",
    body: "European manufacturers of door, window and furniture hardware, each chosen because their fittings are still working after twenty years in a kitchen.",
    image: "/images/showroom-detail.webp",
    alt: "Hardware displayed in the ATC showroom",
  },
  {
    index: "02",
    title: "We stock",
    body: "Deep inventory held in Amman, so a fabricator's programme does not wait on a container. Item numbers are confirmed against the manufacturer's current documentation.",
    image: "/images/trade-planning.webp",
    alt: "Planning a project at the ATC trade desk",
  },
  {
    index: "03",
    title: "We advise",
    body: "Consultants who have installed what they sell. Bring a drawing, a photo or a competitor's item code and leave with the right specification.",
    image: "/images/trade-workshop.webp",
    alt: "Reviewing a technical drawing in the workshop",
  },
];

/** Imagery for the solutions explorer, keyed by solution slug. */
export const SOLUTION_IMAGES: Record<string, { image: string; alt: string }> = {
  "door-window-handles": { image: "/images/dnd-palm.webp", alt: "Dnd Palm door lever" },
  "cabinet-handles": { image: "/images/product-handle.webp", alt: "Cabinet handle detail" },
  hinges: { image: "/images/brand-hinge.webp", alt: "Concealed hinge" },
  "drawer-systems": { image: "/images/showroom-detail.webp", alt: "Drawer system on display" },
  "lift-systems": { image: "/images/brand-hinge.webp", alt: "Lift fitting" },
  "opening-closing": { image: "/images/dnd-pencil.webp", alt: "Dnd Pencil lever" },
  "sliding-folding": { image: "/images/brand-sliding.webp", alt: "Sliding door running gear" },
  "kitchen-storage": { image: "/images/hero-kitchen.webp", alt: "Kitchen storage in a fitted kitchen" },
  lighting: { image: "/images/showroom-wide.webp", alt: "Lit showroom display" },
  "sinks-taps": { image: "/images/hero-kitchen.webp", alt: "Kitchen sink and tap" },
  "cooking-appliances": { image: "/images/hero-kitchen.webp", alt: "Built-in hob" },
};

/** What a practice gets from ATC. Shown in the "For architects" panel. */
export const ARCHITECT_SERVICES = [
  { title: "Specification sheets", body: "Item numbers, dimensions and drawings in the format your schedule needs." },
  { title: "CAD and BIM files", body: "Manufacturer files requested on your behalf, sent with the current revision." },
  { title: "Finish samples", body: "Physical samples for client presentations, matched across handle, lock and hinge." },
  { title: "Site consultancy", body: "A consultant at the mock-up, before the joinery is cut." },
];

export interface ProjectReference {
  sector: string;
  title: string;
  location: string;
  scope: string;
  systems: string[];
  image: string;
  /** True until a real project has been cleared for publication. */
  placeholder: boolean;
}

/**
 * PLACEHOLDER content. Case studies are still being compiled and
 * cleared, so nothing here describes a real installation. Replace every entry with a cleared
 * project before launch, and remove the `placeholder` flag; the section shows a notice until then.
 */
export const PROJECTS: ProjectReference[] = [
  {
    sector: "Hospitality",
    title: "Boutique hotel refurbishment",
    location: "Amman",
    scope: "Guest room and back-of-house doors",
    systems: ["Door levers", "Concealed hinges", "Locking systems"],
    image: "/images/showroom-wide.webp",
    placeholder: true,
  },
  {
    sector: "Residential",
    title: "Private villa kitchen",
    location: "Dabouq",
    scope: "Fitted kitchen and pantry",
    systems: ["Drawer systems", "Lift systems", "Kitchen storage"],
    image: "/images/hero-kitchen.webp",
    placeholder: true,
  },
  {
    sector: "Commercial",
    title: "Headquarters fit-out",
    location: "Abdali",
    scope: "Meeting rooms and executive floor",
    systems: ["Sliding door systems", "Entrance pull handles"],
    image: "/images/trade-planning.webp",
    placeholder: true,
  },
  {
    sector: "Joinery",
    title: "Wardrobe programme",
    location: "Sahab",
    scope: "Fabricator supply, 340 units",
    systems: ["Sliding & folding doors", "Wire storage"],
    image: "/images/brand-sliding.webp",
    placeholder: true,
  },
];

export interface JournalEntry {
  category: string;
  title: string;
  summary: string;
  readTime: string;
  href: string;
}

/** Mirrors the guides published on /resources. */
export const JOURNAL: JournalEntry[] = [
  {
    category: "Planning",
    title: "Kitchen drawer systems planning",
    summary: "Load classes, runner lengths and why the deepest drawer is rarely the most useful one.",
    readTime: "6 min",
    href: "/resources",
  },
  {
    category: "Installation",
    title: "Concealed hinge adjustment",
    summary: "Three screws, three axes. Getting a run of doors to sit flush without touching the carcass.",
    readTime: "4 min",
    href: "/resources",
  },
  {
    category: "Care",
    title: "Matte finish maintenance",
    summary: "What a black or bronze PVD finish tolerates, what it does not, and what to hand the cleaning staff.",
    readTime: "3 min",
    href: "/resources",
  },
  {
    category: "Systems",
    title: "Sliding door systems",
    summary: "Top-hung or bottom-rolling, soft close, and the clearances that decide it before the joiner arrives.",
    readTime: "7 min",
    href: "/resources",
  },
];
