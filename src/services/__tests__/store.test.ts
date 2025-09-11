import { rootReducer } from '../store';

describe('Проверяем правильную инициализацию rootReducer', () => {
  test('Тестируем вызов rootReducer с undefined состоянием и UNKNOWN_ACTION', () => {
    const initialState = {
      ingredientsSlice: {
        ingredients: [],
        loading: false,
        error: null
      },
      feedSlice: {
        orders: [],
        total: null,
        totalToday: null,
        loading: false,
        error: null
      },
      burgerConstructorSlice: {
        bun: null,
        ingredients: []
      },
      userSlice: {
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null,
        refreshToken: null,
        accessToken: null
      },
      orderSlice: {
        userOrders: null,
        orderByNumber: null,
        orderResponse: null,
        loading: false,
        error: null
      }
    };
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, action);
    expect(state).toEqual(initialState);
  });
});
