import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { messageReducer } from './messageSlice'

const rootReducers = combineReducers({
  message: messageReducer
})

export const store = configureStore({
  reducer: rootReducers,
})