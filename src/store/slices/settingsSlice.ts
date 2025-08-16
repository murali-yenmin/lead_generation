
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// ===== Interfaces =====
export interface Role {
  _id: string;
  name: string;
  description: string;
  level: number;
  permissions: string[];
}

interface SettingsState {
  roles: Role[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

// ===== Initial State =====
const initialState: SettingsState = {
  roles: [],
  isLoading: false,
  isUpdating: false,
  error: null,
};

// ===== Async Thunks =====
export const fetchRoles = createAsyncThunk(
  'settings/fetchRoles',
  async (_, { getState, rejectWithValue }) => {
    const { auth: { token } } = getState() as RootState;
    if (!token) return rejectWithValue('Not authenticated');
    
    try {
      const response = await axios.get('/api/roles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch roles.');
    }
  }
);

export const updateRolePermissions = createAsyncThunk(
  'settings/updateRolePermissions',
  async ({ roleId, permissions }: { roleId: string; permissions: string[] }, { getState, rejectWithValue }) => {
    const { auth: { token } } = getState() as RootState;
    if (!token) return rejectWithValue('Not authenticated');

    try {
      const response = await axios.put(`/api/roles/${roleId}`, { permissions }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update permissions.');
    }
  }
);

// ===== Slice Definition =====
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Roles
      .addCase(fetchRoles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
        state.isLoading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Role Permissions
      .addCase(updateRolePermissions.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateRolePermissions.fulfilled, (state, action: PayloadAction<Role>) => {
        state.isUpdating = false;
        const index = state.roles.findIndex(role => role._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(updateRolePermissions.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export default settingsSlice.reducer;
