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

