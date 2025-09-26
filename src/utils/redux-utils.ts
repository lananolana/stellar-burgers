import { PayloadAction } from '@reduxjs/toolkit';

export interface AsyncState {
  loading: boolean;
  error: string | null;
}

/**
 * Создает стандартные обработчики для асинхронных действий Redux Toolkit
 * @returns Объект с обработчиками pending, fulfilled, rejected
 */
export const createAsyncHandlers = <
  TData = any,
  TState extends AsyncState = AsyncState
>() => ({
  pending: (state: TState) => {
    state.loading = true;
    state.error = null;
  },
  fulfilled: (state: TState, action: PayloadAction<TData>) => {
    state.loading = false;
  },
  rejected: (state: TState, action: { error: { message?: string } }) => {
    state.loading = false;
    state.error = action.error.message || 'Произошла ошибка';
  }
});

/**
 * Создает обработчики для асинхронных действий с обновлением данных
 * @param dataField - поле состояния для сохранения данных
 * @returns Объект с обработчиками pending, fulfilled, rejected
 */
export const createAsyncDataHandlers = <
  TData = any,
  TState extends AsyncState = AsyncState
>(
  dataField: string
) => ({
  pending: (state: TState) => {
    state.loading = true;
    state.error = null;
  },
  fulfilled: (state: TState, action: PayloadAction<TData>) => {
    state.loading = false;
    (state as any)[dataField] = action.payload;
  },
  rejected: (state: TState, action: { error: { message?: string } }) => {
    state.loading = false;
    state.error = action.error.message || 'Произошла ошибка';
  }
});

/**
 * Создает обработчики для пользовательских действий с авторизацией
 */
export const createUserAsyncHandlers = () => ({
  pending: (state: any) => {
    state.loading = true;
    state.error = null;
  },
  fulfilled: (state: any, action: PayloadAction<any>) => {
    state.loading = false;
    if (action.payload) {
      state.user = action.payload.user || action.payload;
      state.isAuthorized = true;
    }
  },
  rejected: (state: any, action: { error: { message?: string } }) => {
    state.loading = false;
    state.error = action.error.message || 'Произошла ошибка';
    state.user = null;
    state.isAuthorized = false;
  }
});

/**
 * Создает обработчики для действий выхода пользователя
 */
export const createLogoutHandlers = () => ({
  pending: (state: any) => {
    state.loading = true;
    state.error = null;
  },
  fulfilled: (state: any) => {
    state.loading = false;
    state.user = null;
    state.isAuthorized = false;
  },
  rejected: (state: any, action: { error: { message?: string } }) => {
    state.loading = false;
    state.error = action.error.message || 'Произошла ошибка';
  }
});
