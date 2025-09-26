import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';
import { createAsyncHandlers } from '@utils';

type TFeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const getFeedsApiAsync = createAsyncThunk('feeds/getFeeds', getFeedsApi);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {},
  extraReducers: (builder) => {
    const handlers = createAsyncHandlers();
    builder
      .addCase(getFeedsApiAsync.pending, handlers.pending)
      .addCase(getFeedsApiAsync.rejected, handlers.rejected)
      .addCase(getFeedsApiAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});
