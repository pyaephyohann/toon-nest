/**
 * Slices Export
 * Centralized export for all Redux slices (UI state only)
 */

import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import sidebarReducer from "./sidebarSlice";
import searchReducer from "./searchSlice";
import readerReducer from "./readerSlice";
import notificationReducer from "./notificationSlice";

export const rootReducer = combineReducers({
  theme: themeReducer,
  sidebar: sidebarReducer,
  search: searchReducer,
  reader: readerReducer,
  notification: notificationReducer,
});
