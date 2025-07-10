import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useAppStore, } from '../../store';
import HighlightSection from './HighlightSection';
import type { ArticleCard, HighlightsResponse } from '../../store/types';

describe('HighlightSection - Mocking api response', () => {
  let fetchHighlightsSpy: ReturnType<typeof vi.spyOn>;
  const mockData: HighlightsResponse = {
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

  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAllSlices();

      //cite_start: We spy on the fetchHighlights function to track its calls
      fetchHighlightsSpy = vi.spyOn(useAppStore.getState(), 'fetchHighlights');
    });
  });

  afterEach(() => {
    fetchHighlightsSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('Success', async () => {

    //cite_start: Here we return the mocked value for api response
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData,
      status: 200,
    } as Response);

    render(<HighlightSection />);

    expect(screen.getByRole('progressbar', { name: 'Loading highlights' })).toBeInTheDocument();
    expect(fetchHighlightsSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar', { name: 'Loading highlights' })).not.toBeInTheDocument();

      expect(screen.getByText(mockData.mostViewed.title)).toBeInTheDocument();
      expect(screen.getByText(mockData.mostShared.title)).toBeInTheDocument();

    });

  });

  it('Error', async () => {

    //cite_start: Error case, we mock the fetch to return an error response
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error Mock',
    } as Response);
    render(<HighlightSection />);

    expect(screen.getByRole('progressbar', { name: 'Loading highlights' })).toBeInTheDocument();
    expect(fetchHighlightsSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar', { name: 'Loading highlights' })).not.toBeInTheDocument();
      expect(screen.getByText('Internal Server Error Mock')).toBeInTheDocument();
    });
  });

  it('Error unexpected', async () => {
    //cite_start: Unexpected error case, with error message
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Unexpected Error Mock'));
    render(<HighlightSection />);

    expect(screen.getByRole('progressbar', { name: 'Loading highlights' })).toBeInTheDocument();
    expect(fetchHighlightsSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar', { name: 'Loading highlights' })).not.toBeInTheDocument();
      expect(screen.getByText('Unexpected Error Mock')).toBeInTheDocument();
    });
  });

  it('Error unexpected without error message', async () => {
    //cite_start: Unexpected error case, without error message
    vi.spyOn(global, 'fetch').mockRejectedValue(null);
    render(<HighlightSection />);

    expect(screen.getByRole('progressbar', { name: 'Loading highlights' })).toBeInTheDocument();
    expect(fetchHighlightsSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar', { name: 'Loading highlights' })).not.toBeInTheDocument();
      expect(screen.getByText('An unexpected and unknown error occurred')).toBeInTheDocument();
    });
  });

});
