import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

export const getAllFeeds = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

type TFeedState = {
  orders: TOrder[];
  total: number | null;
  totalToday: number | null;
  loading: boolean;
  error: string | null | undefined;
};

export const initialState: TFeedState = {
  orders: [],
  total: null,
  totalToday: null,
  loading: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feedSlice',
  initialState,
  reducers: {},
  selectors: {
    getAllOrdersSelector: (state) => state.orders,
    getTotalOrdersSelector: (state) => state.total,
    getTotalTodayOrdersSelector: (state) => state.totalToday,
    getFeedsLoadingSelector: (state) => state.loading,
    getFeedsErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      });
  }
});

export const {
  getAllOrdersSelector,
  getTotalOrdersSelector,
  getTotalTodayOrdersSelector,
  getFeedsLoadingSelector,
  getFeedsErrorSelector
} = feedSlice.selectors;
