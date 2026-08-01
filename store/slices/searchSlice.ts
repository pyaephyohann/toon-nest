/**
 * Search Slice
 * Manages search UI state (query, filters, open/close)
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  query: string;
  filters: Record<string, any>;
  isOpen: boolean;
}

const initialState: SearchState = {
  query: "",
  filters: {},
  isOpen: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSearchFilters: (state, action: PayloadAction<Record<string, any>>) => {
      state.filters = action.payload;
    },
    updateSearchFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    clearSearchFilters: (state) => {
      state.filters = {};
    },
    openSearch: (state) => {
      state.isOpen = true;
    },
    closeSearch: (state) => {
      state.isOpen = false;
    },
    toggleSearch: (state) => {
      state.isOpen = !state.isOpen;
    },
    clearSearch: (state) => {
      state.query = "";
      state.filters = {};
      state.isOpen = false;
    },
  },
});

export const {
  setSearchQuery,
  setSearchFilters,
  updateSearchFilter,
  clearSearchFilters,
  openSearch,
  closeSearch,
  toggleSearch,
  clearSearch,
} = searchSlice.actions;
export const selectSearchQuery = (state: { search: SearchState }) => state.search.query;
export const selectSearchFilters = (state: { search: SearchState }) => state.search.filters;
export const selectSearchOpen = (state: { search: SearchState }) => state.search.isOpen;
export default searchSlice.reducer;
