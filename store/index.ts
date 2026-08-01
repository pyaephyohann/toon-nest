/**
 * Redux Store Configuration
 * Centralized store with RTK Query and UI state slices
 */

import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { rootReducer } from "./slices";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    ...rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
