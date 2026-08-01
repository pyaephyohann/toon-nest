/**
 * Reader Slice
 * Manages reader UI state (mode, settings)
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReaderMode = "scroll" | "paged";

interface ReaderState {
  mode: ReaderMode;
  fontSize: number;
  lineHeight: number;
  autoScroll: boolean;
}

const initialState: ReaderState = {
  mode: "scroll",
  fontSize: 16,
  lineHeight: 1.6,
  autoScroll: false,
};

const readerSlice = createSlice({
  name: "reader",
  initialState,
  reducers: {
    setReaderMode: (state, action: PayloadAction<ReaderMode>) => {
      state.mode = action.payload;
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = Math.max(12, Math.min(24, action.payload));
    },
    setLineHeight: (state, action: PayloadAction<number>) => {
      state.lineHeight = Math.max(1.2, Math.min(2.0, action.payload));
    },
    toggleAutoScroll: (state) => {
      state.autoScroll = !state.autoScroll;
    },
    setAutoScroll: (state, action: PayloadAction<boolean>) => {
      state.autoScroll = action.payload;
    },
    resetReaderSettings: (state) => {
      state.mode = "scroll";
      state.fontSize = 16;
      state.lineHeight = 1.6;
      state.autoScroll = false;
    },
  },
});

export const {
  setReaderMode,
  setFontSize,
  setLineHeight,
  toggleAutoScroll,
  setAutoScroll,
  resetReaderSettings,
} = readerSlice.actions;
export const selectReaderMode = (state: { reader: ReaderState }) => state.reader.mode;
export const selectReaderSettings = (state: { reader: ReaderState }) => ({
  fontSize: state.reader.fontSize,
  lineHeight: state.reader.lineHeight,
  autoScroll: state.reader.autoScroll,
});
export default readerSlice.reducer;
