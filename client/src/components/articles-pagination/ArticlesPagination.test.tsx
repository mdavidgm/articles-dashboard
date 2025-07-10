import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useAppStore } from '../../store';
import ArticlesPagination from './ArticlesPagination';
import type { MockInstance, Mock } from 'vitest';
import type { QueryParams } from '../../store/types';

describe('ArticlesPagination Component', () => {
  let fetchArticlesSpy: MockInstance<(params: QueryParams) => Promise<void>>;
  let globalFetchMock: Mock;

  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAllSlices();
      fetchArticlesSpy = vi.spyOn(useAppStore.getState(), 'fetchArticles') as typeof fetchArticlesSpy;

      globalFetchMock = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({ articlesData: [], totalCount: 0 }),
          status: 200,
        } as Response)
      );
      vi.stubGlobal('fetch', globalFetchMock);
    });
  });

  afterEach(() => {
    fetchArticlesSpy.mockRestore();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should call fetchArticles on initial render', async () => {
    globalFetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articlesData: [], totalCount: 20 }),
      status: 200,
    } as Response);

    act(() => {
      useAppStore.setState({
        articlesIsLoading: false,
        totalCount: 20,
        currentPage: 1,
        articlesPerPage: 10,
        articlesData: [],
      });
    });

    render(<ArticlesPagination />);

    const expectedParams: QueryParams = { page: 1, limit: 10 };
    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);
      expect(fetchArticlesSpy).toHaveBeenCalledWith(expectedParams);
    });
  });

  it('should disable Pagination controls when articlesIsLoading is true', () => {
    act(() => {
      useAppStore.setState({
        articlesIsLoading: true,
        totalCount: 50,
        currentPage: 1,
        articlesPerPage: 10,
        articlesData: [],
      });
    });

    render(<ArticlesPagination />);

    const pagination = screen.getByRole('navigation');

    const prevPageButton = within(pagination).getByRole('button', { name: 'Go to previous page' });
    const nextPageButton = within(pagination).getByRole('button', { name: 'Go to next page' });

    expect(prevPageButton).toBeDisabled();
    expect(nextPageButton).toBeDisabled();
  });

  it('should call fetchArticles with new page on Pagination change', async () => {
    globalFetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articlesData: [], totalCount: 20 }),
      status: 200,
    } as Response);

    globalFetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articlesData: [], totalCount: 20 }),
      status: 200,
    } as Response);

    act(() => {
      useAppStore.setState({
        articlesIsLoading: false,
        totalCount: 20,
        currentPage: 1,
        articlesPerPage: 10,
        articlesData: [],
      });
    });

    render(<ArticlesPagination />);

    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);
    });

    const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
    fireEvent.click(page2Button);

    const expectedParams: QueryParams = { page: 2, limit: 10 };
    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(2);
      expect(fetchArticlesSpy).toHaveBeenCalledWith(expectedParams);
    });
  });

  it('should display an error message when API call fails', async () => {
    const errorMessage = 'Internal Server Error Mock';

    globalFetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => errorMessage,
    } as Response);

    act(() => {
      useAppStore.setState({
        articlesIsLoading: false,
        totalCount: 0,
        currentPage: 1,
        articlesPerPage: 10,
        articlesData: [],
        articlesError: null,
      });
    });

    render(<ArticlesPagination />);

    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);
      expect(useAppStore.getState().articlesError).toBe(`${errorMessage}`);
    });

  });
});