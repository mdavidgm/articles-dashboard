import type { StateCreator } from 'zustand';
import { api } from '../../api';
import type { HighlightsSlice, AppState } from '../types';

const initialProps = {
  highlightsData: null,
  highlightsIsLoading: true,
  highlightsError: null,
};

export const createHighlightsSlice: StateCreator<AppState, [], [], HighlightsSlice> = (set) => ({
  ...initialProps,
  fetchHighlights: async () => {
    set({ highlightsIsLoading: true, highlightsError: null });

    //cite_start: Fetching highlights data from the API
    const result = await api.fetchHighlights();
    console.log('Highlights API result:', result);
    if (result.outcome === 'success') {
      set({ highlightsData: result.data, highlightsIsLoading: false });
    } else {
      set({ highlightsError: result.error, highlightsData: null, highlightsIsLoading: false });
    }
  },
  resetHighlights: () => {
    set(initialProps);
  },
});