
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useAppStore, } from '../../store';
import ArticlesList from './ArticlesList';
import type { ArticleCard } from '../../store/types';

describe.only('ArticlesList - Mocking api response', () => {
  let fetchArticlesSpy: ReturnType<typeof vi.spyOn>;
  const mockData = [
    {
      id: 101,
      title: 'Top Article by Views',
      author: 'Jane Doe',
      content: 'Content of the most viewed article.',
      views: 987,
      shares: 123,
      createdAt: 1752205200000,
    } as ArticleCard,
    {
      id: 202,
      title: 'Viral Article by Shares',
      author: 'John Smith',
      content: 'Content of the most shared article.',
      views: 456,
      shares: 543,
      createdAt: 1752205200000,
    } as ArticleCard,
  ];

  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAllSlices();

      //cite_start: We spy on the fetchArticles function to track its calls
      fetchArticlesSpy = vi.spyOn(useAppStore.getState(), 'fetchArticles');
    });
  });

  afterEach(() => {
    fetchArticlesSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('Success', async () => {

    //cite_start: Here we return the mocked value for api response
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData,
      status: 200,
    } as Response);

    render(<ArticlesList />);

    expect(screen.getByRole('progressbar', { name: 'Loading articles' })).toBeInTheDocument();
    expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar', { name: 'Loading articles' })).not.toBeInTheDocument();

      expect(screen.getByText(mockData[0].title)).toBeInTheDocument();
      expect(screen.getByText(mockData[1].title)).toBeInTheDocument();

    });

  });

  it('Error', async () => {

    //cite_start: Error case, we mock the fetch to return an error response
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error Mock',
    } as Response);
    render(<ArticlesList />);

    expect(screen.getByRole('progressbar', { name: 'Loading articles' })).toBeInTheDocument();
    expect(fetchArticlesSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar', { name: 'Loading articles' })).not.toBeInTheDocument();
      expect(screen.getByText('Internal Server Error Mock')).toBeInTheDocument();
    });
  });

});
