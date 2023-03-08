import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
      roles: [],
      name: null
    },
    reducers: {
      setUser: (state, action) => {
        state.roles = action.payload.roles;
        state.name = action.payload.name;
      },
      clearUser: (state, action) => {
        state.roles =[];
        state.name = null;
      },
    },
  });
  
  export const userReducer = userSlice.reducer;
  export const {
    setUser,
    clearUser,
  } = userSlice.actions;