import type { StateCreator } from 'zustand';
import { api } from '../../api';
import type { ArticlesSlice, AppState } from '../types';

const initialProps = {
  articlesData: null,
  totalCount: 0,
  articlesError: null,
  articlesIsLoading: false,
  currentPage: 1,
  articlesPerPage: 10,
};

export const createArticlesSlice: StateCreator<AppState, [], [], ArticlesSlice> = (set) => ({
  ...initialProps,
  fetchArticles: async (page: number, articlesPerPage: number) => {
    set({ articlesError: null });

    //cite_start: Fetching articles data from the API
    const result = await api.fetchArticles(page, articlesPerPage);

    if (result.outcome === 'success') {
      set({ 
        articlesData: result.data.articlesData, 
        totalCount: result.data.totalCount, 
        articlesIsLoading: false,
        currentPage: page,
      });
    } else {
      console.log('Error fetching articles:', result.error);
      set({ 
        articlesError: result.error, 
        articlesData: null, 
        articlesIsLoading: false,
        currentPage: 1,
      });
    }
  },
  resetArticles: () => {
    set(initialProps);
  },
});