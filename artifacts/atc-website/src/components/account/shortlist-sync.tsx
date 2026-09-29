import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/react";
import { putAccountShortlists, type AccountShortlistState } from "@workspace/api-client-react";
import { getShortlistSnapshot, shortlistActions, useShortlists } from "@/hooks/use-shortlists";
import { normaliseState, type ShortlistState } from "@/lib/shortlists";

const toAccountState = (state: ShortlistState): AccountShortlistState => ({
  version: 1,
  activeListId: state.activeListId,
  lists: state.lists.map((list) => ({
    id: list.id,
    name: list.name,
    createdAt: list.createdAt,
    items: list.items.map((item) => ({
      ...item,
      variant: item.variant,
      image: item.image,
      kind: item.kind ?? "product",
    })),
  })),
});

/**
 * When a trade user signs in, merge this device's lists into the account, then
 * push later edits. Sign-out leaves the last copy on the device.
 */
export function ShortlistSync() {
  const { isLoaded, isSignedIn } = useAuth();
  const current = useShortlists();
  const merged = useRef(false);
  const lastSent = useRef("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      merged.current = false;
      return;
    }
    let cancelled = false;
    const local = getShortlistSnapshot();
    void putAccountShortlists({ state: toAccountState(local), merge: true })
      .then((result) => {
        if (cancelled) return;
        shortlistActions.replaceState(normaliseState(result));
        lastSent.current = JSON.stringify(result);
        merged.current = true;
      })
      .catch(() => {
        /* keep working from the device copy */
      });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (!merged.current || !isSignedIn) return;
    const payload = JSON.stringify(toAccountState({ version: 1, lists: current.lists, activeListId: current.activeListId }));
    if (payload === lastSent.current) return;
    const timer = window.setTimeout(() => {
      void putAccountShortlists({ state: JSON.parse(payload) as AccountShortlistState, merge: false })
        .then((result) => {
          lastSent.current = JSON.stringify(result);
        })
        .catch(() => {
          /* retry on the next mutation */
        });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [current.lists, current.activeListId, isSignedIn]);

  return null;
}
