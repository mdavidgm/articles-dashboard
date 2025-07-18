/**
 * cite_start: Single Source of Truth (SSoT)
 * This file defines the types used throughout the application to avoid duplication and inconsistencies
 **/

export interface ArticleCard {
  id: number;
  title: string;
  author: string;
  content: string;
  views: number;
  shares: number;
  createdAt: number;
  summary?: {
    id: number;
    summary: string;
  };
}

export interface HighlightCardProps extends ArticleCard {
  type: 'viewed' | 'shared';
}

/**
  cite_start: Generic format for API responses
  Using these types allows us to standardize how we handle API responses across the application.
  - A successful response will have a 'success' outcome and the data,
  - A failure response will have an 'error' outcome and an error message.
**/
export type ApiResult<T> =
  | { outcome: 'success'; data: T }
  | { outcome: 'error'; error: string; status?: number };

export interface HighlightsResponse {
  mostViewed: ArticleCard;
  mostShared: ArticleCard;
}
export interface SummaryResponse {
  summary: string;
  id: number;
}

export interface SummaryObject {
  id: number;
  text: string;
}

// cite_start: Slices are the individual pieces of state and actions in the store.
export interface HighlightsSlice {
  highlightsData: HighlightsResponse | null;
  highlightsError: string | null;
  fetchHighlights: (authorFilter?: string) => Promise<void>;
  resetHighlights: () => void;
}
export interface ArticlesResponse {
  articlesData: ArticleCard[];
  totalCount: number;
}

export interface ArticlesSlice {
  articlesData: ArticleCard[] | null;
  totalCount: number;
  articlesIsLoading: boolean;
  currentPage: number;
  articlesPerPage: number;
  articlesError: string | null;
  authorFilter: string;
  sortBy: string;
  sortOrder: string;
  setAuthorFilter: (author: string) => void;
  setSortBy: (sortField: string) => void;
  setSortOrder: (order: string) => void; 
  getSummary: (id: number) => void; 
  fetchArticles: (searchParams: QueryParams) => Promise<void>;
  resetArticles: () => void;
}

export interface AppState extends HighlightsSlice, ArticlesSlice {
  resetAllSlices: () => void;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  author?: string;
  sort?: string;
  order?: string;
}