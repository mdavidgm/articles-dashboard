import type { StateCreator } from 'zustand';
import { api } from '../../api';
import type { ArticlesSlice, AppState } from '../types';

const initialProps = {
  articlesData: null,
  totalCount: null,
  articlesError: null,
};

export const createArticlesSlice: StateCreator<AppState, [], [], ArticlesSlice> = (set) => ({
  ...initialProps,
  fetchArticles: async () => {
    set({ articlesError: null });

    //cite_start: Fetching articles data from the API
    const result = await api.fetchArticles();
    console.log('Fetched articles:', result);
    if (result.outcome === 'success') {
      set({ articlesData: result.data.articlesData, totalCount: result.data.totalCount });
    } else {
      set({ articlesError: result.error, articlesData: null });
    }
  },
  resetArticles: () => {
    set(initialProps);
  },
});