// ATC's own catalogue copy for the imported Dnd products.
// Summaries, statements and feature lines are written for Amara Trading Center from the
// facts extracted in ./dnd-extract.ts. Dnd's marketing prose is never reproduced.
// Keyed by the handle slug used on dndhandles.it.

export interface CopyEntry {
  /** Product slug on the ATC site. */
  slug: string;
  /** Overrides the extracted h1 when the brand page carries a typo or a section prefix. */
  title?: string;
  /** ATC solution category. */
  category: string;
  family: string;
  /** Model reference where Dnd publishes one. */
  sku?: string | null;
  applications: string[];
  /** Where this piece is specified: used for filtering and for the catalog rail headings. */
  setting: string;
  summary: string;
  statement: string;
  features: string[];
  material?: string;
  featured?: boolean;
}

/**
 * Short designer notes written for ATC, only for designers whose work is well documented
 * outside the Dnd site. Designers without an entry appear as a spec line and no bio block.
 */
export const DESIGNERS: Record<string, string> = {
  "Giulio Iacchetti": "Industrial designer working in Milan since 1992, best known for everyday objects for Alessi, Foscarini and Moleskine, and a Compasso d'Oro winner.",
  "Jaime Hayon": "Spanish artist and designer based in Valencia, working across furniture, ceramics and interiors in a playful, hand-drawn figurative language.",
  "BIG \u2013 Bjarke Ingels Group": "Architecture practice founded by Bjarke Ingels in Copenhagen, working from urban masterplans down to the scale of a door handle.",
  "Elena Salmistraro": "Milanese designer and illustrator whose work brings figuration, pattern and colour into industrial products.",
};

