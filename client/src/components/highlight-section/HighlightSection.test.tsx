import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAppStore } from '../../store';
import HighlightSection from './HighlightSection';
import type { ArticleCard, HighlightsResponse } from '../../store/types';

describe('HighlightSection - Mocking api response', () => {
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
      vi.spyOn(useAppStore.getState(), 'fetchHighlights');
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Success', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockData,
      status: 200,
    } as Response);
    render(<HighlightSection />);
    expect(screen.getByRole('progressbar', { name: 'Loading highlights' })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(mockData.mostViewed.title)).toBeInTheDocument();
      expect(screen.getByText(mockData.mostShared.title)).toBeInTheDocument();
    });
  });

  it('Error', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error Mock',
    } as Response);
    render(<HighlightSection />);
    await waitFor(() => {
      expect(screen.getByText('Internal Server Error Mock')).toBeInTheDocument();
    });
  });
  it('should render the error alert when highlightsError state is set', () => {
    const errorMessage = 'Direct Error For Testing';
    vi.spyOn(useAppStore.getState(), 'fetchHighlights').mockImplementation(async () => {});

    act(() => {
      useAppStore.setState({ highlightsError: errorMessage });
    });

    render(<HighlightSection />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(errorMessage);
  });

  it('should clean up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<HighlightSection />);
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
  });

  it('should call fetchHighlights with an author parameter if present in the state', async () => {
    const authorName = 'Tolkien';
  
    // FIX: Creamos un mock de datos válido y completo para esta respuesta
    const mockAuthorData = {
      mostViewed: { id: 1, title: 'Test Title', author: authorName, views: 100, shares: 10, createdAt: Date.now() },
      mostShared: { id: 2, title: 'Another Title', author: authorName, views: 20, shares: 200, createdAt: Date.now() }
    };
  
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockAuthorData,
      status: 200,
    } as Response);
  
    act(() => {
      useAppStore.setState({ authorFilter: authorName });
    });
  
    render(<HighlightSection />);
  
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining(`?author=${authorName}`)
      );
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  
    fetchSpy.mockRestore();
  });
  it('should fetch highlights with author from URL on initial load', async () => {
    const fetchHighlightsSpy = vi.spyOn(useAppStore.getState(), 'fetchHighlights');
    const authorName = 'Tolkien';
    const originalPath = window.location.pathname;
  
    window.history.pushState({}, '', `/?author=${authorName}`);
  
    render(<HighlightSection />);
  
    await waitFor(() => {
      expect(fetchHighlightsSpy).toHaveBeenCalledTimes(1);
      expect(fetchHighlightsSpy).toHaveBeenCalledWith(authorName);
    });
    
    window.history.pushState({}, '', originalPath);
  });
});