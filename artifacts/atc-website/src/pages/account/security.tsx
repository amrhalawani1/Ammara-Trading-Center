import { Redirect } from "wouter";

/** Older links to the security tab land on settings, where the password now lives. */
export default function AccountSecurityPage() {
  return <Redirect to="/account/settings" />;
}
