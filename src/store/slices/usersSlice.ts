
'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { Role as SettingsRole } from './settingsSlice';


// ===== Interfaces =====
export interface User {
  _id: string;
  name: string;
  email: string;
  roleName: string;
  organizationName: string;
  status: 'active' | 'pending' | 'deactivated';
  createdAt: string;
  image?: { name: string, url: string }[] | null;
}

interface Organization {
    _id: string;
    name: string;
}

interface Team {
    _id: string;
    name: string;
    organizationId: string;
}

interface Role {
    _id: string;
    name: string;
    level: number;
}

interface UsersState {
  users: User[];
  totalUsers: number;
  page: number;
  limit: number;
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  isLoading: boolean;
  updatingUserId: string | null;
  error: string | null;
  // State for Add User Dialog
  organizations: Organization[];
  teams: Team[];
  roles: Role[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// ===== Initial State =====
const initialState: UsersState = {
  users: [],
  totalUsers: 0,
  page: 1,
  limit: 10,
  searchTerm: '',
  roleFilter: 'all',
  statusFilter: 'all',
  isLoading: true,
  updatingUserId: null,
  error: null,
  organizations: [],
  teams: [],
  roles: [],
  status: 'idle',
};

// ===== Async Thunks =====
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { auth: { token }, users: usersState } = state;

    if (!token) {
      return rejectWithValue('No authentication token found.');
    }

    try {
      const params = new URLSearchParams({
        page: usersState.page.toString(),
        limit: usersState.limit.toString(),
      });
      if (usersState.searchTerm) {
        params.append('search', usersState.searchTerm);
      }
      if (usersState.roleFilter !== 'all') {
        params.append('role', usersState.roleFilter);
      }
      if (usersState.statusFilter !== 'all') {
        params.append('status', usersState.statusFilter);
      }
      
      const response = await axios.get(`/api/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch users.');
    }
  }
);

export const fetchUsersByOrganization = createAsyncThunk(
  'users/fetchUsersByOrganization',
  async (organizationId: string, { getState, rejectWithValue }) => {
    const { auth: { token } } = getState() as RootState;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const response = await axios.get(`/api/users?organizationId=${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.users; // We just want the users array here
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch users.');
    }
  }
);

export const fetchOrganizations = createAsyncThunk(
    'users/fetchOrganizations',
    async (_, { getState, rejectWithValue }) => {
        const { auth: { token } } = getState() as RootState;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const response = await axios.get('/api/organizations', { headers: { Authorization: `Bearer ${token}` } });
            return response.data.organizations;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch organizations.');
        }
    }
);

export const fetchTeamsForOrg = createAsyncThunk(
    'users/fetchTeamsForOrg',
    async (orgId: string, { getState, rejectWithValue }) => {
        const { auth: { token } } = getState() as RootState;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const response = await axios.get(`/api/organizations/${orgId}/teams`, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch teams.');
        }
    }
);

export const createTeam = createAsyncThunk(
    'users/createTeam',
    async ({ organizationId, name }: { organizationId: string; name: string }, { getState, rejectWithValue }) => {
        const { auth: { token } } = getState() as RootState;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const response = await axios.post(`/api/organizations/${organizationId}/teams`, { name }, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create team.');
        }
    }
);

export const addUser = createAsyncThunk(
    'users/addUser',
    async (userData: any, { getState, rejectWithValue }) => {
        const { auth: { token } } = getState() as RootState;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const response = await axios.post('/api/users', userData, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add user.');
        }
    }
);

export const updateUserStatus = createAsyncThunk(
    'users/updateUserStatus',
    async ({ userId, status }: { userId: string, status: 'active' | 'deactivated' }, { getState, rejectWithValue }) => {
        const { auth: { token } } = getState() as RootState;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const response = await axios.patch(`/api/users/${userId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update user status.');
        }
    }
);

// ===== Slice Definition =====
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset to first page on limit change
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.page = 1; // Reset to first page on search change
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload;
      state.page = 1; // Reset to first page on filter change
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.page = 1; // Reset to first page on filter change
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<{ users: User[], totalUsers: number }>) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Users By Organization
      .addCase(fetchUsersByOrganization.pending, (state) => {
          state.isLoading = true;
          state.users = [];
      })
      .addCase(fetchUsersByOrganization.fulfilled, (state, action: PayloadAction<User[]>) => {
          state.isLoading = false;
          state.users = action.payload;
      })
      .addCase(fetchUsersByOrganization.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
      })
      // Fetch Organizations
      .addCase(fetchOrganizations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrganizations.fulfilled, (state, action: PayloadAction<Organization[]>) => {
        state.organizations = action.payload;
        state.status = 'succeeded';
      })
       .addCase(fetchOrganizations.rejected, (state) => {
        state.status = 'failed';
      })
      // Fetch Teams
      .addCase(fetchTeamsForOrg.fulfilled, (state, action: PayloadAction<Team[]>) => {
        state.teams = action.payload;
      })
      // Create Team
      .addCase(createTeam.fulfilled, (state, action: PayloadAction<Team>) => {
        state.teams.push(action.payload);
      })
      // Add User
      .addCase(addUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Update User Status
      .addCase(updateUserStatus.pending, (state, action) => {
        state.updatingUserId = action.meta.arg.userId;
      })
      .addCase(updateUserStatus.fulfilled, (state, action: PayloadAction<User>) => {
          const index = state.users.findIndex(user => user._id === action.payload._id);
          if (index !== -1) {
              state.users[index].status = action.payload.status;
          }
          state.updatingUserId = null;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
          state.error = action.payload as string;
          state.updatingUserId = null;
      })
      // Add roles from settingsSlice to usersSlice
      .addCase('settings/fetchRoles/fulfilled', (state, action: PayloadAction<SettingsRole[]>) => {
        state.roles = action.payload.map(({ _id, name, level }) => ({ _id, name, level }));
      });
  },
});

export const { setPage, setLimit, setSearchTerm, setRoleFilter, setStatusFilter } = usersSlice.actions;
export type { User };
export default usersSlice.reducer;

    