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
    builder
      .addCase(registerUserApiAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserApiAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(registerUserApiAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthorized = true;
      });

    /**
     * loginUserApiAsync
     */
    builder
      .addCase(loginUserApiAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserApiAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(loginUserApiAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthorized = true;
      });

    /**
     * logoutUserApiAsync
     */
    builder
      .addCase(logoutUserApiAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserApiAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(logoutUserApiAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthorized = false;
      });

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
    builder
      .addCase(updateUserApiAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserApiAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(updateUserApiAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      });

    /**
     * forgotPasswordApiAsync
     */
    builder
      .addCase(forgotPasswordApiAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordApiAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(forgotPasswordApiAsync.fulfilled, (state) => {
        state.loading = false;
      });

    /**
     * resetPasswordApiAsync
     */
    builder
      .addCase(resetPasswordApiAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordApiAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(resetPasswordApiAsync.fulfilled, (state) => {
        state.loading = false;
      });
  }
});
