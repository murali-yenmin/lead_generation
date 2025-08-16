
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// ===== Interfaces =====
export interface Client {
  _id: string;
  name: string;
  domain?: string;
  status: 'active' | 'deactivated' | 'pending';
  createdAt: string;
  updatedAt: string;
  settings?: {
    socialMediaUrl?: string;
    emailUrl?: string;
  };
}

interface ClientsState {
  clients: Client[];
  selectedClient: Client | null;
  totalClients: number;
  page: number;
  limit: number;
  searchTerm: string;
  statusFilter: string;
  isLoading: boolean;
  isUpdatingSettings: boolean;
  updatingClientId: string | null;
  error: string | null;
}

// ===== Initial State =====
const initialState: ClientsState = {
  clients: [],
  selectedClient: null,
  totalClients: 0,
  page: 1,
  limit: 10,
  searchTerm: '',
  statusFilter: 'all',
  isLoading: true,
  isUpdatingSettings: false,
  updatingClientId: null,
  error: null,
};

// ===== Async Thunks =====
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { auth: { token }, clients: clientsState } = state;

    if (!token) {
      return rejectWithValue('No authentication token found.');
    }

    try {
      const params = new URLSearchParams({
        page: clientsState.page.toString(),
        limit: clientsState.limit.toString(),
      });
      if (clientsState.searchTerm) {
        params.append('search', clientsState.searchTerm);
      }
      if (clientsState.statusFilter !== 'all') {
        params.append('status', clientsState.statusFilter);
      }
      
      const response = await axios.get(`/api/organizations?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch clients.');
    }
  }
);

export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (clientId: string, { getState, rejectWithValue }) => {
    const { auth: { token } } = getState() as RootState;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const response = await axios.get(`/api/organizations/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch client.');
    }
  }
);

export const createClient = createAsyncThunk(
    'clients/createClient',
    async (clientData: { name: string, domain: string }, { getState, rejectWithValue }) => {
        const { auth: { token } } = getState() as RootState;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const response = await axios.post('/api/organizations', clientData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create client.');
        }
    }
)

export const updateClientStatus = createAsyncThunk(
    'clients/updateClientStatus',
    async ({ clientId, status }: { clientId: string, status: 'active' | 'deactivated' }, { getState, rejectWithValue }) => {
        const { auth: { token } } = getState() as RootState;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const response = await axios.patch(`/api/organizations/${clientId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update client status.');
        }
    }
);

export const updateClientSettings = createAsyncThunk(
    'clients/updateClientSettings',
    async ({ clientId, settings }: { clientId: string; settings: { socialMediaUrl?: string, emailUrl?: string } }, { getState, rejectWithValue }) => {
        const { auth: { token } } = getState() as RootState;
        if (!token) return rejectWithValue('Not authenticated');
        try {
            const response = await axios.patch(`/api/organizations/${clientId}/settings`, { settings }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update settings.');
        }
    }
);


// ===== Slice Definition =====
const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClientsPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setClientsLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset to first page on limit change
    },
    setClientsSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.page = 1; // Reset to first page on search change
    },
    setClientsStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.page = 1; // Reset to first page on filter change
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<{ organizations: Client[], totalOrganizations: number }>) => {
        state.isLoading = false;
        state.clients = action.payload.organizations;
        state.totalClients = action.payload.totalOrganizations;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Client By ID
      .addCase(fetchClientById.pending, (state) => {
        state.isLoading = true;
        state.selectedClient = null;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action: PayloadAction<Client>) => {
        state.isLoading = false;
        state.selectedClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Client
      .addCase(createClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createClient.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Client Status
      .addCase(updateClientStatus.pending, (state, action) => {
        state.updatingClientId = action.meta.arg.clientId;
      })
      .addCase(updateClientStatus.fulfilled, (state, action: PayloadAction<Client>) => {
          const index = state.clients.findIndex(client => client._id === action.payload._id);
          if (index !== -1) {
              state.clients[index].status = action.payload.status;
          }
          state.updatingClientId = null;
      })
      .addCase(updateClientStatus.rejected, (state, action) => {
          state.error = action.payload as string;
          state.updatingClientId = null;
      })
      // Update Client Settings
      .addCase(updateClientSettings.pending, (state) => {
        state.isUpdatingSettings = true;
        state.error = null;
      })
      .addCase(updateClientSettings.fulfilled, (state, action: PayloadAction<Client>) => {
          state.isUpdatingSettings = false;
          if (state.selectedClient && state.selectedClient._id === action.payload._id) {
              state.selectedClient = action.payload;
          }
           const index = state.clients.findIndex(client => client._id === action.payload._id);
            if (index !== -1) {
                state.clients[index] = action.payload;
            }
      })
      .addCase(updateClientSettings.rejected, (state, action) => {
          state.isUpdatingSettings = false;
          state.error = action.payload as string;
      });
  },
});

export const { setClientsPage, setClientsLimit, setClientsSearchTerm, setClientsStatusFilter } = clientsSlice.actions;

export default clientsSlice.reducer;
