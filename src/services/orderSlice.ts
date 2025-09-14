import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi,
  TNewOrderResponse
} from '@api';
import { TOrder } from '@utils-types';
import { createSlice } from '@reduxjs/toolkit';

export const getAllUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'orders/orderByNumber',
  async (orderNumber: number) => {
    const order = await getOrderByNumberApi(orderNumber);
    return order;
  }
);

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (burgerIngredients: string[]) => {
    const orderBurger = await orderBurgerApi(burgerIngredients);
    return orderBurger;
  }
);

type OrderState = {
  userOrders: TOrder[] | null;
  orderByNumber: TOrder | null;
  orderResponse: TNewOrderResponse | null;
  loading: boolean;
  error: string | null | undefined;
};

export const initialState: OrderState = {
  userOrders: null,
  orderByNumber: null,
  orderResponse: null,
  loading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'orderSlice',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderResponse = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.loading = false;
        state.orderResponse = action.payload;
      })
      .addCase(getAllUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderByNumber = action.payload.orders[0];
      });
  },
  selectors: {
    orderResponseSelector: (state) => state.orderResponse,
    getAllUserOrdersSelector: (state) => state.userOrders,
    getOrderByNumberSelector: (state) => state.orderByNumber,
    loadingSelector: (state) => state.loading
  }
});

export const { resetOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
export const {
  orderResponseSelector,
  getAllUserOrdersSelector,
  getOrderByNumberSelector,
  loadingSelector
} = orderSlice.selectors;
