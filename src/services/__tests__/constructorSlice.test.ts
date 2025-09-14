import { initialState, constructorSlice } from '../constructorSlice';
import { TIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';

const mockBun: TIngredient = {
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
};

const mockMain: TIngredient = {
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
};

const mockSauce: TIngredient = {
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
};

const createAddIngredientAction = (ingredient: TIngredient) => {
  const id = nanoid();
  return {
    type: 'burgerConstructorSlice/addIngredient',
    payload: { ...ingredient, id }
  };
};

describe('Проверяем работу редьюсеров в constructorSlice', () => {
  test('Тестируем добавление булки: addIngredient', () => {
    const action = createAddIngredientAction(mockBun);
    const state = constructorSlice.reducer(initialState, action);
    expect(state.bun).not.toBeNull();
    expect(state.bun!._id).toBe(mockBun._id);
    expect(state.bun!.name).toBe(mockBun.name);
    expect(state.bun!.type).toBe('bun');
    expect(state.bun).toHaveProperty('id');
    expect(state.ingredients).toHaveLength(0);
  });
  test('Тестируем добавление начинки: addIngredient', () => {
    const action = createAddIngredientAction(mockMain);
    const state = constructorSlice.reducer(initialState, action);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(mockMain._id);
    expect(state.ingredients[0].name).toBe(mockMain.name);
    expect(state.ingredients[0].type).toBe('main');
    expect(state.ingredients[0]).toHaveProperty('id');
  });
  test('Тестируем удаление ингредиента: deleteIngredient', () => {
    const ingredientWithId = { ...mockMain, id: 'test-id-1' };
    const sauceWithId = { ...mockSauce, id: 'test-id-2' };
    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredientWithId, sauceWithId]
    };
    const action = constructorSlice.actions.deleteIngredient('test-id-1');
    const state = constructorSlice.reducer(stateWithIngredients, action);
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].id).toBe('test-id-2');
    expect(state.ingredients[0]._id).toBe(mockSauce._id);
  });
  test('Тестируем удаление ингредиентов: deleteIngredients', () => {
    const bunWithId = { ...mockBun, id: 'bun-id' };
    const ingredientWithId = { ...mockMain, id: 'test-id-1' };
    const sauceWithId = { ...mockSauce, id: 'test-id-2' };
    const stateWithData = {
      bun: bunWithId,
      ingredients: [ingredientWithId, sauceWithId]
    };
    const action = constructorSlice.actions.deleteIngredients();
    const state = constructorSlice.reducer(stateWithData, action);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
  test('Тестируем очистку ингредиентов: clearIngredients', () => {
    const bunWithId = { ...mockBun, id: 'bun-id' };
    const ingredientWithId = { ...mockMain, id: 'test-id-1' };
    const sauceWithId = { ...mockSauce, id: 'test-id-2' };
    const stateWithData = {
      bun: bunWithId,
      ingredients: [ingredientWithId, sauceWithId]
    };
    const action = constructorSlice.actions.clearIngredients();
    const state = constructorSlice.reducer(stateWithData, action);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
  test('Тестируем обработку изменения порядка ингредиентов в начинке: moveIngredients', () => {
    const firstIngredient = { ...mockMain, id: 'first-id' };
    const secondIngredient = { ...mockSauce, id: 'second-id' };
    const thirdIngredient = { ...mockMain, id: 'third-id' };
    const stateWithIngredients = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient, thirdIngredient]
    };
    const action = constructorSlice.actions.moveIngredients({
      index: 0,
      nextIndex: 1
    });
    const state = constructorSlice.reducer(stateWithIngredients, action);
    expect(state.ingredients).toHaveLength(3);
    expect(state.ingredients[0].id).toBe('second-id');
    expect(state.ingredients[1].id).toBe('first-id');
    expect(state.ingredients[2].id).toBe('third-id');
  });
});

describe('Проверяем работу селекторов в constructorSlice', () => {
  test('Тестируем селекторы: constructorSelector, getOrderIngredientsSelector, getBunsSelector', () => {
    const bunWithId = { ...mockBun, id: 'bun-id' };
    const mainWithId = { ...mockMain, id: 'main-id' };
    const sauceWithId = { ...mockSauce, id: 'sauce-id' };
    const fullState = {
      burgerConstructorSlice: {
        bun: bunWithId,
        ingredients: [mainWithId, sauceWithId]
      }
    };
    expect(constructorSlice.selectors.constructorSelector(fullState)).toEqual({
      bun: bunWithId,
      ingredients: [mainWithId, sauceWithId]
    });
    expect(
      constructorSlice.selectors.getOrderIngredientsSelector(fullState)
    ).toEqual([mainWithId, sauceWithId]);
    expect(constructorSlice.selectors.getBunsSelector(fullState)).toEqual(
      bunWithId
    );
  });
});
