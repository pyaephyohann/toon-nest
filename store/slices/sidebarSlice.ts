/**
 * Sidebar Slice
 * Manages sidebar UI state (open/closed)
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  isOpen: boolean;
  isMobileOpen: boolean;
}

const initialState: SidebarState = {
  isOpen: true,
  isMobileOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    openSidebar: (state) => {
      state.isOpen = true;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    openMobileSidebar: (state) => {
      state.isMobileOpen = true;
    },
    closeMobileSidebar: (state) => {
      state.isMobileOpen = false;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileOpen = !state.isMobileOpen;
    },
  },
});

export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  openMobileSidebar,
  closeMobileSidebar,
  toggleMobileSidebar,
} = sidebarSlice.actions;
export const selectSidebarOpen = (state: { sidebar: SidebarState }) => state.sidebar.isOpen;
export const selectMobileSidebarOpen = (state: { sidebar: SidebarState }) => state.sidebar.isMobileOpen;
export default sidebarSlice.reducer;
