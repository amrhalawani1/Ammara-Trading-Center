/**
 * ATC's catalogue is organised by solution, not by manufacturer taxonomy.
 * Product `category` values are exactly these names; order here is display order.
 */
export interface Solution {
  slug: string;
  name: string;
  line: string;
}

export const SOLUTIONS: Solution[] = [
  { slug: "door-window-handles", name: "Door & window handles", line: "Levers, pulls and knobs for interior doors, entrances and windows." },
  { slug: "cabinet-handles", name: "Cabinet handles", line: "Pulls and knobs that set the tone of a kitchen or wardrobe." },
  { slug: "hinges", name: "Hinges", line: "Concealed hinges that close quietly and stay adjusted." },
  { slug: "drawer-systems", name: "Drawer systems", line: "Box systems and runners for drawers that carry weight every day." },
  { slug: "lift-systems", name: "Lift systems", line: "Flap and lift-up fittings for wall cabinets within easy reach." },
  { slug: "opening-closing", name: "Opening & closing", line: "Handle-free opening, locking systems, door stops and the hardware that closes a door." },
  { slug: "sliding-folding", name: "Sliding & folding doors", line: "Running gear for wardrobes and cabinets that open without swing space." },
  { slug: "kitchen-storage", name: "Kitchen storage", line: "Pull-outs and inner organisation that put every item in reach." },
  { slug: "lighting", name: "Lighting", line: "Integrated LED light for shelves, worktops and cabinet interiors." },
  { slug: "sinks-taps", name: "Sinks & taps", line: "Stainless steel sinks and mixers built for a working kitchen." },
  { slug: "cooking-appliances", name: "Cooking & appliances", line: "Hobs and built-in appliances with the same design discipline." },
];

export const solutionBySlug = (slug: string | null | undefined) => SOLUTIONS.find((s) => s.slug === slug);
export const solutionByName = (name: string | null | undefined) => SOLUTIONS.find((s) => s.name === name);

/** Order categories by the solution list; unknown categories fall to the end alphabetically. */
export function sortCategories(names: string[]): string[] {
  const index = (name: string) => {
    const i = SOLUTIONS.findIndex((s) => s.name === name);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...names].sort((a, b) => index(a) - index(b) || a.localeCompare(b));
}
