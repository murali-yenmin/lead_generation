import { combineReducers, configureStore } from '@reduxjs/toolkit';
import signinUser from './slice/authentication/signinSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducers from './slice/authentication/authSlice';

const rentPaymentStoreData = {
  signinReducer: signinUser,
  authReducer: authReducers,
};
const combinedReducer = combineReducers(rentPaymentStoreData);

// Root reducer with state reset on logout
const rootReducer = (state: ReturnType<typeof combinedReducer> | undefined, action: any) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;

// Typed Hooks
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useRentPaymentStore = () => {
  return rentPaymentStoreData;
};
