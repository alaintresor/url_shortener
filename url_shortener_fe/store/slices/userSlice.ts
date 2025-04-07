import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/apiHandler';
import { User, CreateUserPayload, LoginUserPayload } from '../../types/userTypes';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunk for creating a user
export const createUser = createAsyncThunk(
  'auth/createUser',
  async (userData: CreateUserPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<any>('/auth/register', userData);

      if (!response.isSuccess) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create user');
    }
  }
);

// Async thunk for authenticating a user
export const authenticateUser = createAsyncThunk(
  'auth/login',
  async (userData: LoginUserPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<any>('/auth/login', userData);

      if (!response.isSuccess) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to authenticate user');
    }
  }
);

// Async thunk for refreshing token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post<any>('/auth/refresh-token');

      if (!response.isSuccess) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to refresh token');
    }
  }
);

// Async thunk for logging out
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post<any>('/auth/logout');

      if (!response.isSuccess) {
        return rejectWithValue(response.error);
      }

      // Clear token from localStorage
      localStorage.removeItem('authToken');
      
      return response.data;
    } catch (error) {
      // Even if the API call fails, we should still clear the token
      localStorage.removeItem('authToken');
      return rejectWithValue('Failed to logout');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Handle createUser
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(createUser.fulfilled, (state, action: PayloadAction<any | null>) => {
      state.loading = false;
      if (action.payload) {
        state.user = action.payload.user;
        localStorage.setItem('authToken', action.payload.accessToken);
      }
      state.success = true;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle AuthenticateUser
    builder.addCase(authenticateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(authenticateUser.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.user = action.payload.user;
      localStorage.setItem('authToken', action.payload.accessToken);
      state.success = true;
    });
    builder.addCase(authenticateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle refreshToken
    builder.addCase(refreshToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(refreshToken.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      if (action.payload && action.payload.accessToken) {
        localStorage.setItem('authToken', action.payload.accessToken);
      }
    });
    builder.addCase(refreshToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Clear token on refresh failure
      localStorage.removeItem('authToken');
    });

    // Handle logoutUser
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.success = true;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Still clear user data on logout failure
      state.user = null;
    });
  },
});

export const { resetUserState, clearUser } = userSlice.actions;
export default userSlice.reducer;