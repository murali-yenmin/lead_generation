import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import settingsReducer from './slices/settingsSlice';
import clientsReducer from './slices/clientsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  settings: settingsReducer,
  clients: clientsReducer,
});

export default rootReducer;
