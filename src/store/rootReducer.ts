import { combineReducers } from '@reduxjs/toolkit';

// This is a placeholder for a real reducer.
const placeholderReducer = (state = {}, action) => {
  return state;
};

const rootReducer = combineReducers({
  // Add your reducers here
  placeholder: placeholderReducer,
});

export default rootReducer;
