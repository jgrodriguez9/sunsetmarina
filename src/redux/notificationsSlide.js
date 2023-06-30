import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    page: '',
    loading: true,
    refecth: false,
  },
  reducers: {
    addNotifications: (state, action) => {
        state.items = action.payload.list;
        state.page = 'home';
        state.loading = false;
        state.refecth = false;
    },
    refecthNotifications: (state, action) => {
        state.loading = true;
        state.refecth = true;
    },
    clearNotifications: (state, action) => {
      state.items = [];
      state.page = '';
      state.loading = true;
    },
  },
});

export const notificationsReducer = notificationSlice.reducer;
export const {
    addNotifications,
    refecthNotifications,
    clearNotifications,
} = notificationSlice.actions;