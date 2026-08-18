"use client";

import { createContext, useContext, type RefObject } from "react";

/**
 * The horizontal scroll container, shared so page transforms, the nav and
 * the progress rule can all read the same scroll position. Kept in its own
 * module so nothing has to import back into <HorizontalPages>.
 */
export const ScrollerContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useScroller() {
  return useContext(ScrollerContext);
}
