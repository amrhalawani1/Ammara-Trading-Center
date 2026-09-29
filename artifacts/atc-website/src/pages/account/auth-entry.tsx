import { useEffect } from "react";
import { Redirect, useLocation } from "wouter";
import { authDialogLanding, openAuth, type AuthView } from "@/lib/auth-dialog";
import { readNextParam } from "@/lib/account-return";

function viewFromPath(path: string): AuthView {
  if (path.startsWith("/account/sign-up")) return "sign-up";
  if (path.startsWith("/account/forgot")) return "forgot";
  if (path.startsWith("/account/reset")) return "reset";
  return "sign-in";
}

/** Bookmarked auth URLs open the popup on a real page instead of a dedicated screen. */
export default function AccountAuthEntryPage() {
  const [location] = useLocation();
  const next = readNextParam();
  const email =
    typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("email") ?? "";
  const view = viewFromPath(location);

  useEffect(() => {
    openAuth(view, { next, email });
  }, [view, next, email]);

  return <Redirect to={authDialogLanding(next)} />;
}
