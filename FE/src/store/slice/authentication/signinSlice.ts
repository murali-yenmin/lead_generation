import { createSlice } from '@reduxjs/toolkit';
import { signinUser } from '../../asyncThunks/auth';

interface UserState {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const signinSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setValue: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinUser.pending, (state) => {
        state.loading = true; // Set loading to true while the API request is pending
        state.error = null; // Reset error
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when the API request is successful
        state.user = action.payload; // Store the API response (user data)
        state.error = null; // Clear error on successful response
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false; // Set loading to false when the request fails
        state.error = action.error.message ?? 'signin failed'; // Set the error message
      });
  },
});

export const { setValue } = signinSlice.actions;

export default signinSlice.reducer;
