"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchStore {
  query: string;
  recentSearches: string[];
  isVisualSearchOpen: boolean;
  visualSearchResult: VisualSearchResult | null;

  setQuery: (q: string) => void;
  addRecentSearch: (term: string) => void;
  removeRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
  openVisualSearch: () => void;
  closeVisualSearch: () => void;
  setVisualSearchResult: (result: VisualSearchResult | null) => void;
}

export interface VisualSearchResult {
  detected_product: string;
  category: string;
  search_query: string;
  tags: string[];
  confidence: number;
  description: string;
}

export const TRENDING_SEARCHES = [
  "Briket kelapa premium",
  "Cocopeat organik",
  "VCO murni Aceh",
  "Tempurung ukir",
  "Arang aktif",
  "Sabut kelapa",
  "Kerajinan tempurung",
  "Minyak goreng kelapa",
];

export const POPULAR_SEARCHES = [
  "Briket kelapa",
  "Cocopeat",
  "Minyak VCO",
  "Tempurung kelapa",
  "Arang aktif",
  "Sabut kelapa",
];

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      query: "",
      recentSearches: [],
      isVisualSearchOpen: false,
      visualSearchResult: null,

      setQuery: (q) => set({ query: q }),

      addRecentSearch: (term) => {
        if (!term.trim()) return;
        set((state) => {
          const filtered = state.recentSearches.filter(
            (s) => s.toLowerCase() !== term.toLowerCase()
          );
          return {
            recentSearches: [term, ...filtered].slice(0, 8),
          };
        });
      },

      removeRecentSearch: (term) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== term),
        }));
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      openVisualSearch: () => set({ isVisualSearchOpen: true }),

      closeVisualSearch: () =>
        set({ isVisualSearchOpen: false, visualSearchResult: null }),

      setVisualSearchResult: (result) => set({ visualSearchResult: result }),
    }),
    {
      name: "nyiur-search",
      version: 1,
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
