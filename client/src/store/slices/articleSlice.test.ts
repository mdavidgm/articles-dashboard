import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '..';
import { act } from '@testing-library/react';

describe('articlesSlice actions', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.getState().resetAllSlices();
    });
  });

  it('resetArticles should reset articles state to initial values', () => {
    act(() => {
      useAppStore.setState({
        articlesData: [{ id: 1, title: 'Test Article' } as any],
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