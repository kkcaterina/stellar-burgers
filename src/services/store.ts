import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './ingredientsSlice';
import { constructorSlice } from './constructorSlice';
import { feedSlice } from './feedSlice';
import { userSlice } from './userSlice';
import { orderSlice } from './orderSlice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  feedSlice,
  constructorSlice,
  userSlice,
  orderSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
