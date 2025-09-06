import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { createAsyncDataHandlers } from '@utils';

type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const getIngredientsAsync = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialState,
  reducers: {},
  selectors: {},
  extraReducers: (builder) => {
    const handlers = createAsyncDataHandlers<TIngredient[]>('ingredients');
    builder
      .addCase(getIngredientsAsync.pending, handlers.pending)
      .addCase(getIngredientsAsync.rejected, handlers.rejected)
      .addCase(getIngredientsAsync.fulfilled, handlers.fulfilled);
  }
});
