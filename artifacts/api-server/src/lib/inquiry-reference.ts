import { randomInt } from "node:crypto";

/** Letters and digits that cannot be misread over the phone: no 0/O or 1/I. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const INQUIRY_REFERENCE_PATTERN = /^ATC-\d{6}-[A-HJ-NP-Z2-9]{4}$/;

/**
 * The reference a visitor quotes back to ATC: `ATC-YYMMDD-XXXX`. The date is Amman's, the code
 * is four random characters, which gives about a million distinct references a day; the column
 * is unique and the route retries on the rare collision.
 */
export function inquiryReference(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Amman", year: "2-digit", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const ymd = `${part("year")}${part("month")}${part("day")}`;
  let code = "";
  for (let i = 0; i < 4; i += 1) code += ALPHABET[randomInt(ALPHABET.length)];
  return `ATC-${ymd}-${code}`;
}
