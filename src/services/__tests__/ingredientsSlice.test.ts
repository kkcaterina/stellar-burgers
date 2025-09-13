import { TIngredient } from '@utils-types';
import {
  initialState,
  getAllIngredients,
  ingredientsSlice
} from '../ingredientsSlice';
import { getIngredientsApi } from '@api';
import { configureStore } from '@reduxjs/toolkit';

const ingredientsResponse: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0940',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://code.s3.yandex.net/react/code/meat-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0945',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  }
];

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('Проверяем загрузку ингредиентов', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('Тестируем успешное получение ингредиентов', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(ingredientsResponse);
    const store = configureStore({
      reducer: { ingredients: ingredientsSlice.reducer }
    });
    await store.dispatch(getAllIngredients());
    const { ingredients } = store.getState().ingredients;
    expect(getIngredientsApi).toHaveBeenCalledTimes(1);
    expect(ingredients).toEqual(ingredientsResponse);
    expect(ingredients).toHaveLength(3);
    expect(store.getState().ingredients.loading).toBe(false);
    expect(store.getState().ingredients.error).toBeNull();
  });
});

describe('Проверяем обработку редьюсером экшенов генерируемых при выполнении асинхронного запроса в ingredientsSlice', () => {
  test('Тестируем экшен начала запроса (pending)', () => {
    const action = { type: getAllIngredients.pending.type };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
  test('Тестируем экшен успешного выполнения запроса (fulfilled)', () => {
    const action = {
      type: getAllIngredients.fulfilled.type,
      payload: ingredientsResponse
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(ingredientsResponse);
    expect(state.ingredients).toHaveLength(3);
  });
  test('Тестируем экшен ошибки запроса (rejected)', () => {
    const errorMessage = 'К сожалению, возникла ошибка...';
    const action = {
      type: getAllIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.ingredients).toEqual([]);
  });
});
