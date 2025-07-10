import type { HighlightsResponse, ApiResult } from '../types';

const API_BASE_URL = 'http://localhost:4000/api';

export const api = {
  // cite_start: Using ApiResult and the specific type for the response we standardize our API calls.
  fetchHighlights: async (): Promise<ApiResult<HighlightsResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/highlights`);

      if (!response.ok) {
        return {
          outcome: 'error',
          error: 'Failed to fetch highlights from server.',
          status: response.status,
        };
      }

      const data = await response.json() as HighlightsResponse;
      // cite_start: success has not status because it is redundant
      return { outcome: 'success', data };

    } catch (error) {
      // cite_start: error has not status because it is not available in the catch block
      if (error instanceof Error) {
        return { outcome: 'error', error: error.message };
      }
      // Provide a fallback message if something other than an Error was thrown
      return { outcome: 'error', error: 'An unexpected and unknown error occurred' };
    }
  },
};