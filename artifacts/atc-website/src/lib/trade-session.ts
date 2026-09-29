/**
 * Frontend-only trade session. Used when Clerk is unset so the full account
 * journey can be walked on this device. Passwords are never stored.
 */

export type TradeRole = "specifier" | "procurement" | "fabricator" | "other";

export const TRADE_ROLES: { value: TradeRole; label: string }[] = [
  { value: "specifier", label: "Design specifier" },
  { value: "procurement", label: "Procurement" },
  { value: "fabricator", label: "Workshop / fabricator" },
  { value: "other", label: "Other" },
];

export const roleLabel = (role: TradeRole | "" | null | undefined): string =>
  TRADE_ROLES.find((item) => item.value === role)?.label ?? "Not set";

export interface TradeProfile {
  email: string;
  name: string;
  company: string;
  role: TradeRole | "";
}

export interface TradeSessionSnapshot {
  email: string | null;
  profile: TradeProfile | null;
  welcome: boolean;
}

export const SESSION_KEY = "atc-trade-session";
export const PROFILE_KEY = "atc-trade-profile";

const emptyProfile = (email: string, name = ""): TradeProfile => ({
  email,
  name,
  company: "",
  role: "",
});

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

function readJson(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode or quota */
  }
}

function parseRole(value: unknown): TradeRole | "" {
  return value === "specifier" || value === "procurement" || value === "fabricator" || value === "other" ? value : "";
}

export function parseProfile(raw: unknown): TradeProfile | null {
  if (!isRecord(raw) || typeof raw.email !== "string" || !raw.email) return null;
  return {
    email: raw.email.trim().toLowerCase(),
    name: typeof raw.name === "string" ? raw.name : "",
    company: typeof raw.company === "string" ? raw.company : "",
    role: parseRole(raw.role),
  };
}

function parseSession(raw: unknown): { email: string; welcome: boolean } | null {
  if (typeof raw === "string" && raw.includes("@")) return { email: raw.trim().toLowerCase(), welcome: false };
  if (!isRecord(raw) || typeof raw.email !== "string") return null;
  const email = raw.email.trim().toLowerCase();
  if (!email) return null;
  return { email, welcome: raw.welcome === true };
}

function read(): TradeSessionSnapshot {
  const session = parseSession(readJson(SESSION_KEY));
  const stored = parseProfile(readJson(PROFILE_KEY));
  if (!session) return { email: null, profile: stored, welcome: false };
  return {
    email: session.email,
    profile: stored?.email === session.email ? stored : emptyProfile(session.email),
    welcome: session.welcome,
  };
}

let snapshot: TradeSessionSnapshot = read();
const listeners = new Set<() => void>();

function persist(next: TradeSessionSnapshot) {
  snapshot = next;
  if (next.email) writeJson(SESSION_KEY, { email: next.email, welcome: next.welcome });
  else {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* private mode */
    }
  }
  if (next.profile) writeJson(PROFILE_KEY, next.profile);
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== SESSION_KEY && event.key !== PROFILE_KEY) return;
  snapshot = read();
  listeners.forEach((listener) => listener());
}

export function subscribeTradeSession(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export const getTradeSessionSnapshot = (): TradeSessionSnapshot => snapshot;

export function findTradeProfile(email: string): TradeProfile | null {
  const stored = parseProfile(readJson(PROFILE_KEY));
  const normalised = email.trim().toLowerCase();
  return stored?.email === normalised ? stored : null;
}

export function signInLocal(email: string): boolean {
  const profile = findTradeProfile(email);
  if (!profile) return false;
  persist({ email: profile.email, profile, welcome: false });
  return true;
}

export function signUpLocal(input: { email: string; name: string; company?: string; role?: TradeRole | "" }): boolean {
  const email = input.email.trim().toLowerCase();
  if (findTradeProfile(email)) return false;
  persist({
    email,
    welcome: true,
    profile: {
      email,
      name: input.name.trim(),
      company: input.company?.trim() ?? "",
      role: input.role ?? "",
    },
  });
  return true;
}

export function signOutLocal(): void {
  persist({ email: null, profile: snapshot.profile, welcome: false });
}

export function saveTradeProfile(profile: TradeProfile): void {
  const email = profile.email.trim().toLowerCase();
  persist({
    email: snapshot.email ?? email,
    welcome: snapshot.welcome,
    profile: { ...profile, email, name: profile.name.trim(), company: profile.company.trim() },
  });
}

export function clearWelcome(): void {
  if (!snapshot.email) return;
  persist({ ...snapshot, welcome: false });
}
