import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useAppStore } from '../../store';
import ArticlesPagination from './ArticlesPagination';
import type { MockInstance, Mock } from 'vitest';

describe('ArticlesPagination Component', () => {
  let fetchArticlesSpy: MockInstance<(page: number, limit?: number) => Promise<void>>;
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

    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);
      expect(fetchArticlesSpy).toHaveBeenCalledWith(1, 10);
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

  it('should call fetchArticles with new page on Pagination change', async () => {
    globalFetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articlesData: [{ id: 'a', title: 'Page 1 Article' }], totalCount: 20 }),
      status: 200,
    } as Response);

    globalFetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articlesData: [{ id: 'b', title: 'Page 2 Article' }], totalCount: 20 }),
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
      expect(fetchArticlesSpy).toHaveBeenCalledWith(1, 10);
    });

    const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
    fireEvent.click(page2Button);

    await waitFor(() => {
      expect(fetchArticlesSpy).toHaveBeenCalledTimes(2);
      expect(fetchArticlesSpy).toHaveBeenCalledWith(2, 10);
    });

    expect(useAppStore.getState().currentPage).toBe(2);
  });
});