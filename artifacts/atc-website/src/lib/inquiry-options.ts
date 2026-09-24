/** Option lists shared by the product configurator and the shortlist enquiry form. */
export const PROJECT_TYPES = ["Residential", "Hospitality", "Commercial", "Institutional"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const TIMINGS = ["Within a month", "1 to 3 months", "3 to 12 months", "Still planning"] as const;
export type Timing = (typeof TIMINGS)[number];
