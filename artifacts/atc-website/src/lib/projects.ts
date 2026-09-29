/**
 * Project references: where ATC hardware was installed.
 *
 * Publishing a client's name needs their consent, and `client` is only rendered when
 * `clientCleared` is true. Two entries are real references. Every other entry is a stand-in that
 * shows the layout until ATC supplies real projects (decision, Sep 2026): stand-ins are published
 * so every sector has content, but anything that renders a project must label `isExample` ones
 * visibly. Replace a stand-in by giving it a real story and gallery.
 */
export interface Project {
  slug: string;
  sector: "Hospitality" | "Residential" | "Commercial" | "Joinery" | "Healthcare" | "Retail" | "Education" | "State";
  title: string;
  location: string;
  /** Year completed, or a range for programmes. */
  year?: string;
  /** Client or operator. Rendered only when `clientCleared`. */
  client?: string;
  clientCleared?: boolean;
  /** One line under the title. */
  scope: string;
  /** Solution slugs supplied (see lib/solutions). */
  systems: string[];
  /** Brand slugs whose hardware went in. */
  brands: string[];
  /** Headline number for the card, e.g. "340 units" or "212 rooms". */
  figure?: { value: string; label: string };
  /** The story, one paragraph per entry. */
  story: string[];
  cover: string;
  gallery: { src: string; alt: string; caption: string }[];
  /** True once ATC has confirmed the project may be published. */
  cleared: boolean;
}

export const SECTORS: Project["sector"][] = ["Hospitality", "Residential", "Commercial", "Joinery", "Healthcare", "Retail", "Education", "State"];

const placeholderStory = [
  "This is an example of how a project reference appears on the site. It is replaced with the real installation once the client agrees to be named.",
];

function placeholderGallery(cover: string, second: string): Project["gallery"] {
  return [
    { src: cover, alt: "Example photograph", caption: "Example image" },
    { src: second, alt: "Example photograph", caption: "Example image" },
  ];
}

