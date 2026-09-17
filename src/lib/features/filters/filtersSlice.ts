import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  categories: string[];
  priceRange: [number, number];
  sizes: string[];
}

const initialState: FiltersState = {
  categories: [],
  priceRange: [0, 5000],
  sizes: [],
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const index = state.categories.indexOf(category);
      if (index > -1) {
        state.categories.splice(index, 1);
      } else {
        state.categories.push(category);
      }
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setSizes: (state, action: PayloadAction<string[]>) => {
      state.sizes = action.payload;
    },
    toggleSize: (state, action: PayloadAction<string>) => {
      const size = action.payload;
      const index = state.sizes.indexOf(size);
      if (index > -1) {
        state.sizes.splice(index, 1);
      } else {
        state.sizes.push(size);
      }
    },
    resetFilters: (state) => {
      state.categories = [];
      state.priceRange = [0, 5000];
      state.sizes = [];
    },
  },
});

export const {
  setCategories,
  toggleCategory,
  setPriceRange,
  setSizes,
  toggleSize,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
