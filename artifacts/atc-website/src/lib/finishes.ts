/**
 * Finish helpers. The catalogue stores finishes as plain names ("Satin Nickel"),
 * so the swatch tone and the short reference code are derived from the name.
 * Tones are deliberately warm and desaturated to sit inside the cream palette.
 */
const FINISH_TONES: Array<[RegExp, string]> = [
  [/black|onyx|obsidian|graphite|anthracite|terra/i, "#2B2422"],
  [/bronze/i, "#8A6A4E"],
  [/brass|gold/i, "#C3A46B"],
  [/copper|rose/i, "#B77A5B"],
  [/moka|brown|walnut/i, "#5B4437"],
  [/titanium|gunmetal/i, "#7E7A76"],
  [/nickel|chrome|silver|stainless|steel|aluminium|aluminum|zinc|inox|orion/i, "#B9B6B2"],
  [/white|cream|ivory/i, "#EFEAE3"],
  [/grey|gray/i, "#9A9491"],
];

const FALLBACK_TONES = ["#B9B6B2", "#8A6A4E", "#2B2422", "#C3A46B", "#9A9491", "#EFEAE3"];

export function finishTone(name: string, index = 0): string {
  const match = FINISH_TONES.find(([pattern]) => pattern.test(name));
  return match ? match[1] : FALLBACK_TONES[index % FALLBACK_TONES.length];
}

/** "Matt sandblasted bronze" -> "MSB"; keeps known acronyms such as PVD intact. */
export function finishCode(name: string): string {
  const words = name.replace(/[()]/g, " ").split(/[\s/-]+/).filter(Boolean);
  const acronym = words.find((word) => /^[A-Z]{2,4}$/.test(word));
  const initials = words.map((word) => word[0]!.toUpperCase()).join("").slice(0, 3);
  return acronym ? `${acronym}${initials.length > 1 ? `-${initials.replace(acronym[0]!, "").slice(0, 2)}` : ""}`.replace(/-$/, "") : initials;
}

/** Light tones need a dark ring so the swatch still reads on a cream canvas. */
export function isLightTone(hex: string): boolean {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 200;
}

/**
 * Colour families for filtering. Brands name finishes precisely ("Antique satin gold",
 * "Matt sandblasted bronze"), which is right on a product page but useless as a filter, so the
 * catalogue groups them into the families a specifier actually chooses between. Order matters:
 * the first match wins, so "Matt black stainless steel" is Black, not Steel.
 */
const FINISH_FAMILIES: Array<{ label: string; tone: string; pattern: RegExp }> = [
  { label: "Black", tone: "#2B2422", pattern: /black|anthracite|graphite|onyx|obsidian/i },
  { label: "White", tone: "#EFEAE3", pattern: /white|ivory|cream/i },
  { label: "Bronze", tone: "#8A6A4E", pattern: /bronze/i },
  // Dnd's bare "Polished" and "Satin" are brass finishes (OLV, OS) on the Master series.
  { label: "Gold & brass", tone: "#C3A46B", pattern: /gold|brass|champagne|^polished$|^satin$/i },
  { label: "Copper", tone: "#B77A5B", pattern: /copper|rose gold/i },
  { label: "Chrome & nickel", tone: "#B9B6B2", pattern: /chrome|nickel/i },
  { label: "Steel & aluminium", tone: "#A7A39E", pattern: /steel|stainless|inox|aluminium|aluminum|silver|titanium|zinc/i },
  { label: "Colour", tone: "#7C8C9A", pattern: /blue|green|turquoise|violet|olive|yellow|red|pink|orange|dove/i },
];

export function finishFamily(name: string): { label: string; tone: string } | null {
  // "Black + white glossy porcelain" is chosen by its metal, the part before the insert.
  const base = name.split("+")[0]!.trim();
  const family = FINISH_FAMILIES.find(({ pattern }) => pattern.test(base));
  return family ? { label: family.label, tone: family.tone } : null;
}

export const FINISH_FAMILY_ORDER = FINISH_FAMILIES.map((family) => family.label);

export const finishFamilyTone = (label: string) => FINISH_FAMILIES.find((family) => family.label === label)?.tone;