/** Every entry, real references first. */
export const PROJECT_ENTRIES: Project[] = [
  {
    slug: "hotels-jordan",
    sector: "Hospitality",
    title: "Hotels across Jordan",
    location: "Amman, Aqaba, the Dead Sea and Petra",
    year: "Ongoing",
    scope: "Guest room, corridor and back-of-house hardware for hotels in four destinations",
    systems: ["door-window-handles", "hinges", "opening-closing", "sliding-folding"],
    brands: ["dnd", "hafele", "hettich", "blum"],
    figure: { value: "4", label: "destinations" },
    story: [
      "Hotel hardware is specified once and then used ten thousand times a year. Hotels in Amman, Aqaba, the Dead Sea and Petra are fitted with door levers, locks, hinges and wardrobe systems supplied through ATC.",
      "The work is rarely a single order. A property opens with one specification, refurbishes floor by floor, and needs the same lever, in the same finish, fifteen years after the first delivery. Being the manufacturers' exclusive agent in Jordan is what makes that possible: the item number is still current and still in stock in Amman.",
      "Back of house gets the same attention as the lobby. Service corridors, housekeeping stores and staff areas run on hardware rated for the traffic, so the doors guests never see are the ones that fail least.",
    ],
    cover: "/images/dnd-palm.webp",
    gallery: [
      { src: "/images/dnd-palm.webp", alt: "A lever handle on a hotel guest room door", caption: "Guest room levers, one family across every floor" },
      { src: "/images/brand-hinge.webp", alt: "Concealed hinge on a wardrobe door", caption: "Wardrobe hinges rated for hotel use" },
      { src: "/images/brand-sliding.webp", alt: "Sliding wardrobe door gear", caption: "Sliding wardrobes where rooms are tight" },
      { src: "/images/showroom-detail.webp", alt: "Finishes matched across handles and hinges", caption: "Finishes matched across handle, hinge and lock" },
    ],
    cleared: true,
  },
  {
    slug: "royal-court",
    sector: "State",
    title: "A royal court in Amman",
    location: "Amman",
    client: "The Royal Hashemite Court",
    clientCleared: false,
    scope: "Architectural hardware across the court's buildings",
    systems: ["door-window-handles", "opening-closing", "hinges"],
    brands: ["dnd", "hafele"],
    story: [
      "Hardware supplied to the court's buildings, specified and held to the same sheet as any other order: item numbers confirmed against the manufacturer's current publication, finishes matched across every door in a suite, drawings on file for the next refurbishment.",
      "Details of the installation are not published. The reference is listed because it is the standard ATC is measured against, not as a case study.",
    ],
    cover: "/images/dnd-pencil.webp",
    gallery: [
      { src: "/images/dnd-pencil.webp", alt: "A slim lever handle in a brushed finish", caption: "Levers in a brushed finish" },
      { src: "/images/trade-planning.webp", alt: "A door schedule on the drawings table", caption: "The schedule, checked line by line" },
    ],
    cleared: true,
  },
  {
    slug: "boutique-hotel-refurbishment",
    sector: "Hospitality",
    title: "Boutique hotel refurbishment",
    location: "Amman",
    year: "2024",
    scope: "Guest room and back-of-house doors",
    systems: ["door-window-handles", "hinges", "opening-closing"],
    brands: ["dnd", "hafele"],
    figure: { value: "64", label: "rooms" },
    story: placeholderStory,
    cover: "/images/showroom-wide.webp",
    gallery: placeholderGallery("/images/showroom-wide.webp", "/images/dnd-palm.webp"),
    cleared: true,
  },
  {
    slug: "private-villa-kitchen",
    sector: "Residential",
    title: "Private villa kitchen",
    location: "Dabouq",
    year: "2025",
    scope: "Fitted kitchen and pantry",
    systems: ["drawer-systems", "lift-systems", "kitchen-storage"],
    brands: ["blum", "kessebohmer"],
    story: placeholderStory,
    cover: "/images/hero-kitchen.webp",
    gallery: placeholderGallery("/images/hero-kitchen.webp", "/images/brand-hinge.webp"),
    cleared: true,
  },
  {
    slug: "headquarters-fit-out",
    sector: "Commercial",
    title: "Headquarters fit-out",
    location: "Abdali",
    year: "2023",
    scope: "Meeting rooms and executive floor",
    systems: ["sliding-folding", "door-window-handles"],
    brands: ["hawa", "dnd"],
    figure: { value: "12", label: "floors" },
    story: placeholderStory,
    cover: "/images/trade-planning.webp",
    gallery: placeholderGallery("/images/trade-planning.webp", "/images/dnd-pencil.webp"),
    cleared: true,
  },
  {
    slug: "wardrobe-programme",
    sector: "Joinery",
    title: "Wardrobe programme",
    location: "Sahab",
    year: "2024–25",
    scope: "Fabricator supply for a residential development",
    systems: ["sliding-folding", "kitchen-storage"],
    brands: ["hettich", "vibo"],
    figure: { value: "340", label: "units" },
    story: placeholderStory,
    cover: "/images/brand-sliding.webp",
    gallery: placeholderGallery("/images/brand-sliding.webp", "/images/showroom-detail.webp"),
    cleared: true,
  },
  {
    slug: "dead-sea-resort",
    sector: "Hospitality",
    title: "Dead Sea resort suites",
    location: "Dead Sea",
    year: "2022",
    scope: "Poolside suites, spa changing rooms and corridor doors",
    systems: ["door-window-handles", "hinges", "opening-closing"],
    brands: ["dnd", "hafele"],
    figure: { value: "48", label: "suites" },
    story: placeholderStory,
    cover: "/images/showroom-detail.webp",
    gallery: placeholderGallery("/images/showroom-detail.webp", "/images/dnd-ellipse.webp"),
    cleared: true,
  },
  {
    slug: "aqaba-serviced-apartments",
    sector: "Hospitality",
    title: "Serviced apartments",
    location: "Aqaba",
    year: "2023",
    scope: "Apartment entrance doors and fitted wardrobes",
    systems: ["door-window-handles", "sliding-folding", "hinges"],
    brands: ["dnd", "hettich"],
    figure: { value: "86", label: "keys" },
    story: placeholderStory,
    cover: "/images/dnd-ellipse.webp",
    gallery: placeholderGallery("/images/dnd-ellipse.webp", "/images/brand-sliding.webp"),
    cleared: true,
  },
  {
    slug: "petra-guest-house",
    sector: "Hospitality",
    title: "Guest house refit",
    location: "Petra",
    year: "2021",
    scope: "Guest room levers, locks and bathroom doors",
    systems: ["door-window-handles", "opening-closing"],
    brands: ["dnd", "hafele"],
    figure: { value: "22", label: "rooms" },
    story: placeholderStory,
    cover: "/images/dnd-blend-ag.webp",
    gallery: placeholderGallery("/images/dnd-blend-ag.webp", "/images/product-handle.webp"),
    cleared: true,
  },
  {
    slug: "abdoun-apartment",
    sector: "Residential",
    title: "Abdoun apartment",
    location: "Abdoun",
    year: "2024",
    scope: "Kitchen drawers, wall cabinets and a dressing room",
    systems: ["drawer-systems", "lift-systems", "sliding-folding"],
    brands: ["blum", "hafele"],
    story: placeholderStory,
    cover: "/images/product-handle.webp",
    gallery: placeholderGallery("/images/product-handle.webp", "/images/hero-kitchen.webp"),
    cleared: true,
  },
  {
    slug: "sweifieh-townhouse",
    sector: "Residential",
    title: "Townhouse doors",
    location: "Sweifieh",
    year: "2022",
    scope: "Interior doors and sliding wardrobes across three floors",
    systems: ["door-window-handles", "sliding-folding", "hinges"],
    brands: ["dnd", "hawa"],
    figure: { value: "3", label: "floors" },
    story: placeholderStory,
    cover: "/images/dnd-pencil.webp",
    gallery: placeholderGallery("/images/dnd-pencil.webp", "/images/brand-hinge.webp"),
    cleared: false,
  },
  {
    slug: "ajloun-weekend-house",
    sector: "Residential",
    title: "Weekend house kitchen",
    location: "Ajloun",
    year: "2025",
    scope: "Kitchen, pantry and wet-area cabinets",
    systems: ["drawer-systems", "kitchen-storage", "sinks-taps"],
    brands: ["blum", "kessebohmer"],
    story: placeholderStory,
    cover: "/images/trade-workshop.webp",
    gallery: placeholderGallery("/images/trade-workshop.webp", "/images/hero-kitchen.webp"),
    cleared: false,
  },
  {
    slug: "khalda-family-house",
    sector: "Residential",
    title: "Family house fit-out",
    location: "Khalda",
    year: "2020",
    scope: "Handles, hinges and soft-close drawers through the house",
    systems: ["door-window-handles", "hinges", "drawer-systems"],
    brands: ["dnd", "blum"],
    story: placeholderStory,
    cover: "/images/dnd-ellipse-brilliant.webp",
    gallery: placeholderGallery("/images/dnd-ellipse-brilliant.webp", "/images/showroom-detail.webp"),
    cleared: false,
  },
  {
    slug: "irbid-clinic",
    sector: "Commercial",
    title: "Clinic reception",
    location: "Irbid",
    year: "2024",
    scope: "Reception, consultation rooms and staff doors",
    systems: ["door-window-handles", "hinges", "opening-closing"],
    brands: ["dnd", "hafele"],
    figure: { value: "14", label: "rooms" },
    story: placeholderStory,
    cover: "/images/resources-docs.webp",
    gallery: placeholderGallery("/images/resources-docs.webp", "/images/trade-planning.webp"),
    cleared: false,
  },
  {
    slug: "zarqa-office-tower",
    sector: "Commercial",
    title: "Office tower cores",
    location: "Zarqa",
    year: "2021",
    scope: "Core doors, meeting rooms and tea-point cabinets",
    systems: ["door-window-handles", "sliding-folding", "cabinet-handles"],
    brands: ["hafele", "hawa"],
    figure: { value: "8", label: "floors" },
    story: placeholderStory,
    cover: "/images/brand-hinge.webp",
    gallery: placeholderGallery("/images/brand-hinge.webp", "/images/dnd-palm.webp"),
    cleared: false,
  },
  {
    slug: "madaba-bank-branch",
    sector: "Commercial",
    title: "Bank branch",
    location: "Madaba",
    year: "2019",
    scope: "Public counters, office doors and a staff kitchen",
    systems: ["door-window-handles", "opening-closing", "kitchen-storage"],
    brands: ["dnd", "blum"],
    story: placeholderStory,
    cover: "/images/trade-workshop.webp",
    gallery: placeholderGallery("/images/trade-workshop.webp", "/images/resources-docs.webp"),
    cleared: false,
  },
  {
    slug: "marka-kitchen-run",
    sector: "Joinery",
    title: "Kitchen fabricator run",
    location: "Marka",
    year: "2025",
    scope: "Drawer boxes and hinges for a repeat kitchen",
    systems: ["drawer-systems", "hinges", "lift-systems"],
    brands: ["blum", "hettich"],
    figure: { value: "120", label: "kitchens" },
    story: placeholderStory,
    cover: "/images/showroom-detail.webp",
    gallery: placeholderGallery("/images/showroom-detail.webp", "/images/brand-hinge.webp"),
    cleared: false,
  },
  {
    slug: "bayader-show-apartment",
    sector: "Joinery",
    title: "Show apartment wardrobes",
    location: "Al-Bayader",
    year: "2023",
    scope: "Sliding wardrobes and dressing-room interiors",
    systems: ["sliding-folding", "lighting", "kitchen-storage"],
    brands: ["hettich", "vibo"],
    figure: { value: "18", label: "wardrobes" },
    story: placeholderStory,
    cover: "/images/product-handle.webp",
    gallery: placeholderGallery("/images/product-handle.webp", "/images/brand-sliding.webp"),
    cleared: false,
  },
  {
    slug: "salt-school-joinery",
    sector: "Joinery",
    title: "School furniture package",
    location: "Salt",
    year: "2022",
    scope: "Classroom storage, staff wardrobes and door hardware",
    systems: ["hinges", "cabinet-handles", "sliding-folding"],
    brands: ["hafele", "hettich"],
    figure: { value: "40", label: "rooms" },
    story: placeholderStory,
    cover: "/images/resources-docs.webp",
    gallery: placeholderGallery("/images/resources-docs.webp", "/images/brand-hinge.webp"),
    cleared: false,
  },
  {
    slug: "ministry-annex",
    sector: "State",
    title: "Ministry annex",
    location: "Amman",
    year: "2020",
    scope: "Office doors, public counters and meeting rooms",
    systems: ["door-window-handles", "opening-closing", "hinges"],
    brands: ["dnd", "hafele"],
    story: placeholderStory,
    cover: "/images/dnd-ellipse.webp",
    gallery: placeholderGallery("/images/dnd-ellipse.webp", "/images/trade-planning.webp"),
    cleared: false,
  },
  {
    slug: "municipal-offices",
    sector: "State",
    title: "Municipal offices",
    location: "Zarqa",
    year: "2018",
    scope: "Public hall doors and back-office cabinets",
    systems: ["door-window-handles", "cabinet-handles", "hinges"],
    brands: ["dnd", "hafele"],
    story: placeholderStory,
    cover: "/images/trade-planning.webp",
    gallery: placeholderGallery("/images/trade-planning.webp", "/images/dnd-blend-ag.webp"),
    cleared: false,
  },
  {
    slug: "private-hospital-wards",
    sector: "Healthcare",
    title: "Private hospital wards",
    location: "Amman",
    year: "2023",
    scope: "Patient room doors, nurse stations and staff changing rooms",
    systems: ["door-window-handles", "hinges", "opening-closing"],
    brands: ["dnd", "hafele"],
    figure: { value: "120", label: "rooms" },
    story: placeholderStory,
    cover: "/images/showroom-wide.webp",
    gallery: placeholderGallery("/images/showroom-wide.webp", "/images/dnd-ellipse-brilliant.webp"),
    cleared: false,
  },
  {
    slug: "day-surgery-clinic",
    sector: "Healthcare",
    title: "Day surgery clinic",
    location: "Sweifieh",
    year: "2024",
    scope: "Treatment rooms, recovery bays and a staff kitchen",
    systems: ["door-window-handles", "cabinet-handles", "hinges"],
    brands: ["dnd", "blum"],
    figure: { value: "9", label: "rooms" },
    story: placeholderStory,
    cover: "/images/dnd-ellipse-brilliant.webp",
    gallery: placeholderGallery("/images/dnd-ellipse-brilliant.webp", "/images/showroom-detail.webp"),
    cleared: false,
  },
  {
    slug: "dental-floor",
    sector: "Healthcare",
    title: "Dental floor",
    location: "Abdoun",
    year: "2021",
    scope: "Surgery doors, reception and instrument storage",
    systems: ["door-window-handles", "drawer-systems", "cabinet-handles"],
    brands: ["hafele", "blum"],
    story: placeholderStory,
    cover: "/images/product-handle.webp",
    gallery: placeholderGallery("/images/product-handle.webp", "/images/resources-docs.webp"),
    cleared: false,
  },
  {
    slug: "abdali-boutique",
    sector: "Retail",
    title: "Boutique fit-out",
    location: "Abdali",
    year: "2024",
    scope: "Shopfront door, fitting rooms and display counters",
    systems: ["door-window-handles", "sliding-folding", "cabinet-handles"],
    brands: ["dnd", "hawa"],
    story: placeholderStory,
    cover: "/images/hero-kitchen.webp",
    gallery: placeholderGallery("/images/hero-kitchen.webp", "/images/dnd-palm.webp"),
    cleared: false,
  },
  {
    slug: "mall-unit",
    sector: "Retail",
    title: "Mall unit",
    location: "Irbid",
    year: "2023",
    scope: "Changing rooms, back-of-house doors and a small pantry",
    systems: ["sliding-folding", "door-window-handles", "kitchen-storage"],
    brands: ["hettich", "hafele"],
    figure: { value: "6", label: "rooms" },
    story: placeholderStory,
    cover: "/images/brand-sliding.webp",
    gallery: placeholderGallery("/images/brand-sliding.webp", "/images/product-handle.webp"),
    cleared: false,
  },
  {
    slug: "jeweller-counter",
    sector: "Retail",
    title: "Jeweller's counter",
    location: "Sweifieh",
    year: "2020",
    scope: "Display cases, a strong-room door and staff storage",
    systems: ["cabinet-handles", "opening-closing", "drawer-systems"],
    brands: ["hafele", "blum"],
    story: placeholderStory,
    cover: "/images/showroom-detail.webp",
    gallery: placeholderGallery("/images/showroom-detail.webp", "/images/dnd-pencil.webp"),
    cleared: false,
  },
  {
    slug: "campus-library",
    sector: "Education",
    title: "Campus library",
    location: "Amman",
    year: "2022",
    scope: "Reading-room doors, study carrels and staff offices",
    systems: ["door-window-handles", "hinges", "sliding-folding"],
    brands: ["dnd", "hawa"],
    figure: { value: "4", label: "floors" },
    story: placeholderStory,
    cover: "/images/trade-workshop.webp",
    gallery: placeholderGallery("/images/trade-workshop.webp", "/images/resources-docs.webp"),
    cleared: false,
  },
  {
    slug: "laboratory-block",
    sector: "Education",
    title: "Laboratory block",
    location: "Irbid",
    year: "2024",
    scope: "Lab doors, teaching benches and chemical stores",
    systems: ["door-window-handles", "cabinet-handles", "hinges"],
    brands: ["dnd", "hafele"],
    figure: { value: "16", label: "labs" },
    story: placeholderStory,
    cover: "/images/resources-docs.webp",
    gallery: placeholderGallery("/images/resources-docs.webp", "/images/brand-hinge.webp"),
    cleared: false,
  },
  {
    slug: "lecture-halls",
    sector: "Education",
    title: "Lecture halls",
    location: "Madaba",
    year: "2019",
    scope: "Hall doors, lectern storage and corridor hardware",
    systems: ["door-window-handles", "opening-closing", "hinges"],
    brands: ["dnd", "hafele"],
    figure: { value: "8", label: "halls" },
    story: placeholderStory,
    cover: "/images/dnd-blend-ag.webp",
    gallery: placeholderGallery("/images/dnd-blend-ag.webp", "/images/trade-planning.webp"),
    cleared: false,
  },
];

