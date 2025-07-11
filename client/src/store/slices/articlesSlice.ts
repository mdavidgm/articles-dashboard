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
  authorFilter: '',
  sortBy: '',
  sortOrder: 'desc',
};

export const createArticlesSlice: StateCreator<AppState, [], [], ArticlesSlice> = (set, get) => ({
  ...initialProps,
  fetchArticles: async (searchParams: QueryParams) => {
    set({ articlesError: null });

    //cite_start: Fetching articles data from the API
    const searchQuery = buildQueryString(searchParams);
    // console.log('fetchArticles', searchQuery);
    const result = await api.fetchArticles(buildQueryString(searchParams));
    history.pushState({}, searchQuery, `?${searchQuery}`);

    if (result.outcome === 'success') {
      set({ 
        articlesData: result.data.articlesData, 
        totalCount: result.data.totalCount, 
        articlesIsLoading: false,
        currentPage: searchParams.page,
        articlesPerPage: searchParams.limit,
        authorFilter: searchParams.author,
        sortBy: searchParams.sort,
        sortOrder: searchParams.order,
      });
    } else {
      set({ 
        articlesError: result.error, 
        articlesData: null, 
        articlesIsLoading: false,
        currentPage: 1,
        articlesPerPage: 10,
        authorFilter: searchParams.author,
      });
    }
  },
  setAuthorFilter: (author: string) => {
    set({ authorFilter: author, currentPage: 1 });
    const { articlesPerPage, sortBy, sortOrder } = get();
    const params: QueryParams = { page: 1, limit: articlesPerPage, author: author, sort: sortBy, order: sortOrder };
    get().fetchArticles(params);
    get().fetchHighlights();
  },
  setSortBy: (sort: string ) => {
    set({ sortBy: sort, currentPage: 1 });
    const { articlesPerPage, authorFilter, sortOrder } = get();
    const params: QueryParams = { page: 1, limit: articlesPerPage, author: authorFilter, sort: sort, order: sortOrder };  
    get().fetchArticles(params);
  },
  setSortOrder: (order: string) => {
    set({ sortOrder: order, currentPage: 1 });
    const { articlesPerPage, authorFilter, sortBy } = get();
    const params: QueryParams = { page: 1, limit: articlesPerPage, author: authorFilter, sort: sortBy, order: order };
    get().fetchArticles(params);
  },
  resetArticles: () => {
    set(initialProps);
  },
});