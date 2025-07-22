import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  email: null,
  token: null,
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    storeEmail: (state, action) => {
      state.email = action.payload;
    },
    storeToken: (state, action) => {
      state.token = action.payload;
    },
    clearEmail: (state) => {
      state.email = null;
    },
    clearToken: (state) => {
      state.token = null;
    },
    storeUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
    },
  },
});

export const { storeEmail, clearEmail, storeToken, clearToken, storeUserData, clearUserData } =
  authSlice.actions;
export default authSlice.reducer;

export const authReducers = () => {
  clearToken();
};
