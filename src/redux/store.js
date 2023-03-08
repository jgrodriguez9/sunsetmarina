import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { messageReducer } from './messageSlice'
import { userReducer } from './userSlice'

const rootReducers = combineReducers({
  message: messageReducer,
  user: userReducer
})

export const store = configureStore({
  reducer: rootReducers,
})