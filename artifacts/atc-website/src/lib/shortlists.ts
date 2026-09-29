/**
 * Shortlists: the visitor's own saved products, kept on their device. Everything
 * here is pure so the store stays thin and the rules (names, quantities, the default list) can be
 * read in one place.
 */

export const STORAGE_KEY = "atc-store";
export const DEFAULT_LIST_NAME = "My shortlist";
export const UNTITLED_LIST_NAME = "Untitled shortlist";
/**
 * Names the defaults had before. Lists stored on a device may still carry them; they are renamed on load.
 */
const LEGACY_DEFAULT_LIST_NAME = "New project shortlist";
const LEGACY_UNTITLED_LIST_NAME = "Untitled project";
export const LIST_NAME_MAX = 80;
export const QUANTITY_MAX = 9999;

export type SavedItemKind = "product" | "brand";

export interface ShortlistItem {
  /** Product slug, or `slug::variantCode` when a finish or size was chosen. */
  key: string;
  slug: string;
  name: string;
  brandName: string;
  /** Item number as shown on the product page at the time it was added. */
  reference: string;
  /** Variant label such as "F7 - Satin chrome", or null for the standard item. */
  variant: string | null;
  image: string | null;
  quantity: number;
  addedAt: string;
  kind?: SavedItemKind;
}

export const savedItemHref = (item: Pick<ShortlistItem, "slug" | "kind">): string =>
  item.kind === "brand" ? `/brands/${item.slug}` : `/products/${item.slug}`;

export interface Shortlist {
  id: string;
  name: string;
  createdAt: string;
  items: ShortlistItem[];
}

export interface ShortlistState {
  version: 1;
  lists: Shortlist[];
  activeListId: string;
}

export type NewItem = Omit<ShortlistItem, "quantity" | "addedAt">;
export type ListNameError = "blank" | "duplicate";

/** `crypto.randomUUID` needs a secure context; plain-http previews fall back to a timestamp id. */
export function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const normaliseName = (name: string): string => name.trim().slice(0, LIST_NAME_MAX);

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function findDuplicate(lists: Shortlist[], name: string, exceptId?: string): Shortlist | undefined {
  return lists.find((list) => list.id !== exceptId && sameName(list.name, name));
}

export function clampQuantity(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, QUANTITY_MAX);
}

function newList(name: string, now: string): Shortlist {
  return { id: newId(), name, createdAt: now, items: [] };
}

