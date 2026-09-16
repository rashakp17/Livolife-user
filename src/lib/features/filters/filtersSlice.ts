import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  categories: string[];
  subCategories: string[];
  priceRange: [number, number];
  sizes: string[];
}

const initialState: FiltersState = {
  categories: [],
  subCategories: [],
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
    setSubCategories: (state, action: PayloadAction<string[]>) => {
      state.subCategories = action.payload;
    },
    toggleSubCategory: (state, action: PayloadAction<string>) => {
      const subCategory = action.payload;
      const index = state.subCategories.indexOf(subCategory);
      if (index > -1) {
        state.subCategories.splice(index, 1);
      } else {
        state.subCategories.push(subCategory);
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
      state.subCategories = [];
      state.priceRange = [0, 5000];
      state.sizes = [];
    },
  },
});

export const {
  setCategories,
  toggleCategory,
  setSubCategories,
  toggleSubCategory,
  setPriceRange,
  setSizes,
  toggleSize,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
