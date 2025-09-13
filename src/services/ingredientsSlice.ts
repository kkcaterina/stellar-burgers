import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

export const getAllIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null | undefined;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredientsSlice',
  initialState,
  reducers: {},
  selectors: {
    getAllIngredientsSelector: (state) => state.ingredients,
    getIngredientsLoadingSelector: (state) => state.loading,
    getIngredientsErrorSelector: (state) => state.error,
    getAllBunsSelector: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'bun'),
    getAllMainsSelector: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'main'),
    getAllSaucesSelector: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'sauce')
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
        state.error = null;
      });
  }
});

export const {
  getAllIngredientsSelector,
  getIngredientsLoadingSelector,
  getIngredientsErrorSelector,
  getAllBunsSelector,
  getAllMainsSelector,
  getAllSaucesSelector
} = ingredientsSlice.selectors;
