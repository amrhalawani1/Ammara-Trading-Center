/**
 * Problem-first guided selector. Visitors rarely arrive knowing they need a "lift system"; they
 * arrive with a wall cabinet they keep hitting their head on. This maps three plain answers
 * (where, what is wrong, what matters most) to the solution area that fixes it.
 */

export type Room = "kitchen" | "wardrobe" | "doors" | "bathroom";

export interface Problem {
  id: string;
  /** In the visitor's words. */
  label: string;
  /** Solution slug the catalogue filters on. */
  solution: string;
  /** Search terms narrowed further by the constraint (optional). */
  queries?: Partial<Record<Constraint, string>>;
  /** What we would tell them at the counter. */
  answer: string;
}

export type Constraint = "quiet" | "heavy" | "small" | "handleless" | "budget" | "looks";

export interface RoomOption {
  id: Room;
  label: string;
  hint: string;
  problems: Problem[];
}

export const CONSTRAINTS: { id: Constraint; label: string }[] = [
  { id: "quiet", label: "It has to close quietly" },
  { id: "heavy", label: "It carries real weight" },
  { id: "small", label: "Space is tight" },
  { id: "handleless", label: "No visible handles" },
  { id: "looks", label: "The finish is the point" },
  { id: "budget", label: "It has to last" },
];

