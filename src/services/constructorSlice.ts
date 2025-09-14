import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructorSlice',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    deleteIngredient: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (ing) => ing.id === action.payload
      );
      if (index !== -1) {
        state.ingredients.splice(index, 1);
      }
    },
    deleteIngredients: (state) => {
      state.ingredients = initialState.ingredients;
      state.bun = initialState.bun;
    },
    clearIngredients: (state) => {
      state.ingredients = [];
      state.bun = null;
    },
    moveIngredients: (state, action) => {
      const ing = state.ingredients[action.payload.index];
      state.ingredients[action.payload.index] =
        state.ingredients[action.payload.nextIndex];
      state.ingredients[action.payload.nextIndex] = ing;
    }
  },
  selectors: {
    constructorSelector: (state) => {
      const selectedBurger = {
        bun: state.bun,
        ingredients: state.ingredients
      };
      return selectedBurger;
    },
    getOrderIngredientsSelector: (state) => state.ingredients,
    getBunsSelector: (state) => state.bun
  }
});

export const { constructorSelector } = constructorSlice.selectors;
export const {
  addIngredient,
  deleteIngredient,
  deleteIngredients,
  clearIngredients,
  moveIngredients
} = constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
