import type { StateCreator } from 'zustand';
import { api } from '../../api';
import type { HighlightsSlice, AppState } from '../types';

const initialProps = {
  highlightsData: null,
  highlightsError: null,
};

export const createHighlightsSlice: StateCreator<AppState, [], [], HighlightsSlice> = (set) => ({
  ...initialProps,
  fetchHighlights: async () => {
    set({ highlightsError: null });

    //cite_start: Fetching highlights data from the API
    const result = await api.fetchHighlights();
    if (result.outcome === 'success') {
      set({ highlightsData: result.data });
    } else {
      set({ highlightsError: result.error, highlightsData: null });
    }
  },
  resetHighlights: () => {
    set(initialProps);
  },
});