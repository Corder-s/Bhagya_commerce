"use client";

import * as React from "react";

/** No-op subscription: the value only changes once, when React hydrates. */
const subscribe = () => () => {};

/**
 * True after hydration.
 *
 * Use to defer client-only UI (portals, values read from `localStorage`) so the
 * server and first client render match. Built on `useSyncExternalStore` because
 * the "have we hydrated yet" question is exactly a store subscription, and an
 * effect that sets state would cause a cascading render on every mount.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
