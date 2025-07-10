import type { StateCreator } from 'zustand';
import { api } from '../../api';
import type { ArticlesSlice, AppState } from '../types';

const initialProps = {
  articlesData: null,
  articlesError: null,
};

export const createArticlesSlice: StateCreator<AppState, [], [], ArticlesSlice> = (set) => ({
  ...initialProps,
  fetchArticles: async () => {
    set({ articlesError: null });

    //cite_start: Fetching articles data from the API
    const result = await api.fetchArticles();
    if (result.outcome === 'success') {
      set({ articlesData: result.data });
    } else {
      set({ articlesError: result.error, articlesData: null });
    }
  },
  resetArticles: () => {
    set(initialProps);
  },
});