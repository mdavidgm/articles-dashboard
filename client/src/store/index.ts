import { create } from 'zustand';
import { createHighlightsSlice } from './slices/highlightsSlice';
import { devtools } from 'zustand/middleware';
import type { AppState } from './types';

export const useAppStore = create<AppState>()(
  devtools(
    (set, get, store) => ({
      ...createHighlightsSlice(set, get, store),
      resetAllSlices: () => {
        get().resetHighlights();
      },
    }),
    { name: 'DashboardApp' }
  )
);
