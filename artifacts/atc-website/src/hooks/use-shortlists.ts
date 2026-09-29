import { useSyncExternalStore } from "react";
import {
  STORAGE_KEY,
  addItem as addItemTo,
  createList as createListIn,
  deleteList as deleteListFrom,
  emptyState,
  normaliseState,
  removeItem as removeItemFrom,
  renameList as renameListIn,
  setActiveList as setActiveListIn,
  setQuantity as setQuantityIn,
  totalReferences,
  type ListNameError,
  type NewItem,
  type Shortlist,
  type ShortlistState,
} from "@/lib/shortlists";

/**
 * One store for the whole app, so the navbar count, the product page control and the lists page
 * all see the same lists. Persisted under `atc-store` on this device only; private mode or a full
 * quota keeps the state in memory for the visit.
 */
function read(): ShortlistState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return normaliseState(raw ? JSON.parse(raw) : null);
  } catch {
    return emptyState();
  }
}

let state: ShortlistState = read();
const listeners = new Set<() => void>();

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* private mode or quota: the lists still work for this visit */
  }
}

// Whatever was found on disk has been merged with the defaults; write that back so the stored
// shape is always the current one.
persist();

function commit(next: ShortlistState) {
  if (next === state) return;
  state = next;
  persist();
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  state = read();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => state;

export const getShortlistSnapshot = getSnapshot;

export const shortlistActions = {
  createList(name: string): { list?: Shortlist; error?: ListNameError } {
    const result = createListIn(state, name);
    commit(result.state);
    return { list: result.list, error: result.error };
  },
  renameList: (id: string, name: string) => commit(renameListIn(state, id, name)),
  deleteList: (id: string) => commit(deleteListFrom(state, id)),
  setActiveList: (id: string) => commit(setActiveListIn(state, id)),
  addItem: (listId: string, item: NewItem) => commit(addItemTo(state, listId, item)),
  setQuantity: (listId: string, key: string, quantity: unknown) => commit(setQuantityIn(state, listId, key, quantity)),
  removeItem: (listId: string, key: string) => commit(removeItemFrom(state, listId, key)),
  replaceState: (next: ShortlistState) => commit(normaliseState(next)),
};

export function useShortlists() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const activeList = current.lists.find((list) => list.id === current.activeListId) ?? current.lists[0]!;
  return { lists: current.lists, activeList, activeListId: activeList.id, ...shortlistActions };
}

const getCount = () => totalReferences(state);

/** Number of saved references across every list; drives the navbar count. */
export function useShortlistCount(): number {
  return useSyncExternalStore(subscribe, getCount, getCount);
}
