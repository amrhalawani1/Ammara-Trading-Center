import { getTradeSessionSnapshot, subscribeTradeSession } from "@/lib/trade-session";

export type InquiryStatus = "submitted" | "in_progress" | "responded";
export type InquiryKind = "general" | "shortlist" | "newsletter";

export interface LocalInquiry {
  id: string;
  reference: string;
  kind: InquiryKind;
  listName: string | null;
  message: string;
  createdAt: string;
  status: InquiryStatus;
}

export const INQUIRIES_KEY = "atc-trade-inquiries";

const EMPTY: LocalInquiry[] = [];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

function readAll(): Record<string, LocalInquiry[]> {
  try {
    const raw = window.localStorage.getItem(INQUIRIES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? (parsed as Record<string, LocalInquiry[]>) : {};
  } catch {
    return {};
  }
}

function writeAll(value: Record<string, LocalInquiry[]>): void {
  try {
    window.localStorage.setItem(INQUIRIES_KEY, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

let cache = readAll();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== INQUIRIES_KEY) return;
  cache = readAll();
  emit();
}

export function subscribeTradeInquiries(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function listLocalInquiries(email: string): LocalInquiry[] {
  return cache[email.trim().toLowerCase()] ?? EMPTY;
}

export function getInquirySnapshot(): LocalInquiry[] {
  const email = getTradeSessionSnapshot().email;
  return email ? listLocalInquiries(email) : EMPTY;
}

export function recordLocalInquiry(input: {
  email?: string;
  reference: string;
  kind: InquiryKind;
  listName?: string | null;
  message?: string;
}): LocalInquiry | null {
  const email = (input.email ?? getTradeSessionSnapshot().email ?? "").trim().toLowerCase();
  if (!email || !input.reference) return null;
  const row: LocalInquiry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    reference: input.reference,
    kind: input.kind,
    listName: input.listName ?? null,
    message: input.message ?? "",
    createdAt: new Date().toISOString(),
    status: "submitted",
  };
  const next = { ...cache, [email]: [row, ...(cache[email] ?? [])] };
  cache = next;
  writeAll(next);
  emit();
  return row;
}

export function subscribeInquiriesAndSession(listener: () => void): () => void {
  const a = subscribeTradeInquiries(listener);
  const b = subscribeTradeSession(listener);
  return () => {
    a();
    b();
  };
}
