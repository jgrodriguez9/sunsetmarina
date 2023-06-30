import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { messageReducer } from './messageSlice'
import { userReducer } from './userSlice'
import { notificationsReducer } from './notificationsSlide'

const rootReducers = combineReducers({
  message: messageReducer,
  user: userReducer,
  notification: notificationsReducer 
})

export const store = configureStore({
  reducer: rootReducers,
})