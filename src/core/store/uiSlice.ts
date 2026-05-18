import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState } from '@models/types';

const initialState: UIState = {
  activeTab: 'editor',
  sidebarExpanded: true,
  theme: 'light',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<UIState['activeTab']>) => {
      state.activeTab = action.payload;
    },

    setSelectedCharacterId: (state, action: PayloadAction<string | undefined>) => {
      state.selectedCharacterId = action.payload;
    },

    setSelectedLocationId: (state, action: PayloadAction<string | undefined>) => {
      state.selectedLocationId = action.payload;
    },

    setSelectedChapterId: (state, action: PayloadAction<string | undefined>) => {
      state.selectedChapterId = action.payload;
    },

    toggleSidebar: (state) => {
      state.sidebarExpanded = !state.sidebarExpanded;
    },

    setSidebarExpanded: (state, action: PayloadAction<boolean>) => {
      state.sidebarExpanded = action.payload;
    },

    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setSelectedCharacterId,
  setSelectedLocationId,
  setSelectedChapterId,
  toggleSidebar,
  setSidebarExpanded,
  toggleTheme,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
