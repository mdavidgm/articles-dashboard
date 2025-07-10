import { describe, it, expect, afterEach, vi } from 'vitest';
import { api, safeFetch } from '.';
import type { ArticleCard } from '../store/types';

afterEach(() => {
  vi.restoreAllMocks();
});

//cite_start: Tests to api errors
describe('safeFetch', () => {
  it('should return an error outcome with a status code on a server error', async () => {
    const mockResponse = new Response('Request failed with status 404', { status: 404, statusText: 'Not Found' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));
    const result = await safeFetch('/test-endpoint');
    expect(result).toEqual({
      outcome: 'error',
      error: 'Request failed with status 404',
      status: 404,
    });
  });

  it('should return a network error outcome when the fetch promise rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network request failed')));
    const result = await safeFetch('/test-endpoint');
    expect(result).toEqual({
      outcome: 'error',
      error: 'Network request failed',
    });
  });

  it('should return an "unknown error" outcome when the thrown error is not an Error instance', async () => {
    const unexpectedError = 'Something bad happened';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(unexpectedError));
    const result = await safeFetch('/test-endpoint');
    expect(result).toEqual({
      outcome: 'error',
      error: 'An unexpected and unknown error occurred',
    });
  });
});

//cite_start: Tests to success functions. Errors are already tested in the safeFetch tests
describe('api.fetchHighlights', () => {
  it('should return highlight articles on a successful fetch', async () => {
    const mockData = {
      mostViewed: {
        id: 101,
        title: 'Top Article by Views',
        author: 'Jane Doe',
        content: 'Content of the most viewed article.',
        views: 987,
        shares: 123,
        createdAt: 1752205200000,
      } as ArticleCard,
      mostShared: {
        id: 202,
        title: 'Viral Article by Shares',
        author: 'John Smith',
        content: 'Content of the most shared article.',
        views: 456,
        shares: 543,
        createdAt: 1752205200000,
      } as ArticleCard,
    };

    //cite_start: Mocking the fetch response, do not confuse with the response returned by our api function
    const mockResponse = new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    const result = await api.fetchHighlights();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/highlights');

    //cite_start: We expect the outcome to be success and a data to match our mockData
    expect(result).toEqual({
      outcome: 'success',
      data: mockData,
    });
  });
});

describe('api.fetchArticles', () => {
  it('should return articles on a successful fetch', async () => {
    const mockData = {
      mostViewed: {
        id: 101,
        title: 'Top Article by Views',
        author: 'Jane Doe',
        content: 'Content of the most viewed article.',
        views: 987,
        shares: 123,
        createdAt: 1752205200000,
      } as ArticleCard,
      mostShared: {
        id: 202,
        title: 'Viral Article by Shares',
        author: 'John Smith',
        content: 'Content of the most shared article.',
        views: 456,
        shares: 543,
        createdAt: 1752205200000,
      } as ArticleCard,
    };

    //cite_start: Mocking the fetch response, do not confuse with the response returned by our api function
    const mockResponse = new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    const result = await api.fetchArticles();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/articles');

    //cite_start: We expect the outcome to be success and a data to match our mockData
    expect(result).toEqual({
      outcome: 'success',
      data: mockData,
    });
  });
});