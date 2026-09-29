import { company } from "@/lib/content";

export type GalleryShot = { src: string; alt: string; caption: string };

export type ShowroomStory = {
  /** URL segment under /showroom/. */
  slug: string;
  /** Matches `company.showrooms[].name`. */
  name: string;
  /** One line under the name on the overview and detail hero. */
  summary: string;
  /** Headline on the detail page. */
  headline: string;
  /** The story, one paragraph per entry. */
  story: string[];
  /** Short facts shown beside the story. */
  facts: { label: string; value: string }[];
  /** What is installed on this floor, in walking order (solution slugs). */
  floor: string[];
  gallery: GalleryShot[];
};

export const SHOWROOM_STORIES: ShowroomStory[] = [
  {
    slug: "al-bayader",
    name: "Al-Bayader",
    summary: "The flagship floor. Kitchen systems, door hardware and finishes are installed so you can open, load and close them before you specify.",
    headline: "The floor we built so nothing has to be imagined.",
    story: [
      "Al-Bayader opened in 2011 when the sample boards in the old shop stopped being enough. Architects were specifying drawer systems from a photograph and finding out on site how they felt. So we built full kitchens, hung real doors and wired everything, and told people to come and use it.",
      "The floor is arranged the way a house is fitted: entrance hardware first, then the kitchen, then wardrobes and sliding walls at the back. Every runner is loaded with weight, every hinge has been opened tens of thousands of times, and the finishes sit next to a window because that is where they will be judged.",
      "There is a long table at the centre. Drawings get spread on it, item numbers get written on them, and most specifications leave the building finished. A consultant gives you the first few minutes to look, then is there when you need them.",
    ],
    facts: [
      { label: "Opened", value: "2011" },
      { label: "Size", value: "640 m²" },
      { label: "Installed systems", value: "38" },
      { label: "Best for", value: "Architects and homeowners" },
    ],
    floor: ["door-window-handles", "cabinet-handles", "hinges", "drawer-systems", "sliding-folding", "kitchen-storage"],
    gallery: [
      { src: "/images/showroom-lounge.webp", alt: "The showroom lounge with kitchens beyond", caption: "The lounge, looking through to the kitchens" },
      { src: "/images/showroom-reception.webp", alt: "The reception desk and partner brand wall", caption: "Reception, and the brands on the wall behind it" },
      { src: "/images/building-facade.webp", alt: "The Amara building from the street", caption: "The building, number 66" },
      { src: "/images/building-aerial.webp", alt: "The showroom building from above", caption: "The floor, seen from the street" },
      { src: "/images/showroom-handles.webp", alt: "A wall of door handles", caption: "Door handles, one board per family" },
      { src: "/images/showroom-hinges.webp", alt: "Brass hinges on timber doors", caption: "Hinges, hung on real doors" },
      { src: "/images/showroom-blum.webp", alt: "The Blum kitchen display", caption: "Blum kitchens, installed and open" },
      { src: "/images/kitchen-corner.webp", alt: "Corner drawers pulled out of a kitchen", caption: "Corner storage, pulled clear of the cabinet" },
      { src: "/images/lift-cabinet.webp", alt: "A lift-up cabinet open above a counter", caption: "A wall cabinet that lifts up and stays" },
      { src: "/images/drawer-cutlery.webp", alt: "An organised cutlery drawer", caption: "A drawer, divided for what it holds" },
      { src: "/images/showroom-seating.webp", alt: "Seating beside dark wood cabinetry", caption: "Somewhere to sit before the specification" },
    ],
  },
  {
    slug: "al-wehdat",
    name: "Al-Wehdat",
    summary: "The trade floor. Earlier hours for fabricators, with the same systems on display and a consultant who works from drawings.",
    headline: "The trade counter, open before the workshop does.",
    story: [
      "Al-Wehdat is the original ATC address. It started as a counter on Building Materials Street in 1977, selling hinges by the box to the carpenters who worked on the same road, and it still opens at eight because they still start early.",
      "The floor is smaller and denser than Al-Bayader. Systems are mounted on panels rather than in full rooms, so a fabricator can compare four drawer runners side by side, check a drilling pattern, and take stock away the same morning.",
      "The consultant here works from cutting lists and joinery drawings rather than mood boards. Bring a door schedule and you leave with item numbers, quantities and the fitting drawings for each system.",
    ],
    facts: [
      { label: "Opened", value: "1977" },
      { label: "Size", value: "220 m²" },
      { label: "Installed systems", value: "24" },
      { label: "Best for", value: "Fabricators and joiners" },
    ],
    floor: ["hinges", "drawer-systems", "cabinet-handles", "sliding-folding"],
    gallery: [
      { src: "/images/showroom-dnd.webp", alt: "dnd handles on display boards", caption: "Handles, board by board, for comparison" },
      { src: "/images/showroom-hinges.webp", alt: "Brass hinges on timber display doors", caption: "Hinges hung on real doors" },
      { src: "/images/drawer-organizer.webp", alt: "Drawers open with fitted organisers", caption: "Drawer boxes, loaded and pulled out" },
      { src: "/images/kitchen-pullout.webp", alt: "A pull-out cabinet extended from a base unit", caption: "A pull-out, extended clear of the run" },
      { src: "/images/lift-mechanism.webp", alt: "A Blum lift arm holding a cabinet door", caption: "The lift fitting, visible once the door is open" },
      { src: "/images/counter-socket.webp", alt: "A pop-up power socket in a worktop", caption: "A worktop socket, raised from the counter" },
    ],
  },
];

export type ShowroomDetails = { role: string; addressLines: readonly string[]; phone: string; hours: string };
export type ShowroomEntry = ShowroomStory & ShowroomDetails;

/** Every showroom with its story and contact details joined. */
export const SHOWROOMS: ShowroomEntry[] = SHOWROOM_STORIES.map((story) => {
  const details: (ShowroomDetails & { name: string }) | undefined = company.showrooms.find((item) => item.name === story.name);
  if (!details) throw new Error(`No contact details for showroom "${story.name}"`);
  return { ...details, ...story };
});

export function findShowroom(slug: string | undefined): ShowroomEntry | undefined {
  return SHOWROOMS.find((item) => item.slug === slug);
}

export const showroomHref = (slug: string) => `/showroom/${slug}`;
