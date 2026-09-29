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
  intro: "A family hardware business in Amman, told in five chapters.",
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
    title: "Ahmad Amara opens a hardware counter in Amman.",
    body: [
      "It began on Building Materials Street, selling hinges by the box to the carpenters who worked on the same road. The business has since passed through three generations of the family.",
      "The habit that started it has not changed: find the right fitting for the job in front of you, then stand behind it. Clients still arrive with a room, a drawing or a problem rather than a product name. We supply the solution; the hardware comes with it.",
    ],
    visual: "none",
  },
  {
    label: "The brands",
    title: "The exclusive agent in Jordan.",
    body: [
      "Blum, Barazza, Häfele, Hawa, Salice and more than 20 other European manufacturers, each represented exclusively in Jordan and each chosen because its fittings still work after twenty years of daily use.",
      "For a client, that means one accountable supplier across every brand. The item number you order is the one the manufacturer publishes, checked against the current sheet and held in stock in Amman.",
    ],
    visual: "marks",
  },
  {
    label: "The showroom",
    title: "Built so the product can be used, not only seen.",
    body: [
      "Every system on display is installed and working, at Al-Bayader and Al-Wehdat. A drawer takes weight, a hinge closes, a lever sits in the hand as it would at home.",
      "Walk in and the first few minutes are yours, to look around at your own pace. Then a consultant who has fitted what they sell is there to help, and stays with you until you know exactly what you need.",
    ],
    visual: "wide",
    image: { src: "/images/showroom-lounge.webp", alt: "The showroom lounge, looking through to the installed kitchens" },
  },
  {
    label: "Today",
    title: "Most of the day is trade. The rest gets the same consultant.",
    body: [
      "Kitchen manufacturers, carpenters, design houses and architects make up around four orders in five. Homeowners are the fifth, and nobody needs to know the trade terms to be helped.",
      "The same hardware is installed where it is used hardest: hotels in Amman, Aqaba, the Dead Sea and Petra, and state buildings in Amman.",
    ],
    visual: "references",
  },
  {
    label: "Next",
    title: "The rest of Jordan, without the drive to Amman.",
    body: [
      "Two showrooms serve the capital. The next step is the whole country: every item, number and drawing available online before the visit, so a client anywhere in Jordan arrives with a decision already made.",
      "What stays the same: free training for fitters on the systems we supply, and a consultant who remembers the job.",
    ],
    visual: "none",
  },
];

export interface Certification {
  /** Short mark shown large: the standard number or programme name. */
  mark: string;
  title: string;
  /** Who holds it: ATC itself, or the partner manufacturers. */
  holder: "ATC" | "Partner manufacturers";
  /** What the certificate covers, in one sentence. */
  scope: string;
  /** Issuing body, where known. */
  issuer?: string;
  /** Year granted or last renewed, where known. */
  year?: string;
  /** Link to the certificate document once ATC supplies it. */
  document?: string;
  /**
   * Only published certifications render. Anything ATC has not yet confirmed in writing stays
   * here as a placeholder with `published: false`, so nothing is claimed on the site without a source.
   */
  published: boolean;
}

/**
 * Certifications on record. Sourced from the Company Profile via the IA content requirements:
 * partner manufacturers hold ISO 9001 and ISO 14001; ATC runs certified training for partner
 * technical teams. ATC's own management-system certificates are pending confirmation.
 */
export const CERTIFICATIONS: Certification[] = [
  {
    mark: "ISO 9001",
    title: "Quality management systems",
    holder: "Partner manufacturers",
    scope: "The factories that make the hinges, runners and lift systems ATC stocks are certified to ISO 9001, so every item number ships to the same specification as the sample on the floor.",
    published: true,
  },
  {
    mark: "ISO 14001",
    title: "Environmental management systems",
    holder: "Partner manufacturers",
    scope: "Manufacturing sites are certified for environmental management: controlled materials, waste and energy across the production of the fittings ATC represents.",
    published: true,
  },
  {
    mark: "Certified training",
    title: "Manufacturer-certified technical training",
    holder: "ATC",
    scope: "ATC's consultants, and the technical teams of its trade clients, are trained on the manufacturers' own programmes for the systems they fit. The training is free to fitters.",
    published: true,
  },
  {
    mark: "Exclusive agency",
    title: "Exclusive agent in Jordan",
    holder: "ATC",
    scope: "Appointed by each manufacturer as its exclusive agent in Jordan, which is why the item number ordered is the one the manufacturer publishes, with the factory warranty behind it.",
    published: true,
  },
  {
    mark: "ISO 9001",
    title: "ATC quality management system",
    holder: "ATC",
    scope: "ATC's own quality management certificate. Shown once the certificate number and issuing body are confirmed.",
    published: false,
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
    body: "Hotels in these four destinations are fitted with hardware supplied through ATC.",
    cleared: true,
  },
];
