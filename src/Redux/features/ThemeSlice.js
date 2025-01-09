import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: false, // Default theme is light (false)
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = !state.theme; // Toggle the theme value
    },
  },
});

// Action creator for toggling theme
export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