export function emptyState(now: string = new Date().toISOString()): ShortlistState {
  const list = newList(DEFAULT_LIST_NAME, now);
  return { version: 1, lists: [list], activeListId: list.id };
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const str = (value: unknown): string | null => (typeof value === "string" ? value : null);

function normaliseItem(raw: unknown): ShortlistItem | null {
  if (!isRecord(raw)) return null;
  const slug = str(raw.slug);
  const name = str(raw.name);
  const brandName = str(raw.brandName);
  if (!slug || !name || !brandName) return null;
  return {
    key: str(raw.key) ?? slug,
    slug,
    name,
    brandName,
    reference: str(raw.reference) ?? "",
    variant: str(raw.variant),
    image: str(raw.image),
    quantity: clampQuantity(raw.quantity),
    addedAt: str(raw.addedAt) ?? new Date(0).toISOString(),
    kind: raw.kind === "brand" ? "brand" : "product",
  };
}

/**
 * Whatever was persisted, merged with the defaults: junk is dropped, quantities clamped,
 * duplicate keys collapsed, and there is always at least one list with a valid active id.
 */
export function normaliseState(raw: unknown, now: string = new Date().toISOString()): ShortlistState {
  if (!isRecord(raw) || raw.version !== 1 || !Array.isArray(raw.lists)) return emptyState(now);
  const lists: Shortlist[] = [];
  for (const entry of raw.lists) {
    if (!isRecord(entry)) continue;
    const id = str(entry.id);
    if (!id || lists.some((list) => list.id === id)) continue;
    const seen = new Set<string>();
    const items: ShortlistItem[] = [];
    for (const rawItem of Array.isArray(entry.items) ? entry.items : []) {
      const item = normaliseItem(rawItem);
      if (!item || seen.has(item.key)) continue;
      seen.add(item.key);
      items.push(item);
    }
    lists.push({ id, name: normaliseName(str(entry.name) ?? "") || UNTITLED_LIST_NAME, createdAt: str(entry.createdAt) ?? now, items });
  }
  if (lists.length === 0) return emptyState(now);
  renameLegacyDefaults(lists);
  const activeListId = str(raw.activeListId);
  return { version: 1, lists, activeListId: lists.some((list) => list.id === activeListId) ? activeListId! : lists[0]!.id };
}

/** Old default names become the current ones, unless that would duplicate a name already in use. */
function renameLegacyDefaults(lists: Shortlist[]): void {
  const renames: [string, string][] = [
    [LEGACY_DEFAULT_LIST_NAME, DEFAULT_LIST_NAME],
    [LEGACY_UNTITLED_LIST_NAME, UNTITLED_LIST_NAME],
  ];
  for (const [from, to] of renames) {
    lists.forEach((list, index) => {
      if (!sameName(list.name, from) || findDuplicate(lists, to, list.id)) return;
      lists[index] = { ...list, name: to };
    });
  }
}


export function createList(state: ShortlistState, rawName: string, now: string = new Date().toISOString()): { state: ShortlistState; error?: ListNameError; list?: Shortlist } {
  const name = normaliseName(rawName);
  if (!name) return { state, error: "blank" };
  if (findDuplicate(state.lists, name)) return { state, error: "duplicate" };
  const list = newList(name, now);
  return { state: { ...state, lists: [...state.lists, list], activeListId: list.id }, list };
}

/** Blank becomes "Untitled shortlist"; a name another list already uses leaves this one unchanged. */
export function renameList(state: ShortlistState, id: string, rawName: string): ShortlistState {
  const name = normaliseName(rawName) || UNTITLED_LIST_NAME;
  if (findDuplicate(state.lists, name, id)) return state;
  return { ...state, lists: state.lists.map((list) => (list.id === id ? { ...list, name } : list)) };
}

/** Deleting the last list leaves a fresh default one, so there is always somewhere to add to. */
export function deleteList(state: ShortlistState, id: string, now: string = new Date().toISOString()): ShortlistState {
  const lists = state.lists.filter((list) => list.id !== id);
  if (lists.length === 0) return emptyState(now);
  return { version: 1, lists, activeListId: lists.some((list) => list.id === state.activeListId) ? state.activeListId : lists[0]!.id };
}

export function setActiveList(state: ShortlistState, id: string): ShortlistState {
  if (!state.lists.some((list) => list.id === id) || state.activeListId === id) return state;
  return { ...state, activeListId: id };
}

function updateList(state: ShortlistState, id: string, update: (list: Shortlist) => Shortlist): ShortlistState {
  return { ...state, lists: state.lists.map((list) => (list.id === id ? update(list) : list)) };
}

/** The same key in the same list adds one to the quantity instead of a second line. */
export function addItem(state: ShortlistState, listId: string, item: NewItem, now: string = new Date().toISOString()): ShortlistState {
  return updateList(state, listId, (list) => {
    const existing = list.items.find((line) => line.key === item.key);
    if (existing) {
      return { ...list, items: list.items.map((line) => (line.key === item.key ? { ...line, quantity: clampQuantity(line.quantity + 1) } : line)) };
    }
    return { ...list, items: [...list.items, { ...item, quantity: 1, addedAt: now }] };
  });
}

export function setQuantity(state: ShortlistState, listId: string, key: string, quantity: unknown): ShortlistState {
  const next = clampQuantity(quantity);
  return updateList(state, listId, (list) => ({ ...list, items: list.items.map((line) => (line.key === key ? { ...line, quantity: next } : line)) }));
}

export function removeItem(state: ShortlistState, listId: string, key: string): ShortlistState {
  return updateList(state, listId, (list) => ({ ...list, items: list.items.filter((line) => line.key !== key) }));
}

export const totalReferences = (state: ShortlistState): number => state.lists.reduce((sum, list) => sum + list.items.length, 0);

export const productCount = (n: number): string => `${n} ${n === 1 ? "product" : "products"}`;
