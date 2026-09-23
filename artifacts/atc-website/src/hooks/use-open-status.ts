import { useEffect, useState } from "react";
import { openStatus, type OpenStatus } from "@/lib/opening-hours";

/** Re-evaluates the opening status each minute so the label stays truthful on a long-open tab. */
export function useOpenStatus(hours: string): OpenStatus | null {
  const [status, setStatus] = useState(() => openStatus(hours));
  useEffect(() => {
    setStatus(openStatus(hours));
    const timer = window.setInterval(() => setStatus(openStatus(hours)), 60_000);
    return () => window.clearInterval(timer);
  }, [hours]);
  return status;
}

const formatAmman = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Amman", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());

/** The current wall-clock time in Amman as "14:32", refreshed every fifteen seconds. */
export function useAmmanTime(): string {
  const [time, setTime] = useState(formatAmman);
  useEffect(() => {
    setTime(formatAmman());
    const timer = window.setInterval(() => setTime(formatAmman()), 15_000);
    return () => window.clearInterval(timer);
  }, []);
  return time;
}
