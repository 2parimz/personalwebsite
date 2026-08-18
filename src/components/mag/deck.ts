"use client";

import { createContext, useContext } from "react";

export type DeckState = {
  index: number;
  total: number;
  /** +1 forward, -1 back. Ignored while a turn is running. */
  go: (delta: number) => void;
  turning: boolean;
};

export const DeckContext = createContext<DeckState | null>(null);

export function useDeck() {
  return useContext(DeckContext);
}
