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
  summary?: string;
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

// cite_start: Slices are the individual pieces of state and actions in the store.
export interface HighlightsSlice {
  highlightsData: HighlightsResponse | null;
  highlightsError: string | null;
  fetchHighlights: () => Promise<void>;
  resetHighlights: () => void;
}

export interface AppState extends HighlightsSlice {
  resetAllSlices: () => void;
}