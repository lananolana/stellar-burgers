import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi, orderBurgerApi } from '@api';

type TOrdersState = {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orderModalData: null,
  orderRequest: false,
  loading: false,
  error: null
};

export const orderBurgerApiAsync = createAsyncThunk(
  'order/createOrder',
  orderBurgerApi
);

export const getOrderByNumberApiAsync = createAsyncThunk(
  'order/getOrderByNumber',
  getOrderByNumberApi
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: () => initialState
  },
  selectors: {},
  extraReducers: (builder) => {
    /**
     * orderBurgerApiAsync
     */
    builder
      .addCase(orderBurgerApiAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderRequest = true;
      })
      .addCase(orderBurgerApiAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
        state.orderRequest = false;
      })
      .addCase(orderBurgerApiAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      });

    /**
     * getOrderByNumberApiAsync
     */
    builder
      .addCase(getOrderByNumberApiAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumberApiAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(getOrderByNumberApiAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModalData = action.payload.orders?.[0];
      });
  }
});