export const ROOMS: RoomOption[] = [
  {
    id: "kitchen",
    label: "Kitchen",
    hint: "Cabinets, drawers, corners, worktops",
    problems: [
      {
        id: "drawers-stick",
        label: "Drawers stick, sag or slam",
        solution: "drawer-systems",
        queries: { heavy: "runner 70 kg", quiet: "soft close runner" },
        answer: "Worn side-mount runners are the usual cause. A concealed box or undermount runner system carries 40 to 70 kg, closes itself and stays level after years of use.",
      },
      {
        id: "wall-cabinet-doors",
        label: "Wall cabinet doors get in the way",
        solution: "lift-systems",
        queries: { small: "compact lift", quiet: "soft close lift" },
        answer: "Replace the hinged door with a lift-up or fold-up flap fitting. It opens upward and stays put at any height, so nothing swings into your head or across the worktop.",
      },
      {
        id: "corner-wasted",
        label: "The corner cabinet is dead space",
        solution: "kitchen-storage",
        queries: { heavy: "corner pull-out", small: "corner pull-out" },
        answer: "A corner pull-out or swing-out brings the whole cabinet out to you. Kesseböhmer builds these for the loads a real pantry puts on them.",
      },
      {
        id: "tall-unit",
        label: "Cannot reach the back of tall units",
        solution: "kitchen-storage",
        queries: { heavy: "larder pull-out" },
        answer: "A larder pull-out turns the whole tall unit into one drawer that comes out to you. Shelves stay accessible from both sides.",
      },
      {
        id: "cabinet-handles",
        label: "Handles look dated or feel cheap",
        solution: "cabinet-handles",
        queries: { handleless: "push to open", looks: "brass handle" },
        answer: "Handles are the one part you touch every day. We stock solid handles in brushed and PVD finishes that match across a whole kitchen, or push-to-open fittings if you would rather have none.",
      },
      {
        id: "sink-tap",
        label: "The sink or tap is failing",
        solution: "sinks-taps",
        answer: "Barazza stainless sinks and mixers are made for working kitchens: thick gauge steel, quiet drains and cartridges that can be serviced rather than replaced.",
      },
    ],
  },
  {
    id: "wardrobe",
    label: "Wardrobe",
    hint: "Doors, drawers, interiors, lighting",
    problems: [
      {
        id: "doors-swing",
        label: "Doors need room to swing open",
        solution: "sliding-folding",
        queries: { quiet: "soft close sliding", heavy: "sliding 80 kg" },
        answer: "Sliding or folding running gear removes the swing entirely. Hawa systems run silently, take doors up to 80 kg and can be fitted without a bottom track.",
      },
      {
        id: "doors-sag",
        label: "Doors sag or do not line up",
        solution: "hinges",
        queries: { quiet: "soft close hinge", heavy: "wide angle hinge" },
        answer: "Concealed hinges with three-way adjustment let you line every door up and keep it there. Blum and Salice hinges are rated for 200,000 cycles.",
      },
      {
        id: "dark-inside",
        label: "Cannot see inside",
        solution: "lighting",
        queries: { small: "sensor light" },
        answer: "Integrated LED strips or spots that switch on when the door opens. Low profile, warm colour temperature, wired to a single driver.",
      },
      {
        id: "interior-mess",
        label: "The interior is a mess",
        solution: "kitchen-storage",
        queries: { small: "pull-out shelf", heavy: "trouser rack" },
        answer: "Pull-out trays, trouser racks and shoe pull-outs organise a wardrobe the way kitchen internals organise a cabinet, and they carry the weight.",
      },
      {
        id: "wardrobe-handles",
        label: "Want a cleaner front",
        solution: "opening-closing",
        queries: { handleless: "push to open", looks: "edge pull" },
        answer: "Push-to-open fittings or recessed edge pulls give a handleless front without a special door profile.",
      },
    ],
  },
  {
    id: "doors",
    label: "Interior doors",
    hint: "Handles, locks, closers, stops",
    problems: [
      {
        id: "door-handle",
        label: "Need handles for a whole house",
        solution: "door-window-handles",
        queries: { looks: "lever handle", budget: "lever handle" },
        answer: "Choose one lever family and specify it across every door, with matching window handles and bathroom turns. DND makes ranges deep enough to cover an entire house in one finish.",
      },
      {
        id: "door-slam",
        label: "Doors slam or drift open",
        solution: "opening-closing",
        queries: { quiet: "door closer", small: "concealed closer" },
        answer: "A concealed door closer or a magnetic stop settles the door where you leave it and closes it quietly when you do not.",
      },
      {
        id: "door-lock",
        label: "Locks or latches are unreliable",
        solution: "opening-closing",
        queries: { quiet: "magnetic latch" },
        answer: "Magnetic latches and quality mortice locks stop the rattle and the sticking. We can match them to your existing handle rose.",
      },
      {
        id: "pocket-door",
        label: "No room for a door to swing",
        solution: "sliding-folding",
        queries: { heavy: "sliding door 120 kg", quiet: "soft close sliding" },
        answer: "A sliding or pocket door running on a concealed track. Hawa gear carries timber and glass doors and can be retrofitted to an existing opening.",
      },
    ],
  },
  {
    id: "bathroom",
    label: "Bathroom",
    hint: "Vanities, mirrors, wet-area hardware",
    problems: [
      {
        id: "vanity-drawers",
        label: "Vanity drawers around the plumbing",
        solution: "drawer-systems",
        queries: { small: "u-shaped drawer" },
        answer: "U-shaped drawer boxes fit around the waste and still run on full-extension runners, so the space under the basin is not lost.",
      },
      {
        id: "humidity",
        label: "Hardware rusts or corrodes",
        solution: "hinges",
        queries: { looks: "stainless hinge" },
        answer: "Specify nickel-plated or stainless hinges and runners rated for humid rooms. Blum has wet-area ranges built for this.",
      },
      {
        id: "bathroom-handles",
        label: "Want matching handles and turns",
        solution: "door-window-handles",
        queries: { looks: "bathroom turn" },
        answer: "Lever handles with a matching privacy turn and release, in the same PVD finish as the rest of the house.",
      },
      {
        id: "mirror-cabinet",
        label: "Mirror cabinet door hits the light",
        solution: "lift-systems",
        queries: { small: "compact lift" },
        answer: "A small lift-up fitting lets the mirror door open upward and stop clear of anything above it.",
      },
    ],
  },
];

export function catalogueHref(problem: Problem, constraint: Constraint | null): string {
  const params = new URLSearchParams();
  params.set("solution", problem.solution);
  const query = constraint ? problem.queries?.[constraint] : undefined;
  if (query) params.set("q", query);
  return `/catalog?${params.toString()}`;
}
