/**
 * Reads the human hours strings in company.showrooms ("Sat - Thu, 9AM - 6PM") and answers
 * whether a showroom is open right now in Amman. Unparseable strings return null so the UI
 * simply shows the string.
 */
const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

interface Schedule {
  days: number[];
  open: number;
  close: number;
}

function parseTime(value: string): number | null {
  const m = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(value.trim());
  if (!m) return null;
  let hour = Number(m[1]) % 12;
  if (m[3]!.toUpperCase() === "PM") hour += 12;
  return hour * 60 + Number(m[2] ?? 0);
}

export function parseHours(hours: string): Schedule | null {
  const m = /^([A-Za-z]{3})\s*-\s*([A-Za-z]{3}),\s*(.+?)\s*-\s*(.+)$/.exec(hours.trim());
  if (!m) return null;
  const from = DAYS.indexOf(m[1]!.toLowerCase());
  const to = DAYS.indexOf(m[2]!.toLowerCase());
  const open = parseTime(m[3]!);
  const close = parseTime(m[4]!);
  if (from < 0 || to < 0 || open === null || close === null) return null;
  const days: number[] = [];
  for (let d = from; ; d = (d + 1) % 7) {
    days.push(d);
    if (d === to) break;
  }
  return { days, open, close };
}

export interface OpenStatus {
  open: boolean;
  /** "Open until 6PM" or "Closed, opens Sat 9AM". */
  label: string;
}

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  const mins = minutes % 60;
  return `${hour}${mins ? `:${String(mins).padStart(2, "0")}` : ""}${suffix}`;
};

export function openStatus(hours: string, now = new Date(), timeZone = "Asia/Amman"): OpenStatus | null {
  const schedule = parseHours(hours);
  if (!schedule) return null;
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const weekday = DAYS.indexOf((parts.find((p) => p.type === "weekday")?.value ?? "").toLowerCase().slice(0, 3));
  const minutes = Number(parts.find((p) => p.type === "hour")?.value ?? 0) * 60 + Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const openToday = schedule.days.includes(weekday);
  if (openToday && minutes >= schedule.open && minutes < schedule.close) {
    return { open: true, label: `Open until ${formatTime(schedule.close)}` };
  }
  // Next opening: today if before opening, otherwise the next scheduled day.
  let next = weekday;
  if (!(openToday && minutes < schedule.open)) {
    for (let i = 1; i <= 7; i += 1) {
      const d = (weekday + i) % 7;
      if (schedule.days.includes(d)) {
        next = d;
        break;
      }
    }
  }
  const dayLabel = next === weekday ? "today" : DAYS[next]!.replace(/^./, (c) => c.toUpperCase());
  return { open: false, label: `Closed, opens ${dayLabel} ${formatTime(schedule.open)}` };
}
