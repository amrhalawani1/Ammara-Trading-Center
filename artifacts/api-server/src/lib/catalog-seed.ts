export const initialBrands = [
  {
    name: "Hettich",
    slug: "hettich",
    country: "Germany",
    description:
      "Since 1888, they have been setting the global standard for furniture fittings. Known for engineering precision and extreme durability testing, their hinge systems and drawer runners are the hidden force behind the world's finest cabinetry.",
    coverImage: "/images/brand-hinge.jpg",
  },
  {
    name: "Salice",
    slug: "salice",
    country: "Italy",
    description:
      "Pioneers of the concealed hinge and advanced opening systems. Combining Italian design flair with rigorous engineering to create seamless movement solutions.",
    coverImage: "/images/brand-sliding.jpg",
  },
  {
    name: "Kesseböhmer",
    slug: "kessebohmer",
    country: "Germany",
    description:
      "Intelligent kitchen storage solutions and ergonomic lifters. Transforming inner cabinet space into highly functional, easily accessible storage.",
    coverImage: "/images/product-handle.jpg",
  },
  {
    name: "Vibo",
    slug: "vibo",
    country: "Italy",
    description:
      "Premium wire storage accessories for wardrobes and kitchens. Characterized by elegant Italian wirework, smooth motion, and impeccable plating.",
    coverImage: "/images/brand-hinge.jpg",
  },
] as const;

export const initialProducts = [
  ["Sensys Concealed Hinge", "sensys-hinge", "hettich", "Hinges & Opening Systems", "An integrated soft-close hinge system that provides silent, effortless door closing. Designed to perform flawlessly under extreme temperature variations and heavy load conditions. The slim profile maintains the aesthetic purity of the cabinetry interior.", [["Opening Angle", "110°"], ["Cup Depth", "12.8 mm"], ["Door Thickness", "15 - 24 mm"], ["Durability", "80,000 cycles tested"]], ["Obsidian Black", "Nickel Plated"]],
  ["AvanTech YOU Drawer", "avantech-drawer", "hettich", "Drawer Runners & Slides", "A highly customizable drawer system with ultra-slim 13mm drawer side profiles. Offers invisible working parts and flawless, smooth running action for premium furniture design.", [["Profile Width", "13 mm"], ["Load Capacity", "Up to 78 kg"], ["Adjustment", "4-dimensional"], ["Motion", "Soft-close / Push-to-open"]], ["Anthracite", "Silver", "White"]],
  ["TopLine XL Sliding", "topline-xl", "hettich", "Sliding Door Systems", "Concealed sliding door system for large and heavy ceiling-height wardrobes. Effortless, whisper-quiet opening and closing of doors weighing up to 120 kg.", [["Door Weight", "Max 120 kg"], ["Door Thickness", "18 - 50 mm"], ["Damping", "Silent System (Opening/Closing)"], ["Application", "Overlay doors"]], ["Zinc Die-cast", "Aluminium"]],
  ["Air Concealed Hinge", "salice-air", "salice", "Hinges & Opening Systems", "An innovative and highly sophisticated concealed hinge characterized by its compact dimensions. Integrating perfectly into the cabinet top and bottom, it is practically invisible.", [["Opening Angle", "105°"], ["Dimensions", "10 mm deep x 73 mm long"], ["Door Weight", "Max 20 kg"], ["Adjustment", "3D (height, depth, lateral)"]], ["Titanium", "Nickel"]],
  ["LeMans II Corner System", "lemans-ii", "kessebohmer", "Kitchen Storage & Ergonomics", "The intelligent corner cabinet solution combining high space utilization with outstanding access. Trays swing out smoothly and independently in front of the cabinet.", [["Load Capacity", "25 kg per tray"], ["Cabinet Width", "450, 500, 600 mm"], ["Motion", "SoftStopp Plus damping"], ["Height Adj.", "Tool-less tray positioning"]], ["Arena Style (Anthracite)", "Arena Classic (Chrome/White)"]],
  ["Tandem Pantry", "tandem-pantry", "kessebohmer", "Kitchen Storage & Ergonomics", "Operating like a refrigerator, this system offers double the organization. The rear shelves are drawn automatically towards the user when the door is opened.", [["Load Capacity", "85 kg total (60kg pull-out, 25kg door)"], ["Cabinet Width", "450, 500, 600 mm"], ["Height", "1700, 1100 mm"], ["Shelves", "Adjustable Arena trays"]], ["Anthracite", "Chrome"]],
  ["Galaxy Wardrobe Pull-out", "galaxy-wardrobe", "vibo", "Wardrobe & Wire Storage", "A comprehensive premium line of wardrobe storage accessories featuring soft-close mechanisms, refined wirework, and sophisticated structural rigidity.", [["System Types", "Shoe rack, trouser rack, multi-purpose"], ["Runners", "Concealed full-extension soft-close"], ["Module Width", "600, 900 mm"], ["Material", "Epoxy coated steel / Aluminium"]], ["Moka (Dark Brown)", "Grey"]],
] as const;