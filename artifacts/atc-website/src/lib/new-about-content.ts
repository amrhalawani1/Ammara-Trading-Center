/**
 * Content for /new-about, the restructured About page. Its order follows the research rather than
 * a chronology: what ATC is, how a visit works, who it serves, what exclusivity means, then the
 * history as a supporting footnote, the references, the principles and the paperwork.
 *
 * Sources: Notion discovery (questionnaire, predesign interview, core values) and UX Research
 * Vol. 01 (personas Fadi, Rana, Yousef and Hala; the About IA). Nothing here names a client that
 * has not cleared publication, and no date is used that the codebase does not already carry.
 */

import { company } from "@/lib/content";

export const NEW_ABOUT_HERO = {
  kicker: "About Amara Trading Center",
  headline: "We supply the solution. The hardware comes with it.",
  intro: `A family business in Amman, and the exclusive agent in Jordan for about ${company.partnerBrands} European makers of kitchen systems, furniture fittings and door hardware.`,
  /** Legacy as a trust marker, not a headline (discovery, brand Q2). */
  markers: [`Est. ${company.established}`, "Third generation", "Two showrooms in Amman"],
} as const;

/** The showroom ritual from discovery (needs Q3): unguided first, then a consultant. A real sequence. */
export const VISIT_STEPS = [
  { title: "Bring what you have", body: "A room, a drawing, a photo on your phone or a competitor's item code. You do not need to know the product name." },
  { title: "Look around first", body: "The first few minutes are yours. Every system on display is installed and working, so you can open it, load it and close it." },
  { title: "Talk it through", body: "A consultant who has fitted what they sell narrows it down to the right fitting, finish and size for the job." },
  { title: "Leave knowing what to order", body: "Item numbers, finishes and drawings, checked against the manufacturer's current sheet. Fitters can come back for free training." },
] as const;

/** A page link, or a WhatsApp chat opened with a prefilled message. */
export type AudienceAction = { label: string; href: string } | { label: string; whatsapp: string };

export interface Audience {
  id: "fabricators" | "specifiers" | "procurement" | "homeowners";
  who: string;
  promise: string;
  body: string;
  action: AudienceAction;
}

/** The four personas as entry points (competitive review: Hettich's audience-first routing). */
export const AUDIENCES: Audience[] = [
  {
    id: "fabricators",
    who: "Kitchen makers and joiners",
    promise: "The exact part, without the wait.",
    body: "Stock held in Amman, item numbers you can reorder by, and a trade showroom at Al-Wehdat that opens at 8 am.",
    action: { label: "Ask on WhatsApp", whatsapp: "Hello ATC, I run a workshop and need to confirm a part." },
  },
  {
    id: "specifiers",
    who: "Architects and interior designers",
    promise: "Material you can put in front of a client.",
    body: "Drawings, data sheets and finish samples for your specification, and a consultant at the mock-up before the joinery is cut.",
    action: { label: "Browse brands", href: "/brands" },
  },
  {
    id: "procurement",
    who: "Hotels and institutions",
    promise: "One accountable supplier for the whole project.",
    body: `About ${company.partnerBrands} brands through one agent, and the same item number still available when the building is refurbished years later.`,
    action: { label: "Send a trade enquiry", href: "/contact" },
  },
  {
    id: "homeowners",
    who: "Homeowners",
    promise: "No trade terms needed.",
    body: "Bring a photo of the room and tell us what bothers you. We will show you what fits, working, before you decide.",
    action: { label: "Book a showroom visit", href: "/showroom" },
  },
];

/** What "exclusive agent" means for the person ordering (business core value 01). */
export const EXCLUSIVITY_POINTS = [
  { title: "The current item number", body: "What you order is what the manufacturer publishes today, checked against the current sheet." },
  { title: "The factory warranty", body: "Bought through the exclusive agent, every order carries the manufacturer's own warranty." },
  { title: "Stock in Amman", body: "Held here, so a project does not wait on a container." },
] as const;

/**
 * History as a footnote (legacy is "infrastructure, not a marketing hook"). Only dates the site
 * already states are used: the 1977 counter, Al-Bayader opening in 2011, the 2016 Häfele
 * authorisation on the showroom wall.
 */
export const MILESTONES = [
  { when: String(company.established), title: "A counter on Building Materials Street", body: "Ahmad Amara sells hinges by the box to the carpenters on the same road. It is still the Al-Wehdat address." },
  { when: "The agencies", title: "Exclusive agent in Jordan", body: "European manufacturers appoint ATC as their agent, chosen because their fittings still work after twenty years of daily use." },
  { when: "2011", title: "Al-Bayader opens", body: "Full kitchens and real doors, built so architects could use a system before specifying it." },
  { when: "2016", title: "Häfele authorisation", body: "One of the certificates on record. It hangs in the showroom corridor." },
  { when: "Today", title: "The third generation", body: "Around four orders in five come from the trade. Homeowners get the same consultant." },
  { when: "Next", title: "The rest of Jordan", body: "Every item, number and drawing online before the visit, so a client anywhere in the country arrives with a decision made." },
] as const;

/** Business core values, written for the reader rather than the boardroom. */
export const PRINCIPLES = [
  { title: "A solution, not goods.", body: "Clients arrive with a problem. We find the fitting that solves it, then stand behind it." },
  { title: "Exclusive means accountable.", body: "One agent for every brand we carry: one relationship, and one place that answers for the order." },
  { title: "The relationship outlasts the order.", body: "Free training for fitters, and a consultant who still remembers the job years later." },
  { title: "Earned every year.", body: `Since ${company.established} is where it started, not a reason to trust us. Today's order is checked against today's sheet.` },
] as const;