export const COPY: Record<string, CopyEntry> = {
  lucrezia: {
    slug: "dnd-lucrezia",
    category: "Door & window handles",
    family: "lucrezia",
    applications: ["Interior doors"],
    setting: "Interior doors",
    summary:
      "A brass door lever by Marco Pisati on a round rose, drawn as a slim tapering bar that widens slightly towards the grip. Seven finishes run from matt sandblasted bronze through satin chrome to the PVD golds, so the lever can be matched to either a warm or a cool metal scheme.",
    statement: "A quiet classic in brass.",
    features: ["Round rose", "Seven finishes including PVD golds", "Two further versions in the same family"],
    material: "Brass",
    featured: true,
  },
  pencil: {
    slug: "dnd-pencil",
    category: "Door & window handles",
    family: "pencil",
    applications: ["Interior doors"],
    setting: "Interior doors",
    summary:
      "A door lever designed by BIG - Bjarke Ingels Group, cut as a plain cylindrical bar with a squared-off end. It is offered in six aluminium finishes, from natural aluminium and silver through to white and black.",
    statement: "One straight line, held.",
    features: ["Cylindrical bar grip", "Six aluminium finishes", "Matching pull handle available"],
    material: "Aluminium",
    featured: true,
  },
  zeppelin: {
    slug: "dnd-zeppelin",
    category: "Door & window handles",
    family: "zeppelin",
    applications: ["Interior doors"],
    setting: "Interior doors",
    summary:
      "Jaime Hayon's door lever, a rounded tapering form that swells in the hand and returns to a fine point. It is the widest finish range in this selection: eight finishes on the standard rose and the same eight again on the concealed Unico rose.",
    statement: "A form that fills the hand.",
    features: ["Standard or Unico concealed rose", "Eight finishes per rose type", "Designed by Jaime Hayon"],
    featured: true,
  },
  minima: {
    slug: "dnd-minima",
    category: "Door & window handles",
    family: "minima",
    applications: ["Interior doors"],
    setting: "Interior doors",
    summary:
      "Dnd's own technical division drew this lever as the plainest possible L: a straight grip, a square return and nothing else. Three finishes keep it neutral where the door, not the hardware, is meant to be seen.",
    statement: "The least a lever can be.",
    features: ["Straight L-profile grip", "Three finishes", "Matching window handle available"],
  },
  "interna-new-flush-minimalist-door-handle": {
    slug: "dnd-interna",
    title: "interna",
    category: "Door & window handles",
    family: "interna",
    applications: ["Flush interior doors"],
    setting: "Flush interior doors",
    summary:
      "A flush handle by Giulio Iacchetti, inset into the door panel rather than mounted on it, with a circular profile and a bevelled edge to take the fingers. It is made in zamak, offered in nine finishes, and was developed alongside the Dynamic magnetic locking system so a door can be built with no visible lever and no lock body.",
    statement: "A door with nothing on it.",
    features: [
      "Inset flush with the panel face",
      "Bevelled circular grip",
      "Nine finishes",
      "Developed for the Dynamic magnetic lock",
    ],
    material: "Zamak",
    featured: true,
  },
  "ginkgo-dk": {
    slug: "dnd-ginkgo-window",
    title: "ginkgo",
    category: "Door & window handles",
    family: "ginkgo",
    applications: ["Windows", "Tilt-and-turn windows"],
    setting: "Windows",
    summary:
      "The window version of Giulio Iacchetti's Ginkgo, whose grip takes the outline of a ginkgo leaf. It is made for tilt-and-turn windows and carries the largest finish range in the family, in both standard and Unico rose forms, so window and door hardware can be specified to match across a room.",
    statement: "The leaf, on the window.",
    features: ["For tilt-and-turn windows", "Standard or Unico rose", "Matches the Ginkgo door range"],
    material: "Brass",
    featured: true,
  },
  "timeless-dk": {
    slug: "dnd-timeless-window",
    title: "timeless",
    category: "Door & window handles",
    family: "timeless",
    applications: ["Windows", "Tilt-and-turn windows"],
    setting: "Windows",
    summary:
      "Marco Pisati's Timeless in its window form, keeping the same softly squared grip as the door lever. Ten finishes cover the range from polished chrome to the darker PVD tones.",
    statement: "The door lever, taken to the window.",
    features: ["For tilt-and-turn windows", "Ten finishes", "Matches the Timeless door and knob range"],
  },
  "minima-dk": {
    slug: "dnd-minima-window",
    title: "minima",
    category: "Door & window handles",
    family: "minima",
    applications: ["Windows", "Tilt-and-turn windows"],
    setting: "Windows",
    summary:
      "The window handle from the Minima family: the same reduced L-profile as the door lever, sized for a tilt-and-turn window. Three finishes, chosen to disappear against a frame rather than sit on it.",
    statement: "Reduced to the turn.",
    features: ["For tilt-and-turn windows", "Three finishes", "Matches the Minima door lever"],
  },
  "master-tonda-sd501": {
    slug: "dnd-master-tonda-sd501",
    title: "master tonda",
    category: "Sliding & folding doors",
    family: "master",
    sku: "SD501",
    applications: ["Sliding doors", "Pocket doors"],
    setting: "Sliding doors",
    summary:
      "A round flush pull for sliding and pocket doors, model SD501 in the Master series, recessed into the leaf so the door can pass fully into the wall. Twenty-four finishes make it the broadest finish range Dnd publishes, covering polished and satin metals, bronzes, chromes and PVD tones.",
    statement: "Flush with the leaf.",
    features: ["Recessed round flush pull", "24 finishes", "Master series, model SD501"],
  },
  "ring-sd222": {
    slug: "dnd-ring-sd222",
    title: "ring",
    category: "Sliding & folding doors",
    family: "ring",
    sku: "SD222",
    applications: ["Sliding doors", "Pocket doors"],
    setting: "Sliding doors",
    summary:
      "A square flush pull for sliding doors from the Ring series, model SD222, set into the door face with a clean cut edge. Thirteen finishes let it match the lever hardware used on the hinged doors in the same room.",
    statement: "A square cut into the door.",
    features: ["Square recessed flush pull", "13 finishes", "Ring series, model SD222"],
  },
  "ginkgo-tonda-sd501": {
    slug: "dnd-ginkgo-tonda-sd501",
    title: "ginkgo tonda",
    category: "Sliding & folding doors",
    family: "ginkgo",
    sku: "SD501",
    applications: ["Sliding doors", "Pocket doors"],
    setting: "Sliding doors",
    summary:
      "The Ginkgo sliding-door pull, model SD501, which carries the leaf motif into a round recessed plate. Four finishes, intended for projects already specifying Ginkgo levers on the hinged doors.",
    statement: "The leaf, recessed.",
    features: ["Round recessed flush pull", "Four finishes", "Ginkgo series, model SD501"],
  },
  "maniglione-zeppelin": {
    slug: "dnd-zeppelin-pull-handle",
    title: "zeppelin",
    category: "Door & window handles",
    family: "zeppelin",
    applications: ["Entrance doors", "Gates"],
    setting: "Entrance doors",
    summary:
      "The entrance pull from Jaime Hayon's Zeppelin family, the lever's swelling profile drawn out to full door height. Specified where the front door should carry the same hand as the levers inside.",
    statement: "The same hand, at the entrance.",
    features: ["For entrance doors and gates", "Matches the Zeppelin lever range", "Designed by Jaime Hayon"],
  },
  "maniglione-pencil": {
    slug: "dnd-pencil-pull-handle",
    title: "pencil",
    category: "Door & window handles",
    family: "pencil",
    applications: ["Entrance doors", "Gates"],
    setting: "Entrance doors",
    summary:
      "The entrance pull from BIG's Pencil family: the same plain cylindrical bar as the lever, run long for a front door. Six aluminium finishes.",
    statement: "The line, run long.",
    features: ["For entrance doors and gates", "Six aluminium finishes", "Matches the Pencil lever"],
    material: "Aluminium",
  },
  "maniglione-tube-round": {
    slug: "dnd-tube-round-pull-handle",
    title: "tube round",
    category: "Door & window handles",
    family: "tube",
    applications: ["Entrance doors", "Gates"],
    setting: "Entrance doors",
    summary:
      "A plain round tube pull for entrance doors from Dnd's technical division, the workhorse of the range where a project wants grip and length without a signature profile. Four finishes.",
    statement: "Grip, length, nothing else.",
    features: ["For entrance doors and gates", "Round tube section", "Four finishes"],
  },
  edra: {
    slug: "dnd-edra",
    category: "Sliding & folding doors",
    family: "edra",
    applications: ["Lift-and-slide doors"],
    setting: "Lift-and-slide doors",
    summary:
      "A pull handle by Mauro Ronchi for lift-and-slide systems, the large glazed sliders used on terraces and garden elevations. Eleven finishes, and a short version is published in the same family for narrower leaves.",
    statement: "Sized for the big slider.",
    features: ["For lift-and-slide systems", "11 finishes", "Short version available in the family"],
  },
  slide: {
    slug: "dnd-slide",
    category: "Sliding & folding doors",
    family: "slide",
    applications: ["Lift-and-slide doors"],
    setting: "Lift-and-slide doors",
    summary:
      "Mauro Ronchi's Slide pull handle for lift-and-slide door systems, a flat vertical grip that keeps close to the frame. Seven finishes, with a short version published for narrower leaves.",
    statement: "Close to the frame.",
    features: ["For lift-and-slide systems", "Seven finishes", "Short version available"],
  },
  "pomoli-sfera": {
    slug: "dnd-sfera-knob",
    title: "sfera",
    category: "Door & window handles",
    family: "sfera",
    applications: ["Interior doors"],
    setting: "Interior doors",
    summary:
      "A spherical door knob from Dnd's technical division, for doors where a fixed knob is wanted instead of a lever. Three finishes: polished chrome, satin chrome and black.",
    statement: "A sphere, held.",
    features: ["Spherical door knob", "Three finishes"],
  },
  "pomolo-timeless": {
    slug: "dnd-timeless-door-knob",
    title: "timeless",
    category: "Door & window handles",
    family: "timeless",
    applications: ["Interior doors"],
    setting: "Interior doors",
    summary:
      "The door knob from Marco Pisati's Timeless family, carrying the same profile as the lever for rooms where a knob suits the door better. Nine finishes, matched to the rest of the Timeless range.",
    statement: "The family, as a knob.",
    features: ["Fixed door knob", "Nine finishes", "Matches the Timeless lever and window handle"],
  },
  "pomoli-olive": {
    slug: "dnd-olive-knob",
    title: "olive",
    category: "Door & window handles",
    family: "olive",
    applications: ["Interior doors"],
    setting: "Interior doors",
    summary:
      "A door knob by the Park studio, shaped as an elongated olive that sits lengthways in the palm. Seven finishes.",
    statement: "An olive in the palm.",
    features: ["Elongated knob profile", "Seven finishes"],
  },
  "crisalide-knob": {
    slug: "dnd-crisalide-furniture-knob",
    title: "crisalide",
    category: "Cabinet handles",
    family: "crisalide",
    applications: ["Cabinetry", "Wardrobes"],
    setting: "Furniture",
    summary:
      "The furniture knob from Elena Salmistraro's Crisalide family, with the same glossy porcelain insert as the door lever, on a scale made for cabinet and wardrobe fronts. Published in black with a white porcelain insert.",
    statement: "The door piece, at cabinet scale.",
    features: ["Glossy porcelain insert", "For cabinetry and wardrobes", "Matches the Crisalide door range"],
  },
  "lucrezia-knob": {
    slug: "dnd-lucrezia-furniture-knob",
    title: "lucrezia",
    category: "Cabinet handles",
    family: "lucrezia",
    applications: ["Cabinetry", "Wardrobes"],
    setting: "Furniture",
    summary:
      "Marco Pisati's Lucrezia as a furniture knob, keeping the tapering profile of the door lever at cabinet size. Three finishes, for joinery that should read as part of the same scheme as the doors.",
    statement: "Continuity, down to the cabinet.",
    features: ["For cabinetry and wardrobes", "Three finishes", "Matches the Lucrezia door lever"],
  },
  "timeless-knob": {
    slug: "dnd-timeless-furniture-knob",
    title: "timeless",
    category: "Cabinet handles",
    family: "timeless",
    applications: ["Cabinetry", "Wardrobes"],
    setting: "Furniture",
    summary:
      "The cabinet knob from the Timeless family, with nine finishes — the same palette as the Timeless levers, door knob and window handle, so a room can be finished in one metal throughout.",
    statement: "One metal, throughout the room.",
    features: ["For cabinetry and wardrobes", "Nine finishes", "Matches the full Timeless range"],
  },
  chiocciola: {
    slug: "dnd-chiocciola-door-stop",
    title: "chiocciola",
    category: "Opening & closing",
    family: "chiocciola",
    applications: ["Interior doors"],
    setting: "Door stops",
    summary:
      "A floor-mounted door stop with a coiled, shell-like profile, from Dnd's technical division. Six finishes, so the stop can be specified in the same metal as the levers rather than left as an afterthought.",
    statement: "The detail most schemes forget.",
    features: ["Floor-mounted door stop", "Six finishes"],
  },
  ring: {
    slug: "dnd-ring-door-stop",
    title: "ring",
    category: "Opening & closing",
    family: "ring",
    applications: ["Interior doors"],
    setting: "Door stops",
    summary:
      "The Ring door stop, a plain cylinder with a soft buffer face, published in twelve finishes. It belongs to the same Ring series as the sliding-door flush pulls.",
    statement: "A cylinder, and no more.",
    features: ["Floor-mounted door stop", "12 finishes", "Part of the Ring series"],
  },
  dynamic: {
    slug: "dnd-dynamic-locking-system",
    title: "dynamic",
    category: "Opening & closing",
    family: "dynamic",
    applications: ["Hinged doors", "Flush doors"],
    setting: "Locking systems",
    summary:
      "A magnetic locking system for hinged doors that removes the lock body altogether: the leaf is held shut by magnetic attraction between a plate in the door and an opposing support in the frame. It was designed to be used with flush handles such as Interna, and it won an Archiproducts Design Award in 2024.",
    statement: "A door that closes on magnetism alone.",
    features: [
      "No lock body required in the leaf",
      "Magnetic plate, brass cover and opposing support",
      "Developed alongside the Interna flush handle",
    ],
  },
  vertical: {
    slug: "dnd-vertical-locking-system",
    title: "vertical",
    category: "Opening & closing",
    family: "vertical",
    applications: ["Hinged doors", "Swing doors"],
    setting: "Locking systems",
    summary:
      "A concealed lock system for swing doors, supplied as a complete door kit whose visible parts are finished to match Dnd's handle range. It is the system behind the brand's Total Look approach, where lever, lock and accessories are specified in a single finish.",
    statement: "The lock, finished like the handle.",
    features: ["Concealed lock for swing doors", "Supplied as a coordinated door kit", "Finishes matched to Dnd handles"],
  },
  dnd: {
    slug: "dnd-key",
    title: "dnd key",
    category: "Opening & closing",
    family: "dnd",
    applications: ["Interior doors"],
    setting: "Keys",
    summary:
      "A door key designed by Giulio Iacchetti, treated as a visible part of the scheme rather than a hardware afterthought. Specified where a project wants the key to match the levers on the same doors.",
    statement: "Even the key is drawn.",
    features: ["Designed by Giulio Iacchetti", "For interior doors"],
  },
  "crisalide-appendino": {
    slug: "dnd-crisalide-hanger",
    title: "crisalide hanger",
    category: "Cabinet handles",
    family: "crisalide",
    applications: ["Walls", "Wardrobes"],
    setting: "Hangers",
    summary:
      "The wall hanger from Elena Salmistraro's Crisalide family, using the same porcelain insert as the levers and knobs. It extends the family past the door into the room itself — hallways, dressing rooms and bathrooms.",
    statement: "The family, off the door.",
    features: ["Wall-mounted hanger", "Glossy porcelain insert", "Matches the Crisalide range"],
  },
};
