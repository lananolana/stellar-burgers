import { TOrder, TUser } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import {
  createAsyncHandlers,
  createUserAsyncHandlers,
  createLogoutHandlers
} from '@utils';

type TUserState = {
  isAuthorized: boolean;
  user: TUser | null;
  loading: boolean;
  error: string | null;
  orders: TOrder[];
  orderLoading: boolean;
  orderError: string | null;
};

const initialState: TUserState = {
  isAuthorized: false,
  user: null,
  loading: false,
  error: null,
  orders: [],
  orderLoading: false,
  orderError: null
};

export const getOrdersApiAsync = createAsyncThunk(
  'user/getOrders',
  getOrdersApi
);

export const registerUserApiAsync = createAsyncThunk(
  'user/registerUser',
  async (registerData: TRegisterData) => {
    const response = await registerUserApi(registerData);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response.user;
  }
);

export const loginUserApiAsync = createAsyncThunk(
  'user/loginUser',
  async (loginData: TLoginData) => {
    const response = await loginUserApi(loginData);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    } else {
      throw new Error('Login failed');
    }
    return response;
  }
);

export const logoutUserApiAsync = createAsyncThunk(
  'user/logoutUser',
  async () => {
    const response = await logoutApi();
    if (response.success) {
      localStorage.clear();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
);

export const checkUserAuthAsync = createAsyncThunk(
  'user/checkAuthUser',
  async () => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      return null;
    }
    const response = await getUserApi();
    if (!response.success || !response.user) {
      deleteCookie('accessToken');
      throw new Error('Check Auth Error');
    }
    return response.user;
  }
);

export const updateUserApiAsync = createAsyncThunk(
  'user/updateUser',
  updateUserApi
);

export const forgotPasswordApiAsync = createAsyncThunk(
  'user/forgotPassword',
  forgotPasswordApi
);

export const resetPasswordApiAsync = createAsyncThunk(
  'user/resetPassword',
  resetPasswordApi
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {},
  extraReducers: (builder) => {
    /**
     * getOrdersApiAsync
     */
    builder
      .addCase(getOrdersApiAsync.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(getOrdersApiAsync.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.error.message || null;
      })
      .addCase(getOrdersApiAsync.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orders = action.payload;
      });

    /**
     * registerUserApiAsync
     */
    const registerHandlers = createUserAsyncHandlers();
    builder
      .addCase(registerUserApiAsync.pending, registerHandlers.pending)
      .addCase(registerUserApiAsync.rejected, registerHandlers.rejected)
      .addCase(registerUserApiAsync.fulfilled, registerHandlers.fulfilled);

    /**
     * loginUserApiAsync
     */
    const loginHandlers = createUserAsyncHandlers();
    builder
      .addCase(loginUserApiAsync.pending, loginHandlers.pending)
      .addCase(loginUserApiAsync.rejected, loginHandlers.rejected)
      .addCase(loginUserApiAsync.fulfilled, loginHandlers.fulfilled);

    /**
     * logoutUserApiAsync
     */
    const logoutHandlers = createLogoutHandlers();
    builder
      .addCase(logoutUserApiAsync.pending, logoutHandlers.pending)
      .addCase(logoutUserApiAsync.rejected, logoutHandlers.rejected)
      .addCase(logoutUserApiAsync.fulfilled, logoutHandlers.fulfilled);

    /**
     * checkUserAuthAsync
     */
    builder
      .addCase(checkUserAuthAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserAuthAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
        state.user = null;
        state.isAuthorized = false;
      })
      .addCase(checkUserAuthAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthorized = action.payload != null;
      });

    /**
     * updateUserApiAsync
     */
    const updateHandlers = createAsyncHandlers();
    builder
      .addCase(updateUserApiAsync.pending, updateHandlers.pending)
      .addCase(updateUserApiAsync.rejected, updateHandlers.rejected)
      .addCase(updateUserApiAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      });

    /**
     * forgotPasswordApiAsync
     */
    const forgotPasswordHandlers = createAsyncHandlers();
    builder
      .addCase(forgotPasswordApiAsync.pending, forgotPasswordHandlers.pending)
      .addCase(forgotPasswordApiAsync.rejected, forgotPasswordHandlers.rejected)
      .addCase(
        forgotPasswordApiAsync.fulfilled,
        forgotPasswordHandlers.fulfilled
      );

    /**
     * resetPasswordApiAsync
     */
    const resetPasswordHandlers = createAsyncHandlers();
    builder
      .addCase(resetPasswordApiAsync.pending, resetPasswordHandlers.pending)
      .addCase(resetPasswordApiAsync.rejected, resetPasswordHandlers.rejected)
      .addCase(
        resetPasswordApiAsync.fulfilled,
        resetPasswordHandlers.fulfilled
      );
  }
});
