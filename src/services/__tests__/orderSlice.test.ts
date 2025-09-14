import {
  getAllUserOrders,
  getOrderByNumber,
  orderBurger,
  initialState,
  orderSlice
} from '../orderSlice';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi,
  TNewOrderResponse
} from '@api';
import { configureStore } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

const newOrderResponse: TNewOrderResponse = {
  success: true,
  name: 'Флюоресцентный space астероидный традиционный-галактический минеральный экзо-плантаго бургер',
  order: {
    _id: '68c311f9673086001ba87d00',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0949',
      '643d69a5c3f7b9001cfa094a',
      '643d69a5c3f7b9001cfa0946',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa0944',
      '643d69a5c3f7b9001cfa0946',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'done',
    name: 'Флюоресцентный space астероидный традиционный-галактический минеральный экзо-плантаго бургер',
    createdAt: '2025-09-11T18:16:25.444Z',
    updatedAt: '2025-09-11T18:16:26.627Z',
    number: 88585
  }
};

const allUserOrders: TOrder[] = [
  {
    _id: '68c311f9673086001ba87d00',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0949',
      '643d69a5c3f7b9001cfa094a',
      '643d69a5c3f7b9001cfa0946',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa0944',
      '643d69a5c3f7b9001cfa0946',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'done',
    name: 'Флюоресцентный space астероидный традиционный-галактический минеральный экзо-плантаго бургер',
    createdAt: '2025-09-11T18:16:25.444Z',
    updatedAt: '2025-09-11T18:16:26.627Z',
    number: 88585
  },
  {
    _id: '68a17c09673086001ba833e1',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa0949',
      '643d69a5c3f7b9001cfa093c'
    ],
    status: 'done',
    name: 'Экзо-плантаго краторный space люминесцентный бургер',
    createdAt: '2025-08-17T06:51:53.311Z',
    updatedAt: '2025-08-17T06:51:54.147Z',
    number: 86687
  },
  {
    _id: '68b198ac673086001ba85505',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0940',
      '643d69a5c3f7b9001cfa0947',
      '643d69a5c3f7b9001cfa0942',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'done',
    name: 'Флюоресцентный spicy фалленианский метеоритный бургер',
    createdAt: '2025-08-29T12:10:20.888Z',
    updatedAt: '2025-08-29T12:10:21.742Z',
    number: 87441
  }
];

const orderByNumber = {
  orders: [
    {
      _id: '68c311f9673086001ba87d00',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0949',
        '643d69a5c3f7b9001cfa094a',
        '643d69a5c3f7b9001cfa0946',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa0944',
        '643d69a5c3f7b9001cfa0946',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный space астероидный традиционный-галактический минеральный экзо-плантаго бургер',
      createdAt: '2025-09-11T18:16:25.444Z',
      updatedAt: '2025-09-11T18:16:26.627Z',
      number: 88585
    }
  ]
};

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn(),
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

describe('Проверяем асинхронные запросы orderSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('Тестируем успешное получение нового заказа', async () => {
    (orderBurgerApi as jest.Mock).mockResolvedValue(newOrderResponse);
    const store = configureStore({
      reducer: { order: orderSlice.reducer }
    });
    await store.dispatch(orderBurger(['ing1', 'ing2', 'ing3']));
    const { order } = store.getState();
    expect(orderBurgerApi).toHaveBeenCalledWith(['ing1', 'ing2', 'ing3']);
    expect(orderBurgerApi).toHaveBeenCalledTimes(1);
    expect(order.orderResponse).toEqual(newOrderResponse);
    expect(order.loading).toBe(false);
    expect(order.error).toBeNull();
  });
  test('Тестируем успешное получение всех заказов пользователя', async () => {
    (getOrdersApi as jest.Mock).mockResolvedValue(allUserOrders);
    const store = configureStore({
      reducer: { order: orderSlice.reducer }
    });
    await store.dispatch(getAllUserOrders());
    const { order } = store.getState();
    expect(getOrdersApi).toHaveBeenCalledTimes(1);
    expect(order.userOrders).toEqual(allUserOrders);
    expect(order.loading).toBe(false);
    expect(order.error).toBeNull();
  });
  test('Тестируем успешное получение заказа по номеру', async () => {
    (getOrderByNumberApi as jest.Mock).mockResolvedValue(orderByNumber);
    const store = configureStore({
      reducer: { order: orderSlice.reducer }
    });
    await store.dispatch(getOrderByNumber(88585));
    const { order } = store.getState();
    expect(getOrderByNumberApi).toHaveBeenCalledWith(88585);
    expect(getOrderByNumberApi).toHaveBeenCalledTimes(1);
    expect(order.orderByNumber).toEqual(orderByNumber.orders[0]);
    expect(order.loading).toBe(false);
    expect(order.error).toBeNull();
  });
});

describe('Проверяем работу редьюсера resetOrder', () => {
  test('Тестируем сброс orderResponse', () => {
    const stateWithOrder = {
      userOrders: null,
      orderByNumber: null,
      orderResponse: newOrderResponse,
      loading: false,
      error: null
    };
    const action = orderSlice.actions.resetOrder();
    const state = orderSlice.reducer(stateWithOrder, action);
    expect(state.orderResponse).toBeNull();
    expect(state.userOrders).toBeNull();
    expect(state.orderByNumber).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});

describe('Проверяем обработку редьюсером экшенов генерируемых при выполнении асинхронных запросов в orderSlice', () => {
  describe('orderBurger', () => {
    test('Тестируем экшен начала запроса orderBurger (pending)', async () => {
      const action = { type: orderBurger.pending.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен успешного выполнения запроса orderBurger (fulfilled)', async () => {
      const action = {
        type: orderBurger.fulfilled.type,
        payload: newOrderResponse
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.orderResponse).toEqual(newOrderResponse);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен ошибки запроса orderBurger (rejected)', async () => {
      const errorMessage = 'К сожалению, возникла ошибка...';
      const action = {
        type: orderBurger.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orderResponse).toBeNull();
    });
  });
  describe('getAllUserOrders', () => {
    test('Тестируем экшен начала запроса getAllUserOrders (pending)', async () => {
      const action = { type: getAllUserOrders.pending.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен успешного выполнения запроса getAllUserOrders (fulfilled)', async () => {
      const action = {
        type: getAllUserOrders.fulfilled.type,
        payload: allUserOrders
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.userOrders).toEqual(allUserOrders);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен ошибки запроса getAllUserOrders (rejected)', async () => {
      const errorMessage = 'К сожалению, возникла ошибка...';
      const action = {
        type: getAllUserOrders.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.userOrders).toBeNull();
    });
  });
  describe('getOrderByNumber', () => {
    test('Тестируем экшен начала запроса getOrderByNumber (pending)', async () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = orderSlice.reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен успешного выполнения запроса getOrderByNumber (fulfilled)', async () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: orderByNumber
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.orderByNumber).toEqual(orderByNumber.orders[0]);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен ошибки запроса getOrderByNumber (rejected)', async () => {
      const errorMessage = 'К сожалению, возникла ошибка...';
      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      const state = orderSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orderByNumber).toBeNull();
    });
  });
});
