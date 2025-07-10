import { create } from 'zustand';
import { createHighlightsSlice } from './slices/highlightsSlice';
import { createArticlesSlice } from './slices/articlesSlice';
import { devtools } from 'zustand/middleware';
import type { AppState } from './types';

export const useAppStore = create<AppState>()(
  devtools(
    (set, get, store) => ({
      ...createHighlightsSlice(set, get, store),
      ...createArticlesSlice(set, get, store),
      resetAllSlices: () => {
        get().resetHighlights();
        get().resetArticles();
      },
    }),
    { name: 'DashboardApp' }
  )
);
