import { initialState, getAllFeeds, feedSlice } from '../feedSlice';
import { getFeedsApi } from '@api';
import { configureStore } from '@reduxjs/toolkit';

const feedsResponse = {
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
  ],
  total: 3,
  totalToday: 3
};

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

describe('Проверяем загрузку заказов', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('Тестируем успешное получение заказов', async () => {
    (getFeedsApi as jest.Mock).mockResolvedValue(feedsResponse);
    const store = configureStore({
      reducer: { feed: feedSlice.reducer }
    });
    await store.dispatch(getAllFeeds());
    const { feed } = store.getState();
    expect(getFeedsApi).toHaveBeenCalledTimes(1);
    expect(feed.orders).toEqual(feedsResponse.orders);
    expect(feed.total).toBe(feedsResponse.total);
    expect(feed.totalToday).toBe(feedsResponse.totalToday);
    expect(feed.loading).toBe(false);
    expect(feed.error).toBeNull();
    expect(feed.orders).toHaveLength(3);
  });
});

describe('Проверяем обработку редьюсером экшенов генерируемых при выполнении асинхронного запроса в feedSlice', () => {
  test('Тестируем экшен начала запроса (pending)', () => {
    const action = { type: getAllFeeds.pending.type };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual([]);
    expect(state.total).toBeNull();
    expect(state.totalToday).toBeNull();
  });
  test('Тестируем экшен успешного выполнения запроса (fulfilled)', () => {
    const action = {
      type: getAllFeeds.fulfilled.type,
      payload: feedsResponse
    };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(feedsResponse.orders);
    expect(state.total).toBe(feedsResponse.total);
    expect(state.totalToday).toBe(feedsResponse.totalToday);
    expect(state.orders).toHaveLength(3);
  });
  test('Тестируем экшен ошибки запроса (rejected)', () => {
    const errorMessage = 'К сожалению, возникла ошибка...';
    const action = {
      type: getAllFeeds.rejected.type,
      error: { message: errorMessage }
    };
    const state = feedSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.orders).toEqual([]);
    expect(state.total).toBeNull();
    expect(state.totalToday).toBeNull();
  });
});
