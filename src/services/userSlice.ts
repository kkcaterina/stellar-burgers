import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  getUserApi
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../utils/cookie';

export const loginUser = createAsyncThunk(
  'user/loginInfo',
  async (loginUserInfo: TLoginData) => {
    const loginInfo = await loginUserApi(loginUserInfo);
    localStorage.setItem('refreshToken', loginInfo.refreshToken);
    setCookie('accessToken', loginInfo.accessToken);
    return loginInfo;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerInfo',
  async (registerUserInfo: TRegisterData) => {
    const registerInfo = await registerUserApi(registerUserInfo);
    localStorage.setItem('refreshToken', registerInfo.refreshToken);
    setCookie('accessToken', registerInfo.accessToken);
    return registerInfo;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateInfo',
  async (updateUserInfo: Partial<TRegisterData>) => {
    const updateInfo = await updateUserApi(updateUserInfo);
    return updateInfo;
  }
);

export const logoutUser = createAsyncThunk('user/logoutAccount', async () => {
  const logout = await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
  return logout;
});

export const getUser = createAsyncThunk('user/getInfo', getUserApi);

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null | undefined;
  refreshToken: string | null;
  accessToken: string | null;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null,
  refreshToken: null,
  accessToken: null
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      });
  },
  selectors: {
    userSelector: (state) => state.user,
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    loadingSelector: (state) => state.loading
  }
});

export const { userSelector, isAuthCheckedSelector, loadingSelector } =
  userSlice.selectors;
export const userReducer = userSlice.reducer;
