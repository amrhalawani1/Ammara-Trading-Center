export type Brand = {
  name: string;
  slug: string;
  origin: string;
  description: string;
  coverImage: string;
};

export type ProductCategory = 
  | "Hinges & Opening Systems"
  | "Drawer Runners & Slides"
  | "Sliding Door Systems"
  | "Kitchen Storage & Ergonomics"
  | "Wardrobe & Wire Storage";

export type Product = {
  name: string;
  slug: string;
  brandSlug: string;
  category: ProductCategory;
  description: string;
  image: string;
  specs: { label: string; value: string }[];
  finishes: string[];
};

export const BRANDS: Brand[] = [
  {
    name: "Hettich",
    slug: "hettich",
    origin: "Germany",
    description: "Since 1888, they have been setting the global standard for furniture fittings. Known for engineering precision and extreme durability testing, their hinge systems and drawer runners are the hidden force behind the world's finest cabinetry.",
    coverImage: "/images/brand-hinge.jpg"
  },
  {
    name: "Salice",
    slug: "salice",
    origin: "Italy",
    description: "Pioneers of the concealed hinge and advanced opening systems. Combining Italian design flair with rigorous engineering to create seamless movement solutions.",
    coverImage: "/images/brand-sliding.jpg"
  },
  {
    name: "Kesseböhmer",
    slug: "kessebohmer",
    origin: "Germany",
    description: "Intelligent kitchen storage solutions and ergonomic lifters. Transforming inner cabinet space into highly functional, easily accessible storage.",
    coverImage: "/images/product-handle.jpg"
  },
  {
    name: "Vibo",
    slug: "vibo",
    origin: "Italy",
    description: "Premium wire storage accessories for wardrobes and kitchens. Characterized by elegant Italian wirework, smooth motion, and impeccable plating.",
    coverImage: "/images/brand-hinge.jpg"
  }
];

export const PRODUCTS: Product[] = [
  {
    name: "Sensys Concealed Hinge",
    slug: "sensys-hinge",
    brandSlug: "hettich",
    category: "Hinges & Opening Systems",
    description: "An integrated soft-close hinge system that provides silent, effortless door closing. Designed to perform flawlessly under extreme temperature variations and heavy load conditions. The slim profile maintains the aesthetic purity of the cabinetry interior.",
    image: "/images/product-handle.jpg",
    specs: [
      { label: "Opening Angle", value: "110°" },
      { label: "Cup Depth", value: "12.8 mm" },
      { label: "Door Thickness", value: "15 - 24 mm" },
      { label: "Durability", value: "80,000 cycles tested" }
    ],
    finishes: ["Obsidian Black", "Nickel Plated"]
  },
  {
    name: "AvanTech YOU Drawer",
    slug: "avantech-drawer",
    brandSlug: "hettich",
    category: "Drawer Runners & Slides",
    description: "A highly customizable drawer system with ultra-slim 13mm drawer side profiles. Offers invisible working parts and flawless, smooth running action for premium furniture design.",
    image: "/images/product-handle.jpg",
    specs: [
      { label: "Profile Width", value: "13 mm" },
      { label: "Load Capacity", value: "Up to 78 kg" },
      { label: "Adjustment", value: "4-dimensional" },
      { label: "Motion", value: "Soft-close / Push-to-open" }
    ],
    finishes: ["Anthracite", "Silver", "White"]
  },
  {
    name: "TopLine XL Sliding",
    slug: "topline-xl",
    brandSlug: "hettich",
    category: "Sliding Door Systems",
    description: "Concealed sliding door system for large and heavy ceiling-height wardrobes. Effortless, whisper-quiet opening and closing of doors weighing up to 120 kg.",
    image: "/images/product-handle.jpg",
    specs: [
      { label: "Door Weight", value: "Max 120 kg" },
      { label: "Door Thickness", value: "18 - 50 mm" },
      { label: "Damping", value: "Silent System (Opening/Closing)" },
      { label: "Application", value: "Overlay doors" }
    ],
    finishes: ["Zinc Die-cast", "Aluminium"]
  },
  {
    name: "Air Concealed Hinge",
    slug: "salice-air",
    brandSlug: "salice",
    category: "Hinges & Opening Systems",
    description: "An innovative and highly sophisticated concealed hinge characterized by its compact dimensions. Integrating perfectly into the cabinet top and bottom, it is practically invisible.",
    image: "/images/brand-sliding.jpg",
    specs: [
      { label: "Opening Angle", value: "105°" },
      { label: "Dimensions", value: "10 mm deep x 73 mm long" },
      { label: "Door Weight", value: "Max 20 kg" },
      { label: "Adjustment", value: "3D (height, depth, lateral)" }
    ],
    finishes: ["Titanium", "Nickel"]
  },
  {
    name: "LeMans II Corner System",
    slug: "lemans-ii",
    brandSlug: "kessebohmer",
    category: "Kitchen Storage & Ergonomics",
    description: "The intelligent corner cabinet solution combining high space utilization with outstanding access. Trays swing out smoothly and independently in front of the cabinet.",
    image: "/images/product-handle.jpg",
    specs: [
      { label: "Load Capacity", value: "25 kg per tray" },
      { label: "Cabinet Width", value: "450, 500, 600 mm" },
      { label: "Motion", value: "SoftStopp Plus damping" },
      { label: "Height Adj.", value: "Tool-less tray positioning" }
    ],
    finishes: ["Arena Style (Anthracite)", "Arena Classic (Chrome/White)"]
  },
  {
    name: "Tandem Pantry",
    slug: "tandem-pantry",
    brandSlug: "kessebohmer",
    category: "Kitchen Storage & Ergonomics",
    description: "Operating like a refrigerator, this system offers double the organization. The rear shelves are drawn automatically towards the user when the door is opened.",
    image: "/images/product-handle.jpg",
    specs: [
      { label: "Load Capacity", value: "85 kg total (60kg pull-out, 25kg door)" },
      { label: "Cabinet Width", value: "450, 500, 600 mm" },
      { label: "Height", value: "1700, 1100 mm" },
      { label: "Shelves", value: "Adjustable Arena trays" }
    ],
    finishes: ["Anthracite", "Chrome"]
  },
  {
    name: "Galaxy Wardrobe Pull-out",
    slug: "galaxy-wardrobe",
    brandSlug: "vibo",
    category: "Wardrobe & Wire Storage",
    description: "A comprehensive premium line of wardrobe storage accessories featuring soft-close mechanisms, refined wirework, and sophisticated structural rigidity.",
    image: "/images/brand-hinge.jpg",
    specs: [
      { label: "System Types", value: "Shoe rack, trouser rack, multi-purpose" },
      { label: "Runners", value: "Concealed full-extension soft-close" },
      { label: "Module Width", value: "600, 900 mm" },
      { label: "Material", value: "Epoxy coated steel / Aluminium" }
    ],
    finishes: ["Moka (Dark Brown)", "Grey"]
  }
];

export const CATEGORIES: ProductCategory[] = [
  "Hinges & Opening Systems",
  "Drawer Runners & Slides",
  "Sliding Door Systems",
  "Kitchen Storage & Ergonomics",
  "Wardrobe & Wire Storage"
];
