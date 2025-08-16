
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// ===== Interfaces =====
interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string; // Added roleName
  organizationId: string;
  teamId: string | null;
  image?: { name: string; url: string; }[] | null;
  permissions?: string[]; // Added permissions
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ===== Initial State =====
const getInitialState = (): AuthState => {
  // Always start with isLoading: true to prevent hydration mismatch.
  // The actual auth state will be determined on the client in an effect.
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, 
    error: null,
  };
};


// ===== Async Thunks =====
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/auth/register', userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (profileData: any, { rejectWithValue, getState }) => {
        try {
            // In a real app, you'd send this to an API endpoint
            // For now, we simulate the update and return the new user data
            // await axios.put('/api/user/profile', profileData);
            return profileData;
        } catch (error: any) {
             return rejectWithValue(error.response?.data?.message || 'Profile update failed');
        }
    }
)


// ===== Slice Definition =====
const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    },
    checkInitialAuth: (state) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            const userString = localStorage.getItem('user');
            let user: User | null = null;

            try {
                user = userString ? JSON.parse(userString) : null;
            } catch (e) {
                user = null;
                 localStorage.removeItem('user');
                 localStorage.removeItem('authToken');
            }
            
            state.token = token;
            state.user = user;
            state.isAuthenticated = !!token && !!user;
            state.isLoading = false;
        }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
       .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
          // Optionally set a loading state for profile updates
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<Partial<User>>) => {
          if (state.user) {
              const updatedUser = { ...state.user, ...action.payload };
              state.user = updatedUser;
              if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(updatedUser));
              }
          }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
          // Optionally set an error state for profile updates
          console.error("Profile update failed:", action.payload);
      });
  },
});

export const { logoutUser, checkInitialAuth } = authSlice.actions;
export default authSlice.reducer;
