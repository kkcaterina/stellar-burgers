import {
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  getUser,
  userSlice,
  initialState
} from '../userSlice';
import {
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  getUserApi
} from '@api';
import { configureStore } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from '../../utils/cookie';

const testUser = {
  user: {
    email: 'mmm555@mail.ru',
    name: 'Василина'
  },
  accessToken: 'testAccessToken',
  refreshToken: 'testRefreshToken'
};

const testUserData = {
  email: 'mmm555@mainModule.ru',
  name: 'Василина',
  password: 'password123'
};

jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  registerUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  getUserApi: jest.fn()
}));

jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

global.localStorage = localStorageMock as any;

describe('Проверяем асинхронные запросы userSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('Тестируем успешный логин пользователя', async () => {
    (loginUserApi as jest.Mock).mockResolvedValue(testUser);
    const store = configureStore({
      reducer: { user: userSlice.reducer }
    });
    await store.dispatch(loginUser(testUserData));
    const { user } = store.getState();
    expect(loginUserApi).toHaveBeenCalledWith(testUserData);
    expect(loginUserApi).toHaveBeenCalledTimes(1);
    expect(setCookie).toHaveBeenCalledWith('accessToken', testUser.accessToken);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      testUser.refreshToken
    );
    expect(user.user).toEqual(testUser.user);
    expect(user.accessToken).toBe(testUser.accessToken);
    expect(user.refreshToken).toBe(testUser.refreshToken);
    expect(user.isAuthChecked).toBe(true);
    expect(user.loading).toBe(false);
    expect(user.error).toBeNull();
  });
  test('Тестируем успешную региистрацию пользователя', async () => {
    (registerUserApi as jest.Mock).mockResolvedValue(testUser);
    const store = configureStore({
      reducer: { user: userSlice.reducer }
    });
    await store.dispatch(registerUser(testUserData));
    const { user } = store.getState();
    expect(registerUserApi).toHaveBeenCalledWith(testUserData);
    expect(registerUserApi).toHaveBeenCalledTimes(1);
    expect(setCookie).toHaveBeenCalledWith('accessToken', testUser.accessToken);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      testUser.refreshToken
    );
    expect(user.user).toEqual(testUser.user);
    expect(user.accessToken).toBe(testUser.accessToken);
    expect(user.refreshToken).toBe(testUser.refreshToken);
    expect(user.isAuthChecked).toBe(true);
    expect(user.loading).toBe(false);
  });
  test('Тестируем успешное обновление данных пользователя', async () => {
    (updateUserApi as jest.Mock).mockResolvedValue({ user: testUser.user });
    const store = configureStore({
      reducer: { user: userSlice.reducer }
    });
    await store.dispatch(updateUser({ name: 'Аделина' }));
    const { user } = store.getState();
    expect(updateUserApi).toHaveBeenCalledWith({ name: 'Аделина' });
    expect(updateUserApi).toHaveBeenCalledTimes(1);
    expect(user.user).toEqual(testUser.user);
    expect(user.loading).toBe(false);
    expect(user.error).toBeNull();
  });
  test('Тестируем успешный выход из аккаунта', async () => {
    (logoutApi as jest.Mock).mockResolvedValue({ success: true });
    const store = configureStore({
      reducer: { user: userSlice.reducer },
      preloadedState: {
        user: {
          ...initialState,
          user: testUser.user,
          accessToken: testUser.accessToken,
          refreshToken: testUser.refreshToken
        }
      }
    });
    await store.dispatch(logoutUser());
    const { user } = store.getState();
    expect(logoutApi).toHaveBeenCalledTimes(1);
    expect(deleteCookie).toHaveBeenCalledWith('accessToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(user.user).toBeNull();
    expect(user.accessToken).toBeNull();
    expect(user.refreshToken).toBeNull();
    expect(user.loading).toBe(false);
  });
  test('Тестируем успешное получение пользователя', async () => {
    (getUserApi as jest.Mock).mockResolvedValue({ user: testUser.user });
    const store = configureStore({
      reducer: { user: userSlice.reducer }
    });
    await store.dispatch(getUser());
    const { user } = store.getState();
    expect(getUserApi).toHaveBeenCalledTimes(1);
    expect(user.user).toEqual(testUser.user);
    expect(user.isAuthChecked).toBe(true);
    expect(user.loading).toBe(false);
    expect(user.error).toBeNull();
  });
});

describe('Проверяем обработку редьюсером экшенов генерируемых при выполнении асинхронных запросов в userSlice', () => {
  describe('Логин: loginUser', () => {
    test('Тестируем экшен начала запроса loginUser (pending)', () => {
      const action = { type: loginUser.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен успешного выполнения запроса loginUser (fulfilled)', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: testUser
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(testUser.user);
      expect(state.accessToken).toBe(testUser.accessToken);
      expect(state.refreshToken).toBe(testUser.refreshToken);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен ошибки запроса loginUser (rejected)', () => {
      const errorMessage = 'К сожалению, возникла ошибка...';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(false);
    });
  });
  describe('Регистрация: registerUser', () => {
    test('Тестируем экшен начала запроса registerUser (pending)', () => {
      const action = { type: registerUser.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен успешного выполнения запроса registerUser (fulfilled)', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: testUser
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(testUser.user);
      expect(state.accessToken).toBe(testUser.accessToken);
      expect(state.refreshToken).toBe(testUser.refreshToken);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен ошибки запроса registerUser (rejected)', () => {
      const errorMessage = 'К сожалению, возникла ошибка...';
      const action = {
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(false);
    });
  });
  describe('Обновление данных пользователя: updateUser', () => {
    test('Тестируем экшен начала запроса updateUser (pending)', () => {
      const action = { type: updateUser.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен успешного выполнения запроса updateUser (fulfilled)', () => {
      const action = {
        type: updateUser.fulfilled.type,
        payload: { user: testUser.user }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(testUser.user);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен ошибки запроса updateUser (rejected)', () => {
      const errorMessage = 'К сожалению, возникла ошибка...';
      const action = {
        type: updateUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
    });
  });
  describe('Выход из аккаунта: logoutUser', () => {
    test('Тестируем экшен начала запроса logoutUser (pending)', () => {
      const action = { type: logoutUser.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен успешного выполнения запроса logoutUser (fulfilled)', () => {
      const stateWithUser = {
        ...initialState,
        user: testUser.user,
        accessToken: testUser.accessToken,
        refreshToken: testUser.refreshToken
      };
      const action = { type: logoutUser.fulfilled.type };
      const state = userSlice.reducer(stateWithUser, action);
      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен ошибки запроса logoutUser (rejected)', () => {
      const errorMessage = 'К сожалению, возникла ошибка...';
      const action = {
        type: logoutUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
  describe('Получение пользователя: getUser', () => {
    test('Тестируем экшен начала запроса getUser (pending)', () => {
      const action = { type: getUser.pending.type };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(true);
    });
    test('Тестируем экшен успешного выполнения запроса getUser (fulfilled)', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: { user: testUser.user }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(testUser.user);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });
    test('Тестируем экшен ошибки запроса getUser (rejected)', () => {
      const errorMessage = 'К сожалению, возникла ошибка...';
      const action = {
        type: getUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userSlice.reducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
    });
  });
});
