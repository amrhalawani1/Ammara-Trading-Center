import type { TradeShortlist, TradeShortlistItem, TradeShortlistState } from "@workspace/db";

/** The website's default list name. The legacy name is still accepted from devices that stored it. */
export const DEFAULT_LIST_NAME = "My shortlist";
const LEGACY_DEFAULT_LIST_NAMES = ["New project shortlist"];

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

const clampQuantity = (value: number): number => {
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(Math.floor(value), 9999);
};

const isEmptyDefault = (list: TradeShortlist): boolean =>
  list.items.length === 0 && [DEFAULT_LIST_NAME, ...LEGACY_DEFAULT_LIST_NAMES].some((name) => sameName(list.name, name));

function mergeItems(local: TradeShortlistItem[], remote: TradeShortlistItem[]): TradeShortlistItem[] {
  const map = new Map<string, TradeShortlistItem>();
  for (const item of remote) map.set(item.key, item);
  for (const item of local) {
    const existing = map.get(item.key);
    if (!existing) {
      map.set(item.key, item);
      continue;
    }
    map.set(item.key, {
      ...existing,
      ...item,
      quantity: clampQuantity(existing.quantity + item.quantity),
      addedAt: existing.addedAt < item.addedAt ? existing.addedAt : item.addedAt,
    });
  }
  return [...map.values()];
}

/** Union lists by name and items by key. Used once, when a device first signs in. */
export function mergeShortlistStates(local: TradeShortlistState, remote: TradeShortlistState): TradeShortlistState {
  const localUseful = local.lists.filter((list) => !isEmptyDefault(list) || local.lists.length === 1);
  const remoteUseful = remote.lists.filter((list) => !isEmptyDefault(list) || remote.lists.length === 1);

  if (localUseful.every(isEmptyDefault) && remoteUseful.some((list) => !isEmptyDefault(list))) {
    return remote;
  }
  if (remoteUseful.every(isEmptyDefault) && localUseful.some((list) => !isEmptyDefault(list))) {
    return local;
  }

  const lists: TradeShortlist[] = [];
  const remoteByName = new Map(remoteUseful.map((list) => [list.name.trim().toLowerCase(), list]));
  const used = new Set<string>();

  for (const localList of localUseful) {
    const key = localList.name.trim().toLowerCase();
    const match = remoteByName.get(key);
    if (!match) {
      lists.push(localList);
      continue;
    }
    used.add(key);
    lists.push({
      id: match.id,
      name: match.name,
      createdAt: localList.createdAt < match.createdAt ? localList.createdAt : match.createdAt,
      items: mergeItems(localList.items, match.items),
    });
  }
  for (const remoteList of remoteUseful) {
    const key = remoteList.name.trim().toLowerCase();
    if (!used.has(key)) lists.push(remoteList);
  }

  if (lists.length === 0) return local;
  const activeListId = lists.some((list) => list.id === local.activeListId)
    ? local.activeListId
    : lists.some((list) => list.id === remote.activeListId)
      ? remote.activeListId
      : lists[0]!.id;
  return { version: 1, lists, activeListId };
}
