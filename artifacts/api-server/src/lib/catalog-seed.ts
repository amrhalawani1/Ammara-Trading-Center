// Catalogue seed used to populate an empty database on first request (see
// `ensureCatalogSeeded` in ./catalog-content.ts).
// Brands: the four extracted partner houses plus the wider partner roster.
// Products: extracted from DND, Blum, Häfele and Barazza product pages (./catalog-extracted.ts).
import type { ProductDetails } from "@workspace/db";
import { extractedProducts } from "./catalog-extracted";

export type SeedStatus = "draft" | "published" | "comingSoon" | "retired";

export interface SeedEditorial {
  statement?: string;
  awards?: string[];
  chapters?: { title: string; body: string; image?: string | null }[];
  designer?: { name: string; bio: string; url?: string | null };
  gallery?: string[];
}

export interface SeedBrand {
  name: string;
  slug: string;
  country: string;
  category: string;
  description: string;
  coverImage: string;
  isFeatured: boolean;
  status: SeedStatus;
}

export interface SeedProduct {
  title: string;
  slug: string;
  brandSlug: string;
  category: string;
  family?: string | null;
  sku?: string | null;
  description: string;
  specs: { label: string; value: string; group?: string | null }[];
  finishes: string[];
  images: string[];
  editorial?: SeedEditorial | null;
  details?: ProductDetails | null;
  isFeatured: boolean;
  status: SeedStatus;
}

export const initialBrands: SeedBrand[] = [
  {
    name: "Hettich",
    slug: "hettich",
    country: "Germany",
    category: "Hinges & Drawer Systems",
    description:
      "Since 1888, they have been setting the global standard for furniture fittings. Known for engineering precision and extreme durability testing, their hinge systems and drawer runners are the hidden force behind the world's finest cabinetry.",
    coverImage: "/images/brand-hinge.webp",
    isFeatured: true,
    status: "published",
  },
  {
    name: "Salice",
    slug: "salice",
    country: "Italy",
    category: "Opening Systems",
    description:
      "Pioneers of the concealed hinge and advanced opening systems. Combining Italian design flair with rigorous engineering to create seamless movement solutions.",
    coverImage: "/images/brand-sliding.webp",
    isFeatured: true,
    status: "published",
  },
  {
    name: "Kesseböhmer",
    slug: "kessebohmer",
    country: "Germany",
    category: "Kitchen Storage & Ergonomics",
    description:
      "Intelligent kitchen storage solutions and ergonomic lifters. Transforming inner cabinet space into highly functional, easily accessible storage.",
    coverImage: "/images/product-handle.webp",
    isFeatured: false,
    status: "published",
  },
  {
    name: "Vibo",
    slug: "vibo",
    country: "Italy",
    category: "Wardrobe & Wire Storage",
    description:
      "Premium wire storage accessories for wardrobes and kitchens. Characterized by elegant Italian wirework, smooth motion, and impeccable plating.",
    coverImage: "/images/brand-hinge.webp",
    isFeatured: false,
    status: "published",
  },
  {
    name: "Blum",
    slug: "blum",
    country: "Austria",
    category: "Hinges & Drawer Systems",
    description:
      "The Austrian benchmark for cabinet movement. Blum's hinge and drawer platforms are engineered around decades of motion research, delivering fittings that feel weightless even under heavy daily use.",
    coverImage: "/images/showroom-detail.webp",
    isFeatured: true,
    status: "published",
  },
  {
    name: "Barazza",
    slug: "barazza",
    country: "Italy",
    category: "Sinks, Taps & Cooking",
    description:
      "A family manufacturer from Pordenone working in stainless steel since 1968. Barazza makes sinks, taps, hobs and built-in appliances with the thickness and finish of professional kitchen equipment, sized for the home.",
    coverImage: "/images/hero-kitchen.webp",
    isFeatured: true,
    status: "published",
  },
  {
    name: "Grass",
    slug: "grass",
    country: "Austria",
    category: "Drawer Runners & Slides",
    description:
      "Precision-engineered drawer and hinge technology from the Austrian Alps. Grass systems are built for architects who specify to the millimetre and expect that tolerance to hold for twenty years.",
    coverImage: "/images/trade-workshop.webp",
    isFeatured: false,
    status: "published",
  },
  {
    name: "Häfele",
    slug: "hafele",
    country: "Germany",
    category: "Handles & Decorative Hardware",
    description:
      "One of the world's broadest furniture and architectural hardware ranges, from handles to locking systems to integrated lighting. Häfele is the catalogue a specifier reaches for when the detail has to be exactly right.",
    coverImage: "/images/product-handle.webp",
    isFeatured: true,
    status: "published",
  },
  {
    name: "DND",
    slug: "dnd",
    country: "Italy",
    category: "Handles & Decorative Hardware",
    description:
      "An Italian design house working with architects and product designers to turn the door handle into a considered object in its own right. Every DND handle is a small study in proportion, grip, and finish.",
    coverImage: "/images/dnd-palm.webp",
    isFeatured: true,
    status: "published",
  },
  {
    name: "Hawa",
    slug: "hawa",
    country: "Switzerland",
    category: "Sliding Door Systems",
    description:
      "Swiss-engineered sliding and folding door hardware for interiors that need to move silently and disappear completely when not in use. A specialist brand for architects working with pocket doors and room dividers.",
    coverImage: "/images/showroom-wide.webp",
    isFeatured: false,
    status: "published",
  },
  {
    name: "FGV",
    slug: "fgv",
    country: "Italy",
    category: "Hinges & Opening Systems",
    description:
      "An Italian specialist in lift, flap, and bi-fold opening mechanisms for wall cabinets and high-level storage. FGV systems bring elegant, counterbalanced motion to doors that would otherwise be awkward to reach.",
    coverImage: "/images/brand-sliding.webp",
    isFeatured: false,
    status: "published",
  },
  {
    name: "Emuca",
    slug: "emuca",
    country: "Spain",
    category: "LED Lighting & Electronics",
    description:
      "Spanish innovators in furniture fittings and integrated LED lighting. Emuca brings low-voltage, sensor-driven light into cabinetry, wardrobes, and worktops without visible wiring.",
    coverImage: "/images/trade-planning.webp",
    isFeatured: true,
    status: "comingSoon",
  },
];

export const initialProducts: SeedProduct[] = extractedProducts;
