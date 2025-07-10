import type { HighlightsResponse, ApiResult } from '../types';

const API_BASE_URL = 'http://localhost:4000/api';

/* cite_start: safeFetch is a generic function to handle API requests and responses.
    It abstracts the fetch logic, error handling, and response parsing.
    This function can be reused for different API endpoints by specifying the endpoint and expected response type.
    It receives an endpoint string and returns a promise that resolves to ApiResult<T>.
*/
export async function safeFetch<T>(endpoint: string): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    // cite_start: !response.ok checks if the response status is not in the range 200-299 to return an error
    if (!response.ok) {
      const serverError = await response.text();

      return {
        outcome: 'error',
         error: serverError,
        status: response.status,
      };
    }

    // cite_start: success has not status because it is redundant
    const data = await response.json() as T;
    return { outcome: 'success', data };

  } catch (error) {
    // cite_start: error has not status because it is not available in the catch block
    if (error instanceof Error) {
      return { outcome: 'error', error: error.message };
    }
    return { outcome: 'error', error: 'An unexpected and unknown error occurred' };
  }
}

export const api = {
  // cite_start: here we send the response type and function to the safeFetch function
  fetchHighlights: () => safeFetch<HighlightsResponse>('/highlights'),
};