/** A stand-in rather than a real installation. Its story is the shared placeholder text. */
export const isExample = (project: Project): boolean => project.story === placeholderStory;

/** Every published project: real references, then stand-ins labelled as examples. */
export const PROJECTS: Project[] = [...PROJECT_ENTRIES.filter((project) => !isExample(project)), ...PROJECT_ENTRIES.filter(isExample)];

/** Brand names for display, so project cards and pages read without a catalogue request. */
const BRAND_NAMES: Record<string, string> = { dnd: "DND", hafele: "Häfele", hettich: "Hettich", blum: "Blum", kessebohmer: "Kesseböhmer", salice: "Salice", barazza: "Barazza", hawa: "Hawa", grass: "Grass", fgv: "FGV", vibo: "Vibo", emuca: "Emuca" };
export const brandName = (slug: string): string => BRAND_NAMES[slug] ?? slug;

/** Sectors with at least one published project, in `SECTORS` order. */
export const PUBLISHED_SECTORS: Project["sector"][] = SECTORS.filter((sector) => PROJECTS.some((project) => project.sector === sector));

export const sectorSlug = (sector: Project["sector"]) => sector.toLowerCase();

/** Matches `?sector=` to a published sector. Unknown values show every project. */
export function sectorFromParam(value: string | null): Project["sector"] | null {
  if (!value) return null;
  return PUBLISHED_SECTORS.find((sector) => sectorSlug(sector) === value.toLowerCase()) ?? null;
}

/** Finds a published project by slug. */
export const findProject = (slug: string | undefined) => PROJECTS.find((project) => project.slug === slug);
export const projectHref = (slug: string) => `/projects/${slug}`;
