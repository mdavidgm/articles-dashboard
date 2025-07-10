import type { StateCreator } from 'zustand';
import { api } from '../../api';
import type { ArticlesSlice, AppState, QueryParams } from '../types';
import { buildQueryString } from '../../utils/buildQueryString';

const initialProps = {
  articlesData: null,
  totalCount: 0,
  articlesError: null,
  articlesIsLoading: false,
  currentPage: 1,
  articlesPerPage: 10,
  searchQuery: '',
};

export const createArticlesSlice: StateCreator<AppState, [], [], ArticlesSlice> = (set) => ({
  ...initialProps,
  fetchArticles: async (searchParams: QueryParams) => {
    set({ articlesError: null });

    //cite_start: Fetching articles data from the API
    const result = await api.fetchArticles(buildQueryString(searchParams));

    if (result.outcome === 'success') {
      set({ 
        articlesData: result.data.articlesData, 
        totalCount: result.data.totalCount, 
        articlesIsLoading: false,
        currentPage: searchParams.page,
      });
    } else {
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