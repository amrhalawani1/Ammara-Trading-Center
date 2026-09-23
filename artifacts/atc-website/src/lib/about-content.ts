/**
 * The About page as a story, drawn from the discovery questionnaire and the pre-design interview
 * (Notion, "Discovery Phase"). Every chapter states something the client said; nothing is
 * invented to fill a gap in the timeline, which is why chapters carry labels rather than dates
 * after 1977.
 *
 * Voice from discovery: quiet authority. Restrained and declarative, no superlatives, no
 * exclamation marks. Legacy is a trust marker in support of the sale, not the whole story, so the
 * founding is one chapter of five and the last chapter looks forward.
 */

export const STORY_HERO = {
  kicker: "The story of Amara Trading Center",
  headline: "Three generations of the same answer.",
  intro: "A family hardware business in Amman, in five chapters. Four minutes to read; less to see in person.",
} as const;

export type ChapterVisual = "photo" | "marks" | "wide" | "references" | "none";

export interface Chapter {
  /** Short label for the index: a year where one is known, otherwise the subject. */
  label: string;
  title: string;
  body: string[];
  visual: ChapterVisual;
  image?: { src: string; alt: string };
}

export const CHAPTERS: Chapter[] = [
  {
    label: "1977",
    title: "Ahmad Amara opens a hardware trade in Amman.",
    body: [
      "The habit that started the business has not changed since: find the right fitting for the job in front of you, then stand behind it.",
      "Clients still arrive with a room, a drawing or a fault rather than a product name. The answer is the job; the hardware comes with it.",
    ],
    visual: "photo",
    image: { src: "/images/trade-workshop.webp", alt: "A drawing and a brass fitting on the workshop desk" },
  },
  {
    label: "The names",
    title: "The company becomes the exclusive agent in Jordan for Europe's hardware manufacturers.",
    body: [
      "Blum, Barazza, Häfele, Hettich, Salice and the others. Each represented exclusively in Jordan, each chosen because its fittings are still working after twenty years in a kitchen.",
      "Being the sole agent means the item number you order is the one the manufacturer publishes, confirmed against the current sheet and held in stock in Amman.",
    ],
    visual: "marks",
  },
  {
    label: "The floor",
    title: "A showroom built so the product can be used, not only seen.",
    body: [
      "Every system on the floor is installed and working. A drawer takes weight, a hinge closes, a lever sits in the hand as it would at home.",
      "Walk in and we leave you alone for the first five minutes. Then a consultant who has fitted what they sell steps in, and stays until the order is written.",
    ],
    visual: "wide",
    image: { src: "/images/showroom-wide.webp", alt: "The Al-Bayader showroom floor" },
  },
  {
    label: "Today",
    title: "Most of the day is trade. The rest gets the same consultant.",
    body: [
      "Kitchen manufacturers, carpenters, design houses and architects make up around four orders in five. Homeowners are the fifth, served from the same sheet.",
      "The hardware is installed where it is inspected: a royal court in Amman, and most of the hotels in Amman, Aqaba, the Dead Sea and Petra.",
    ],
    visual: "references",
  },
  {
    label: "Next",
    title: "The rest of Jordan, without the drive to Amman.",
    body: [
      "Two showrooms serve the capital. The next step is the whole country: every item, number and drawing available online before the visit, so a client anywhere in Jordan arrives with a decision already made.",
      "Free training for fitters, adjustment on site and a consultant who remembers the job stay exactly as they are.",
    ],
    visual: "none",
  },
];

export interface Reference {
  sector: string;
  /** The name as the client gave it in discovery. Shown only once `cleared` is true. */
  name: string;
  /** What is shown until the client confirms the name may be published. */
  unclearedName: string;
  body: string;
  cleared: boolean;
}

/**
 * References named by the client in discovery. Publishing a client's name needs their consent,
 * so each stays behind `cleared: false` until ATC confirms it in writing.
 */
export const REFERENCES: Reference[] = [
  {
    sector: "State",
    name: "The Royal Hashemite Court",
    unclearedName: "A royal court in Amman",
    body: "Hardware supplied to the court's buildings, specified and held to the same sheet as any other order.",
    cleared: false,
  },
  {
    sector: "Hospitality",
    name: "Hotels in Amman, Aqaba, the Dead Sea and Petra",
    unclearedName: "Hotels in Amman, Aqaba, the Dead Sea and Petra",
    body: "Most of the hotels in these four destinations are fitted with hardware supplied through ATC.",
    cleared: true,
  },
];
