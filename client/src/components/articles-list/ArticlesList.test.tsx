import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useAppStore } from '../../store';
import ArticlesList from './ArticlesList';
import type { ArticleCard } from '../../store/types';

describe('ArticlesList - Component State Rendering', () => {
  const mockArticlesArray: ArticleCard[] = [
    {
      id: 101,
      title: 'Top Article by Views',
      author: 'Jane Doe',
      content: 'Content of the most viewed article.',
      views: 987,
      shares: 123,
      createdAt: 1752205200000,
    },
    {
      id: 202,
      title: 'Viral Article by Shares',
      author: 'John Smith',
      content: 'Content of the most shared article.',
      views: 456,
      shares: 543,
      createdAt: 1752205200000,
    },
  ];

  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAllSlices();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render loading state when articlesIsLoading is true', () => {
    act(() => {
      useAppStore.setState({ articlesIsLoading: true });
    });

    render(<ArticlesList />);

    expect(screen.getByRole('progressbar', { name: 'Loading articles' })).toBeInTheDocument();
    expect(screen.getByText('Loading articles...')).toBeInTheDocument();
  });

  it('should render articles list on successful data load', async () => {
    act(() => {
      useAppStore.setState({
        articlesData: mockArticlesArray,
        articlesIsLoading: false,
        articlesError: null,
        totalCount: mockArticlesArray.length,
        currentPage: 1,
        articlesPerPage: 10,
      });
    });

    render(<ArticlesList />);

    expect(screen.queryByRole('progressbar', { name: 'Loading articles' })).not.toBeInTheDocument();

    expect(screen.getByText(mockArticlesArray[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockArticlesArray[1].title)).toBeInTheDocument();

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(mockArticlesArray.length);
  });

  it('should render error message when articlesError is set', async () => {
    const errorMessage = 'Internal Server Error Mock';
    act(() => {
      useAppStore.setState({
        articlesError: errorMessage,
        articlesIsLoading: false,
        articlesData: null,
      });
    });

    render(<ArticlesList />);

    expect(screen.queryByRole('progressbar', { name: 'Loading articles' })).not.toBeInTheDocument();

    expect(screen.getByText(`${errorMessage}`)).toBeInTheDocument();
  });

  it('should render "No articles available." when data is empty', () => {
    act(() => {
      useAppStore.setState({
        articlesData: [],
        articlesIsLoading: false,
        articlesError: null,
        totalCount: 0,
      });
    });

    render(<ArticlesList />);

    expect(screen.queryByRole('progressbar', { name: 'Loading articles' })).not.toBeInTheDocument();

    expect(screen.getByText('No articles available.')).toBeInTheDocument();
  });
});