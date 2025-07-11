import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from '..';
import { act } from '@testing-library/react';
import { api } from '../../api';
import type { ArticleCard } from '../types';

describe('articlesSlice actions', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAllSlices();
    });
  });

  it('resetArticles should reset articles state to initial values', () => {
    const mockArticlesArray: ArticleCard[] = [
      {
        id: 1,
        title: 'Test Article' ,
        author: 'Jane Doe',
        content: 'Content of the most viewed article.',
        views: 987,
        shares: 123,
        createdAt: 1752205200000,
      },
    ];
    act(() => {
      useAppStore.setState({
        articlesData: mockArticlesArray,
        totalCount: 1,
        currentPage: 5,
        authorFilter: 'Test Author',
        sortBy: 'views',
      });
    });

    expect(useAppStore.getState().currentPage).toBe(5);
    expect(useAppStore.getState().authorFilter).toBe('Test Author');

    act(() => {
      useAppStore.getState().resetArticles();
    });

    const state = useAppStore.getState();
    expect(state.articlesData).toBeNull();
    expect(state.totalCount).toBe(0);
    expect(state.currentPage).toBe(1);
    expect(state.authorFilter).toBe('');
    expect(state.sortBy).toBe('');
  });
});

describe('articlesSlice getSummary action', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAllSlices();
    });
    vi.restoreAllMocks();
  });

  it('should update only the correct article with the new summary', async () => {
    const articleIdToSummarize = 2;
    const mockArticles = [
      { id: 1, title: 'Article 1', content: '...', author: 'A', views: 1, shares: 1, createdAt: 1 },
      { id: 2, title: 'Article 2', content: '...', author: 'B', views: 2, shares: 2, createdAt: 2 },
      { id: 3, title: 'Article 3', content: '...', author: 'C', views: 3, shares: 3, createdAt: 3 },
    ];
    
    const summaryResponse = { id: articleIdToSummarize, summary: 'This is the new summary.' };
    
    vi.spyOn(api, 'getSummary').mockResolvedValue({
      outcome: 'success',
      data: summaryResponse,
    });

    act(() => {
      useAppStore.setState({ articlesData: mockArticles });
    });

    await act(async () => {
      await useAppStore.getState().getSummary(articleIdToSummarize);
    });

    const finalArticles = useAppStore.getState().articlesData;

    const updatedArticle = finalArticles?.find(a => a.id === articleIdToSummarize);
    const untouchedArticle = finalArticles?.find(a => a.id === 1);

    expect(updatedArticle?.summary?.summary).toBe('This is the new summary.');
    expect(untouchedArticle?.summary).toBeUndefined();
  });

  it('should handle getSummary correctly when articlesData is initially null', async () => {
    const summaryResponse = { id: 1, summary: 'A summary for a non-existent list' };
    vi.spyOn(api, 'getSummary').mockResolvedValue({
      outcome: 'success',
      data: summaryResponse,
    });
  
    await act(async () => {
      await useAppStore.getState().getSummary(1);
    });
  
    const finalArticles = useAppStore.getState().articlesData;
    
    expect(finalArticles).toEqual([]);
  });
});


